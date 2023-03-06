use std::vec;

#[tokio::main]
pub async fn main() -> anyhow::Result<()> {
    let result = reqwest::get(
        "https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/vscode/index.d.ts",
    )
    .await?
    .text()
    .await?;

    let comments = swc_common::comments::SingleThreadedComments::default();
    let lexer = swc_ecma_parser::lexer::Lexer::new(
        swc_ecma_parser::Syntax::Typescript(swc_ecma_parser::TsConfig {
            tsx: false,
            decorators: false,
            dts: true,
            no_early_errors: true,
        }),
        swc_ecma_ast::EsVersion::Es2022,
        swc_ecma_parser::StringInput::new(
            &result,
            swc_common::source_map::BytePos(0),
            swc_common::source_map::BytePos((result.as_bytes().len() - 1) as u32),
        ),
        Some(&comments),
    );
    let mut parser = swc_ecma_parser::Parser::new_from(lexer);
    let module = parser
        .parse_typescript_module()
        .map_err(|_| Error::ParseModuleError)?;

    let first_module_item = module.body.first().ok_or(Error::NotFoundModule)?;

    let first_module_body = first_module_item
        .clone()
        .expect_stmt()
        .expect_decl()
        .expect_ts_module()
        .body
        .ok_or(Error::FirstModuleBodyNotFound)?;

    let first_module_block = first_module_body.expect_ts_module_block();

    let filtered = first_module_block
        .body
        .into_iter()
        .filter_map(|b| module_item_transform(&b))
        .collect::<Vec<_>>();

    let result = swc_ecma_ast::TsModuleBlock {
        span: swc_common::Span::default(),
        body: filtered,
    };

    let cm = std::sync::Arc::<swc_common::SourceMap>::default();
    let mut buf = vec![];
    let writer = swc_ecma_codegen::text_writer::JsWriter::new(cm.clone(), "\n", &mut buf, None);

    let mut emitter = swc_ecma_codegen::Emitter {
        cfg: Default::default(),
        comments: Some(&comments),
        cm: cm.clone(),
        wr: writer,
    };

    swc_ecma_codegen::Node::emit_with(&result, &mut emitter)?;

    let code = String::from_utf8(buf)?;

    let _ = std::fs::write("./out.d.ts", code)?;

    Ok(())
}

#[derive(thiserror::Error, Debug)]
pub enum Error {
    #[error("parse module error")]
    ParseModuleError,

    #[error("module not found")]
    NotFoundModule,

    #[error("first module body not found")]
    FirstModuleBodyNotFound,
}

fn module_item_transform(
    module_item: &swc_ecma_ast::ModuleItem,
) -> Option<swc_ecma_ast::ModuleItem> {
    let module_declaration = module_item.as_module_decl()?;
    let export_declaration = module_declaration.as_export_decl()?;
    match &export_declaration.decl {
        swc_ecma_ast::Decl::Class(class) => Some(swc_ecma_ast::ModuleItem::ModuleDecl(
            swc_ecma_ast::ModuleDecl::ExportDecl(swc_ecma_ast::ExportDecl {
                span: export_declaration.span,
                decl: swc_ecma_ast::Decl::TsTypeAlias(Box::new(swc_ecma_ast::TsTypeAliasDecl {
                    span: swc_common::Span::default(),
                    declare: false,
                    id: class.ident.clone(),
                    type_ann: Box::new(swc_ecma_ast::TsType::TsTypeLit(swc_ecma_ast::TsTypeLit {
                        span: swc_common::Span::default(),
                        members: class
                            .class
                            .body
                            .iter()
                            .filter_map(|class_member| {
                                class_member_to_ts_type_element(class_member)
                            })
                            .collect(),
                    })),
                    type_params: None,
                })),
            }),
        )),
        _ => None,
    }
}

fn class_member_to_ts_type_element(
    class_member: &swc_ecma_ast::ClassMember,
) -> Option<swc_ecma_ast::TsTypeElement> {
    match class_member {
        swc_ecma_ast::ClassMember::Constructor(constructor) => {
            Some(swc_ecma_ast::TsTypeElement::TsConstructSignatureDecl(
                swc_ecma_ast::TsConstructSignatureDecl {
                    span: constructor.span,
                    params: constructor
                        .params
                        .iter()
                        .map(|p| match p {
                            swc_ecma_ast::ParamOrTsParamProp::Param(param) => {
                                param_to_ts_fn_param(&param.pat)
                            }
                            swc_ecma_ast::ParamOrTsParamProp::TsParamProp(ts_param_prop) => {
                                match &ts_param_prop.param {
                                    swc_ecma_ast::TsParamPropParam::Assign(assign_pat) => {
                                        param_to_ts_fn_param(&assign_pat.left)
                                    }
                                    swc_ecma_ast::TsParamPropParam::Ident(ident) => {
                                        swc_ecma_ast::TsFnParam::Ident(ident.clone())
                                    }
                                }
                            }
                        })
                        .collect(),
                    type_ann: None,
                    type_params: None,
                },
            ))
        }
        _ => None,
    }
}

fn param_to_ts_fn_param(param: &swc_ecma_ast::Pat) -> swc_ecma_ast::TsFnParam {
    match param {
        swc_ecma_ast::Pat::Ident(ident) => swc_ecma_ast::TsFnParam::Ident(ident.clone()),
        swc_ecma_ast::Pat::Array(array) => swc_ecma_ast::TsFnParam::Array(array.clone()),
        swc_ecma_ast::Pat::Rest(rest) => swc_ecma_ast::TsFnParam::Rest(rest.clone()),
        swc_ecma_ast::Pat::Object(object) => swc_ecma_ast::TsFnParam::Object(object.clone()),
        swc_ecma_ast::Pat::Assign(assign) => param_to_ts_fn_param(&assign.left),
        swc_ecma_ast::Pat::Invalid(invalid) => {
            swc_ecma_ast::TsFnParam::Ident(swc_ecma_ast::BindingIdent {
                id: swc_ecma_ast::Ident::new(string_cache::Atom::from("__invalid__"), invalid.span),
                type_ann: None,
            })
        }
        swc_ecma_ast::Pat::Expr(_) => swc_ecma_ast::TsFnParam::Ident(swc_ecma_ast::BindingIdent {
            id: swc_ecma_ast::Ident::new(
                string_cache::Atom::from("__expr__"),
                swc_common::Span::default(),
            ),
            type_ann: None,
        }),
    }
}
