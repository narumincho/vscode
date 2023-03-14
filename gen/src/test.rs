#[test]
fn output_property_signature_with_type_params() {
    let type_parameter_t_ident =
        swc_ecma_ast::Ident::new(string_cache::Atom::from("T"), swc_common::Span::default());
    let type_decl = swc_ecma_ast::TsTypeLit {
        span: swc_common::Span::default(),
        members: vec![swc_ecma_ast::TsTypeElement::TsPropertySignature(
            swc_ecma_ast::TsPropertySignature {
                span: swc_common::Span::default(),
                params: vec![swc_ecma_ast::TsFnParam::Ident(swc_ecma_ast::BindingIdent {
                    id: swc_ecma_ast::Ident::new(
                        string_cache::Atom::from("value"),
                        swc_common::Span::default(),
                    ),
                    type_ann: Some(Box::new(swc_ecma_ast::TsTypeAnn {
                        span: swc_common::Span::default(),
                        type_ann: Box::new(swc_ecma_ast::TsType::TsTypeRef(
                            swc_ecma_ast::TsTypeRef {
                                span: swc_common::Span::default(),
                                type_name: swc_ecma_ast::TsEntityName::Ident(
                                    type_parameter_t_ident.clone(),
                                ),
                                type_params: None,
                            },
                        )),
                    })),
                })],
                type_ann: Some(Box::new(swc_ecma_ast::TsTypeAnn {
                    span: swc_common::Span::default(),
                    type_ann: Box::new(swc_ecma_ast::TsType::TsTypeRef(swc_ecma_ast::TsTypeRef {
                        span: swc_common::Span::default(),
                        type_name: swc_ecma_ast::TsEntityName::Ident(swc_ecma_ast::Ident::new(
                            string_cache::Atom::from("Obj"),
                            swc_common::Span::default(),
                        )),
                        type_params: Some(Box::new(swc_ecma_ast::TsTypeParamInstantiation {
                            span: swc_common::Span::default(),
                            params: vec![Box::new(swc_ecma_ast::TsType::TsTypeRef(
                                swc_ecma_ast::TsTypeRef {
                                    span: swc_common::Span::default(),
                                    type_name: swc_ecma_ast::TsEntityName::Ident(
                                        type_parameter_t_ident.clone(),
                                    ),
                                    type_params: None,
                                },
                            ))],
                        })),
                    })),
                })),
                type_params: Some(Box::new(swc_ecma_ast::TsTypeParamDecl {
                    span: swc_common::Span::default(),
                    params: vec![swc_ecma_ast::TsTypeParam {
                        span: swc_common::Span::default(),
                        name: type_parameter_t_ident.clone(),
                        is_in: false,
                        is_out: false,
                        is_const: false,
                        constraint: None,
                        default: None,
                    }],
                })),
                readonly: false,
                key: Box::new(swc_ecma_ast::Expr::Ident(swc_ecma_ast::Ident {
                    span: swc_common::Span::default(),
                    sym: string_cache::Atom::from("value"),
                    optional: false,
                })),
                computed: false,
                optional: false,
                init: None,
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

#[test]
fn output_construct_signature_with_type_params() {
    let type_parameter_t_ident =
        swc_ecma_ast::Ident::new(string_cache::Atom::from("T"), swc_common::Span::default());
    let type_decl = swc_ecma_ast::TsTypeLit {
        span: swc_common::Span::default(),
        members: vec![swc_ecma_ast::TsTypeElement::TsConstructSignatureDecl(
            swc_ecma_ast::TsConstructSignatureDecl {
                span: swc_common::Span::default(),
                params: vec![swc_ecma_ast::TsFnParam::Ident(swc_ecma_ast::BindingIdent {
                    id: swc_ecma_ast::Ident::new(
                        string_cache::Atom::from("value"),
                        swc_common::Span::default(),
                    ),
                    type_ann: Some(Box::new(swc_ecma_ast::TsTypeAnn {
                        span: swc_common::Span::default(),
                        type_ann: Box::new(swc_ecma_ast::TsType::TsTypeRef(
                            swc_ecma_ast::TsTypeRef {
                                span: swc_common::Span::default(),
                                type_name: swc_ecma_ast::TsEntityName::Ident(
                                    type_parameter_t_ident.clone(),
                                ),
                                type_params: None,
                            },
                        )),
                    })),
                })],
                type_ann: Some(Box::new(swc_ecma_ast::TsTypeAnn {
                    span: swc_common::Span::default(),
                    type_ann: Box::new(swc_ecma_ast::TsType::TsTypeRef(swc_ecma_ast::TsTypeRef {
                        span: swc_common::Span::default(),
                        type_name: swc_ecma_ast::TsEntityName::Ident(swc_ecma_ast::Ident::new(
                            string_cache::Atom::from("Obj"),
                            swc_common::Span::default(),
                        )),
                        type_params: Some(Box::new(swc_ecma_ast::TsTypeParamInstantiation {
                            span: swc_common::Span::default(),
                            params: vec![Box::new(swc_ecma_ast::TsType::TsTypeRef(
                                swc_ecma_ast::TsTypeRef {
                                    span: swc_common::Span::default(),
                                    type_name: swc_ecma_ast::TsEntityName::Ident(
                                        type_parameter_t_ident.clone(),
                                    ),
                                    type_params: None,
                                },
                            ))],
                        })),
                    })),
                })),
                // ignored ?
                type_params: Some(Box::new(swc_ecma_ast::TsTypeParamDecl {
                    span: swc_common::Span::default(),
                    params: vec![swc_ecma_ast::TsTypeParam {
                        span: swc_common::Span::default(),
                        name: type_parameter_t_ident.clone(),
                        is_in: false,
                        is_out: false,
                        is_const: false,
                        constraint: None,
                        default: None,
                    }],
                })),
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
