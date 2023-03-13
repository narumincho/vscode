pub fn module_item(
    comments: &swc_common::comments::SingleThreadedComments,
    result_vec: &Vec<crate::pickup::ResultDeclWithSpan>,
) -> swc_ecma_ast::ModuleItem {
    swc_ecma_ast::ModuleItem::ModuleDecl(swc_ecma_ast::ModuleDecl::ExportDecl(
        swc_ecma_ast::ExportDecl {
            span: {
                let span = swc_common::Span::dummy_with_cmt();
                swc_common::comments::Comments::add_leading(
                    comments,
                    span.lo,
                    swc_common::comments::Comment {
                        span: swc_common::DUMMY_SP,
                        kind: swc_common::comments::CommentKind::Block,
                        text: swc_atoms::Atom::from(
                            "*
 * Type Definition for Visual Studio Code 1.75 Extension API
 * See https://code.visualstudio.com/api for more information
 ",
                        ),
                    },
                );

                span
            },
            decl: swc_ecma_ast::Decl::TsTypeAlias(Box::new(swc_ecma_ast::TsTypeAliasDecl {
                id: crate::ident::vs_code_api_ident(),
                declare: false,
                span: swc_common::Span::default(),
                type_ann: Box::new(swc_ecma_ast::TsType::TsTypeLit(swc_ecma_ast::TsTypeLit {
                    span: swc_common::Span::default(),
                    members: result_vec
                        .iter()
                        .filter_map(
                            |result| match result_decl_to_ts_property_signature(result) {
                                Some(sig) => {
                                    Some(swc_ecma_ast::TsTypeElement::TsPropertySignature(sig))
                                }
                                None => None,
                            },
                        )
                        .collect(),
                })),
                type_params: None,
            })),
        },
    ))
}

fn result_decl_to_ts_property_signature(
    result: &crate::pickup::ResultDeclWithSpan,
) -> Option<swc_ecma_ast::TsPropertySignature> {
    match &result.decl {
        crate::pickup::ResultDecl::Class(class) => Some(swc_ecma_ast::TsPropertySignature {
            span: result.span,
            readonly: true,
            key: Box::new(swc_ecma_ast::Expr::Ident(class.ident.clone())),
            computed: false,
            optional: false,
            init: None,
            params: vec![],
            type_ann: Some(Box::new(swc_ecma_ast::TsTypeAnn {
                span: swc_common::Span::default(),
                type_ann: Box::new(swc_ecma_ast::TsType::TsLitType(swc_ecma_ast::TsLitType {
                    span: swc_common::Span::default(),
                    lit: swc_ecma_ast::TsLit::Str(swc_ecma_ast::Str {
                        span: swc_common::Span::default(),
                        value: string_cache::Atom::from("__wip*__"),
                        raw: None,
                    }),
                })),
            })),
            type_params: None,
        }),
        crate::pickup::ResultDecl::Fn(_) => None,
        crate::pickup::ResultDecl::Var(_) => None,
        crate::pickup::ResultDecl::TsInterface(_) => None,
        crate::pickup::ResultDecl::TsTypeAlias(_) => None,
        crate::pickup::ResultDecl::TsEnum(_) => None,
    }
}
