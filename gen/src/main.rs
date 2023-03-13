mod ident;
mod pickup;
mod require_vs_code;
mod vs_code_api_type;

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
            dts: true,
            ..Default::default()
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

    let result = pickup::pick_module_item(&module.body);

    let mut module_map = Vec::<swc_ecma_ast::ModuleItem>::new();

    let result = swc_common::GLOBALS.set(&swc_common::Globals::default(), || {
        module_map.push(require_vs_code::module_item(&comments));

        module_map.push(vs_code_api_type::module_item(&comments, &result));

        for module_item in result {
            if let Some(new_module_item) = module_item_transform(&module_item) {
                module_map.push(new_module_item);
            }
        }

        swc_ecma_ast::TsModuleBlock {
            span: swc_common::Span::default(),
            body: module_map,
        }
    });

    let code = node_to_code_string(&result, &comments)?;

    let _ = std::fs::write("./out.ts", code)?;

    Ok(())
}

fn node_to_code_string<Node: swc_ecma_codegen::Node>(
    node: &Node,
    comments: &dyn swc_common::comments::Comments,
) -> anyhow::Result<String> {
    let cm = swc_common::sync::Lrc::<swc_common::SourceMap>::default();
    let mut buf = vec![];
    let writer = swc_ecma_codegen::text_writer::JsWriter::new(cm.clone(), "\n", &mut buf, None);

    let mut emitter = swc_ecma_codegen::Emitter {
        cfg: Default::default(),
        comments: Some(&comments),
        cm: cm.clone(),
        wr: writer,
    };

    swc_ecma_codegen::Node::emit_with(&node, &mut emitter)?;

    let code = String::from_utf8(buf)?;
    Ok(code)
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
    module_item: &pickup::ResultDeclWithSpan,
) -> Option<swc_ecma_ast::ModuleItem> {
    match &module_item.decl {
        pickup::ResultDecl::Class(class) => Some(swc_ecma_ast::ModuleItem::ModuleDecl(
            swc_ecma_ast::ModuleDecl::ExportDecl(swc_ecma_ast::ExportDecl {
                span: module_item.span,
                decl: swc_ecma_ast::Decl::TsTypeAlias(Box::new(swc_ecma_ast::TsTypeAliasDecl {
                    span: swc_common::Span::default(),
                    declare: false,
                    id: class.ident.clone(),
                    type_ann: Box::new(swc_ecma_ast::TsType::TsUnionOrIntersectionType(
                        swc_ecma_ast::TsUnionOrIntersectionType::TsIntersectionType(
                            swc_ecma_ast::TsIntersectionType {
                                span: swc_common::Span::default(),
                                types: {
                                    let mut vec = Vec::<Box<swc_ecma_ast::TsType>>::new();
                                    if let Some(super_class_expr) = &class.class.super_class {
                                        if let Some(super_class_ident) = super_class_expr.as_ident()
                                        {
                                            vec.push(Box::new(swc_ecma_ast::TsType::TsTypeRef(
                                                swc_ecma_ast::TsTypeRef {
                                                    span: swc_common::Span::default(),
                                                    type_name: swc_ecma_ast::TsEntityName::Ident(
                                                        super_class_ident.clone(),
                                                    ),
                                                    type_params: None,
                                                },
                                            )));
                                        }
                                    }
                                    vec.push(Box::new(swc_ecma_ast::TsType::TsTypeLit(
                                        swc_ecma_ast::TsTypeLit {
                                            span: swc_common::Span::default(),
                                            members: class
                                                .class
                                                .body
                                                .iter()
                                                .filter_map(|class_member| {
                                                    class_member_to_ts_type_element(
                                                        class_member,
                                                        &class.ident,
                                                    )
                                                })
                                                .collect(),
                                        },
                                    )));
                                    vec
                                },
                            },
                        ),
                    )),
                    type_params: None,
                })),
            }),
        )),
        pickup::ResultDecl::TsInterface(interface) => Some(swc_ecma_ast::ModuleItem::ModuleDecl(
            swc_ecma_ast::ModuleDecl::ExportDecl(swc_ecma_ast::ExportDecl {
                span: module_item.span,
                decl: swc_ecma_ast::Decl::TsInterface(Box::new(interface.clone())),
            }),
        )),
        pickup::ResultDecl::TsTypeAlias(alias) => Some(swc_ecma_ast::ModuleItem::ModuleDecl(
            swc_ecma_ast::ModuleDecl::ExportDecl(swc_ecma_ast::ExportDecl {
                span: module_item.span,
                decl: swc_ecma_ast::Decl::TsTypeAlias(Box::new(alias.clone())),
            }),
        )),
        pickup::ResultDecl::TsEnum(enum_decl) => Some(swc_ecma_ast::ModuleItem::ModuleDecl(
            swc_ecma_ast::ModuleDecl::ExportDecl(swc_ecma_ast::ExportDecl {
                span: module_item.span,
                decl: swc_ecma_ast::Decl::TsEnum(Box::new(enum_decl.clone())),
            }),
        )),
        _ => None,
    }
}

fn class_member_to_ts_type_element(
    class_member: &swc_ecma_ast::ClassMember,
    class_name: &swc_ecma_ast::Ident,
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
                    type_ann: Some(Box::new(swc_ecma_ast::TsTypeAnn {
                        span: swc_common::Span::default(),
                        type_ann: Box::new(swc_ecma_ast::TsType::TsTypeRef(
                            swc_ecma_ast::TsTypeRef {
                                span: swc_common::Span::default(),
                                type_name: swc_ecma_ast::TsEntityName::Ident(class_name.clone()),
                                type_params: None,
                            },
                        )),
                    })),
                    type_params: None,
                },
            ))
        }
        swc_ecma_ast::ClassMember::ClassProp(class_prop) => {
            if class_prop.is_static {
                None
            } else {
                Some(swc_ecma_ast::TsTypeElement::TsPropertySignature(
                    swc_ecma_ast::TsPropertySignature {
                        span: class_prop.span,
                        readonly: class_prop.readonly,
                        key: Box::new(match &class_prop.key {
                            swc_ecma_ast::PropName::BigInt(big_int) => {
                                swc_ecma_ast::Expr::Lit(swc_ecma_ast::Lit::BigInt(big_int.clone()))
                            }
                            swc_ecma_ast::PropName::Ident(ident) => {
                                swc_ecma_ast::Expr::Ident(ident.clone())
                            }
                            swc_ecma_ast::PropName::Str(str) => {
                                swc_ecma_ast::Expr::Lit(swc_ecma_ast::Lit::Str(str.clone()))
                            }
                            swc_ecma_ast::PropName::Num(num) => {
                                swc_ecma_ast::Expr::Lit(swc_ecma_ast::Lit::Num(num.clone()))
                            }
                            swc_ecma_ast::PropName::Computed(computed) => *computed.expr.clone(),
                        }),
                        computed: false,
                        optional: false,
                        init: None,
                        params: vec![],
                        type_ann: class_prop.type_ann.clone(),
                        type_params: None,
                    },
                ))
            }
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
