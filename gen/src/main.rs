mod fn_to_type;
mod ident;
mod pickup;
mod require_vs_code;
mod type_decls;
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

    let result = pickup::pick_module_item(&module.body, &comments);

    let mut module_map = Vec::<swc_ecma_ast::ModuleItem>::new();

    let result = swc_common::GLOBALS.set(&swc_common::Globals::default(), || {
        module_map.push(require_vs_code::module_item(&comments));

        module_map.push(vs_code_api_type::module_item(&comments, &result));

        module_map.push(type_decls::value_of_type());

        for module_item in result {
            if let Some(new_module_item) =
                type_decls::module_item_transform(&module_item, &comments)
            {
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
}
