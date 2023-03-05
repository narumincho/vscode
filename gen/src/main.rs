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
        .filter_map(|b| {
            if let Some(module_declaration) = b.as_module_decl() {
                if let Some(export_declaration) = module_declaration.as_export_decl() {
                    if let Some(type_alias) = export_declaration.decl.as_ts_type_alias() {
                        match format!("{}", type_alias.id.to_id().0).as_str() {
                            "DocumentFieldValue" => Some(swc_ecma_ast::ModuleItem::ModuleDecl(
                                swc_ecma_ast::ModuleDecl::ExportDecl(swc_ecma_ast::ExportDecl {
                                    span: swc_common::Span::default(),
                                    decl: swc_ecma_ast::Decl::TsTypeAlias(Box::new(
                                        swc_ecma_ast::TsTypeAliasDecl {
                                            span: swc_common::Span::default(),
                                            declare: false,
                                            id: type_alias.id.clone(),
                                            type_ann: Box::new(swc_ecma_ast::TsType::TsKeywordType(swc_ecma_ast::TsKeywordType {
                                                span: swc_common::Span::default(),
                                                kind: swc_ecma_ast::TsKeywordTypeKind::TsBooleanKeyword,
                                            })),
                                            type_params: None,
                                        },
                                    )),
                                }),
                            )),
                            _ => Some(b),
                        }
                    } else {
                        None
                    }
                } else {
                    None
                }
            } else {
                None
            }
        })
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
