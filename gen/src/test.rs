#[test]
fn output_construct_signature_with_type_params() {
    let type_decl = swc_ecma_ast::TsTypeLit {
        span: swc_common::Span::default(),
        members: vec![swc_ecma_ast::TsTypeElement::TsMethodSignature(
            swc_ecma_ast::TsMethodSignature {
                span: swc_common::Span::default(),
                params: vec![swc_ecma_ast::TsFnParam::Ident(swc_ecma_ast::BindingIdent {
                    id: swc_ecma_ast::Ident::new(
                        string_cache::Atom::from("value"),
                        swc_common::Span::default(),
                    ),
                    type_ann: Some(Box::new(swc_ecma_ast::TsTypeAnn {
                        span: swc_common::Span::default(),
                        type_ann: Box::new(swc_ecma_ast::TsType::TsKeywordType(
                            swc_ecma_ast::TsKeywordType {
                                span: swc_common::Span::default(),
                                kind: swc_ecma_ast::TsKeywordTypeKind::TsStringKeyword,
                            },
                        )),
                    })),
                })],
                type_ann: Some(Box::new(swc_ecma_ast::TsTypeAnn {
                    span: swc_common::Span::default(),
                    type_ann: Box::new(swc_ecma_ast::TsType::TsKeywordType(
                        swc_ecma_ast::TsKeywordType {
                            span: swc_common::Span::default(),
                            kind: swc_ecma_ast::TsKeywordTypeKind::TsStringKeyword,
                        },
                    )),
                })),
                type_params: None,
                readonly: false,
                key: Box::new(swc_ecma_ast::Expr::Ident(swc_ecma_ast::Ident::new(
                    string_cache::Atom::from("method"),
                    swc_common::Span::default(),
                ))),
                computed: false,
                optional: false,
            },
        )],
    };

    let cm = swc_common::sync::Lrc::<swc_common::SourceMap>::default();
    let mut buf = vec![];
    let writer = swc_ecma_codegen::text_writer::JsWriter::new(cm.clone(), "\n", &mut buf, None);

    let mut emitter = swc_ecma_codegen::Emitter {
        cfg: Default::default(),
        comments: None,
        cm: cm.clone(),
        wr: writer,
    };

    swc_ecma_codegen::Node::emit_with(&type_decl, &mut emitter).unwrap();

    let code = String::from_utf8(buf).unwrap();
    println!("{}", code);
}
