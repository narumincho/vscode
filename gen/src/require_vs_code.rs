pub fn module_items(
    comments: &swc_common::comments::SingleThreadedComments,
) -> Vec<swc_ecma_ast::ModuleItem> {
    vec![
        swc_ecma_ast::ModuleItem::Stmt(declare_const_require()),
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
                                "* import VS Code API
```ts
require(\"vscode\")
```

Returns VSCodeApi only within the vscode extension.
",
                            ),
                        },
                    );

                    span
                },
                decl: swc_ecma_ast::Decl::Fn(swc_ecma_ast::FnDecl {
                    ident: swc_ecma_ast::Ident::new(
                        string_cache::Atom::from("importVsCodeApi"),
                        swc_common::Span::default(),
                    ),
                    declare: false,
                    function: Box::new(func()),
                }),
            },
        )),
    ]
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
                            type_name: swc_ecma_ast::TsEntityName::Ident(
                                (*crate::ident::VS_CODE_API_IDENT).clone(),
                            ),
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
        stmts: vec![
            swc_ecma_ast::Stmt::Decl(swc_ecma_ast::Decl::Var(Box::new(swc_ecma_ast::VarDecl {
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
                    init: Some(Box::new(swc_ecma_ast::Expr::Cond(swc_ecma_ast::CondExpr {
                        span: swc_common::Span::default(),
                        test: Box::new(swc_ecma_ast::Expr::Bin(swc_ecma_ast::BinExpr {
                            span: swc_common::Span::default(),
                            op: swc_ecma_ast::BinaryOp::EqEqEq,
                            left: Box::new(swc_ecma_ast::Expr::Unary(swc_ecma_ast::UnaryExpr {
                                span: swc_common::Span::default(),
                                op: swc_ecma_ast::UnaryOp::TypeOf,
                                arg: Box::new(swc_ecma_ast::Expr::Ident(swc_ecma_ast::Ident::new(
                                    string_cache::Atom::from("require"),
                                    swc_common::Span::default(),
                                ))),
                            })),
                            right: Box::new(swc_ecma_ast::Expr::Lit(swc_ecma_ast::Lit::Str(
                                swc_ecma_ast::Str {
                                    span: swc_common::Span::default(),
                                    value: string_cache::Atom::from("function"),
                                    raw: None,
                                },
                            ))),
                        })),
                        cons: Box::new(swc_ecma_ast::Expr::Ident(swc_ecma_ast::Ident::new(
                            string_cache::Atom::from("require"),
                            swc_common::Span::default(),
                        ))),
                        alt: Box::new(undefined_expr()),
                    }))),
                }],
            }))),
            swc_ecma_ast::Stmt::Return(swc_ecma_ast::ReturnStmt {
                span: swc_common::Span::default(),
                arg: Some(Box::new(swc_ecma_ast::Expr::Cond(swc_ecma_ast::CondExpr {
                    span: swc_common::Span::default(),
                    test: Box::new(swc_ecma_ast::Expr::Bin(swc_ecma_ast::BinExpr {
                        span: swc_common::Span::default(),
                        op: swc_ecma_ast::BinaryOp::EqEqEq,
                        left: Box::new(swc_ecma_ast::Expr::Ident(require_func_ident())),
                        right: Box::new(undefined_expr()),
                    })),
                    cons: Box::new(undefined_expr()),
                    alt: Box::new(swc_ecma_ast::Expr::Call(swc_ecma_ast::CallExpr {
                        span: swc_common::Span::default(),
                        callee: swc_ecma_ast::Callee::Expr(Box::new(swc_ecma_ast::Expr::Ident(
                            require_func_ident(),
                        ))),
                        args: vec![swc_ecma_ast::ExprOrSpread {
                            spread: None,
                            expr: Box::new(swc_ecma_ast::Expr::Lit(swc_ecma_ast::Lit::Str(
                                swc_ecma_ast::Str {
                                    span: swc_common::Span::default(),
                                    value: string_cache::Atom::from("vscode"),
                                    raw: None,
                                },
                            ))),
                        }],
                        type_args: None,
                    })),
                }))),
            }),
        ],
    }
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
                                                (*crate::ident::VS_CODE_API_IDENT).clone(),
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

fn undefined_expr() -> swc_ecma_ast::Expr {
    swc_ecma_ast::Expr::Ident(swc_ecma_ast::Ident::new(
        string_cache::Atom::from("undefined"),
        swc_common::Span::default(),
    ))
}

fn declare_const_require() -> swc_ecma_ast::Stmt {
    swc_ecma_ast::Stmt::Decl(swc_ecma_ast::Decl::Var(Box::new(swc_ecma_ast::VarDecl {
        span: swc_common::Span::default(),
        declare: true,
        kind: swc_ecma_ast::VarDeclKind::Const,
        decls: vec![swc_ecma_ast::VarDeclarator {
            span: swc_common::Span::default(),
            definite: true,
            name: swc_ecma_ast::Pat::Ident(swc_ecma_ast::BindingIdent {
                id: swc_ecma_ast::Ident::new(
                    string_cache::Atom::from("require"),
                    swc_common::Span::default(),
                ),
                type_ann: Some(Box::new(swc_ecma_ast::TsTypeAnn {
                    span: swc_common::Span::default(),
                    type_ann: Box::new(require_function_type()),
                })),
            }),
            init: None,
        }],
    })))
}
