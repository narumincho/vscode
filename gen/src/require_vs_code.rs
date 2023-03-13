pub fn module_item(
    comments: &swc_common::comments::SingleThreadedComments,
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
                            "import VS Code API
```ts
require(\"vscode\")
```
",
                        ),
                    },
                );

                span
            },
            decl: swc_ecma_ast::Decl::Fn(swc_ecma_ast::FnDecl {
                ident: crate::ident::vs_code_api_ident(),
                declare: false,
                function: Box::new(func()),
            }),
        },
    ))
}

fn func() -> swc_ecma_ast::Function {
    swc_ecma_ast::Function {
        params: vec![],
        decorators: vec![],
        span: swc_common::Span::default(),
        body: Some(func_body()),
        is_async: false,
        is_generator: false,
        type_params: None,
        return_type: Some(Box::new(swc_ecma_ast::TsTypeAnn {
            span: swc_common::Span::default(),
            type_ann: Box::new(swc_ecma_ast::TsType::TsUnionOrIntersectionType(
                swc_ecma_ast::TsUnionOrIntersectionType::TsUnionType(swc_ecma_ast::TsUnionType {
                    span: swc_common::Span::default(),
                    types: vec![
                        Box::new(swc_ecma_ast::TsType::TsTypeRef(swc_ecma_ast::TsTypeRef {
                            span: swc_common::Span::default(),
                            type_name: swc_ecma_ast::TsEntityName::Ident(swc_ecma_ast::Ident {
                                optional: false,
                                span: swc_common::Span::default(),
                                sym: string_cache::Atom::from("VSCodeApi"),
                            }),
                            type_params: None,
                        })),
                        Box::new(swc_ecma_ast::TsType::TsKeywordType(
                            swc_ecma_ast::TsKeywordType {
                                span: swc_common::Span::default(),
                                kind: swc_ecma_ast::TsKeywordTypeKind::TsUndefinedKeyword,
                            },
                        )),
                    ],
                }),
            )),
        })),
    }
}

fn func_body() -> swc_ecma_ast::BlockStmt {
    swc_ecma_ast::BlockStmt {
        span: swc_common::Span::default(),
        stmts: vec![swc_ecma_ast::Stmt::Decl(swc_ecma_ast::Decl::Var(Box::new(
            swc_ecma_ast::VarDecl {
                span: swc_common::Span::default(),
                declare: false,
                kind: swc_ecma_ast::VarDeclKind::Const,
                decls: vec![swc_ecma_ast::VarDeclarator {
                    span: swc_common::Span::default(),
                    definite: true,
                    name: swc_ecma_ast::Pat::Ident(swc_ecma_ast::BindingIdent {
                        id: require_func_ident(),
                        type_ann: None,
                    }),
                    init: Some(Box::new(require_expr())),
                }],
            },
        )))],
    }
}

/// ```ts
/// ((globalThis as unknown) as {
///   require?: undefined | ((path: "vscode") => VSCodeApi);
/// }).require;
/// ```
fn require_expr() -> swc_ecma_ast::Expr {
    swc_ecma_ast::Expr::Member(swc_ecma_ast::MemberExpr {
        span: swc_common::Span::default(),
        obj: Box::new(swc_ecma_ast::Expr::Paren(swc_ecma_ast::ParenExpr {
            span: swc_common::Span::default(),
            expr: Box::new(swc_ecma_ast::Expr::TsAs(swc_ecma_ast::TsAsExpr {
                span: swc_common::Span::default(),
                expr: Box::new(swc_ecma_ast::Expr::Paren(swc_ecma_ast::ParenExpr {
                    span: swc_common::Span::default(),
                    expr: Box::new(swc_ecma_ast::Expr::TsAs(swc_ecma_ast::TsAsExpr {
                        span: swc_common::Span::default(),
                        expr: Box::new(swc_ecma_ast::Expr::Ident(swc_ecma_ast::Ident::new(
                            string_cache::Atom::from("globalThis"),
                            swc_common::Span::default(),
                        ))),
                        type_ann: Box::new(swc_ecma_ast::TsType::TsKeywordType(
                            swc_ecma_ast::TsKeywordType {
                                span: swc_common::Span::default(),
                                kind: swc_ecma_ast::TsKeywordTypeKind::TsUnknownKeyword,
                            },
                        )),
                    })),
                })),
                type_ann: Box::new(swc_ecma_ast::TsType::TsTypeLit(swc_ecma_ast::TsTypeLit {
                    span: swc_common::Span::default(),
                    members: vec![swc_ecma_ast::TsTypeElement::TsPropertySignature(
                        swc_ecma_ast::TsPropertySignature {
                            span: swc_common::Span::default(),
                            readonly: false,
                            key: Box::new(swc_ecma_ast::Expr::Ident(swc_ecma_ast::Ident::new(
                                string_cache::Atom::from("require"),
                                swc_common::Span::default(),
                            ))),
                            computed: false,
                            optional: true,
                            init: None,
                            params: vec![],
                            type_ann: Some(Box::new(swc_ecma_ast::TsTypeAnn {
                                span: swc_common::Span::default(),
                                type_ann: Box::new(require_function_type()),
                            })),
                            type_params: None,
                        },
                    )],
                })),
            })),
        })),
        prop: swc_ecma_ast::MemberProp::Ident(swc_ecma_ast::Ident::new(
            string_cache::Atom::from("require"),
            swc_common::Span::default(),
        )),
    })
}

/// ```ts
/// undefined | ((path: "vscode") => VSCodeApi)
/// ```
fn require_function_type() -> swc_ecma_ast::TsType {
    swc_ecma_ast::TsType::TsUnionOrIntersectionType(
        swc_ecma_ast::TsUnionOrIntersectionType::TsUnionType(swc_ecma_ast::TsUnionType {
            span: swc_common::Span::default(),
            types: vec![
                Box::new(swc_ecma_ast::TsType::TsKeywordType(
                    swc_ecma_ast::TsKeywordType {
                        span: swc_common::Span::default(),
                        kind: swc_ecma_ast::TsKeywordTypeKind::TsUndefinedKeyword,
                    },
                )),
                Box::new(swc_ecma_ast::TsType::TsParenthesizedType(
                    swc_ecma_ast::TsParenthesizedType {
                        span: swc_common::Span::default(),
                        type_ann: Box::new(swc_ecma_ast::TsType::TsFnOrConstructorType(
                            swc_ecma_ast::TsFnOrConstructorType::TsFnType(swc_ecma_ast::TsFnType {
                                span: swc_common::Span::default(),
                                params: vec![swc_ecma_ast::TsFnParam::Ident(
                                    swc_ecma_ast::BindingIdent {
                                        id: swc_ecma_ast::Ident::new(
                                            string_cache::Atom::from("path"),
                                            swc_common::Span::default(),
                                        ),
                                        type_ann: Some(Box::new(swc_ecma_ast::TsTypeAnn {
                                            span: swc_common::Span::default(),
                                            type_ann: Box::new(swc_ecma_ast::TsType::TsLitType(
                                                swc_ecma_ast::TsLitType {
                                                    span: swc_common::Span::default(),
                                                    lit: swc_ecma_ast::TsLit::Str(
                                                        swc_ecma_ast::Str {
                                                            span: swc_common::Span::default(),
                                                            value: string_cache::Atom::from(
                                                                "vscode",
                                                            ),
                                                            raw: None,
                                                        },
                                                    ),
                                                },
                                            )),
                                        })),
                                    },
                                )],
                                type_params: None,
                                type_ann: Box::new(swc_ecma_ast::TsTypeAnn {
                                    span: swc_common::Span::default(),
                                    type_ann: Box::new(swc_ecma_ast::TsType::TsTypeRef(
                                        swc_ecma_ast::TsTypeRef {
                                            span: swc_common::Span::default(),
                                            type_name: swc_ecma_ast::TsEntityName::Ident(
                                                crate::ident::vs_code_api_ident(),
                                            ),
                                            type_params: None,
                                        },
                                    )),
                                }),
                            }),
                        )),
                    },
                )),
            ],
        }),
    )
}

fn require_func_ident() -> swc_ecma_ast::Ident {
    swc_ecma_ast::Ident::new(
        string_cache::Atom::from("requireFunc"),
        swc_common::Span::default(),
    )
}
