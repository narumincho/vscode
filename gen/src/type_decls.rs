const VALUE_OF_IDENT: once_cell::sync::Lazy<swc_ecma_ast::Ident> =
    once_cell::sync::Lazy::new(|| {
        swc_ecma_ast::Ident::new(
            string_cache::Atom::from("ValueOf"),
            swc_common::Span::default(),
        )
    });

pub fn value_of_type() -> swc_ecma_ast::ModuleItem {
    let t_ident =
        swc_ecma_ast::Ident::new(string_cache::Atom::from("T"), swc_common::Span::default());
    let t_type = swc_ecma_ast::TsType::TsTypeRef(swc_ecma_ast::TsTypeRef {
        span: swc_common::Span::default(),
        type_name: swc_ecma_ast::TsEntityName::Ident(t_ident.clone()),
        type_params: None,
    });

    swc_ecma_ast::ModuleItem::Stmt(swc_ecma_ast::Stmt::Decl(swc_ecma_ast::Decl::TsTypeAlias(
        Box::new(swc_ecma_ast::TsTypeAliasDecl {
            span: swc_common::Span::default(),
            declare: false,
            id: (*VALUE_OF_IDENT).clone(),
            type_params: Some(Box::new(swc_ecma_ast::TsTypeParamDecl {
                span: swc_common::Span::default(),
                params: vec![swc_ecma_ast::TsTypeParam {
                    span: swc_common::Span::default(),
                    name: t_ident.clone(),
                    is_in: false,
                    is_out: false,
                    is_const: false,
                    constraint: None,
                    default: None,
                }],
            })),
            type_ann: Box::new(swc_ecma_ast::TsType::TsIndexedAccessType(
                swc_ecma_ast::TsIndexedAccessType {
                    span: swc_common::Span::default(),
                    readonly: false,
                    obj_type: Box::new(t_type.clone()),
                    index_type: Box::new(swc_ecma_ast::TsType::TsTypeOperator(
                        swc_ecma_ast::TsTypeOperator {
                            span: swc_common::Span::default(),
                            op: swc_ecma_ast::TsTypeOperatorOp::KeyOf,
                            type_ann: Box::new(t_type.clone()),
                        },
                    )),
                },
            )),
        }),
    )))
}

pub fn module_item_transform(
    module_item: &crate::pickup::ResultDeclWithComments,
    comments: &dyn swc_common::comments::Comments,
) -> Option<swc_ecma_ast::ModuleItem> {
    match &module_item.decl {
        crate::pickup::ResultDecl::Class(class) => Some(swc_ecma_ast::ModuleItem::ModuleDecl(
            swc_ecma_ast::ModuleDecl::ExportDecl(swc_ecma_ast::ExportDecl {
                span: {
                    let span = swc_common::Span::dummy_with_cmt();
                    match &module_item.comments {
                        Some(comment_vec) => swc_common::comments::Comments::add_leading_comments(
                            &comments,
                            span.lo,
                            comment_vec.clone(),
                        ),
                        None => {}
                    }
                    span
                },
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
                                                    class_member_to_ts_type_element(class_member)
                                                })
                                                .collect(),
                                        },
                                    )));
                                    vec
                                },
                            },
                        ),
                    )),
                    type_params: class.class.type_params.clone(),
                })),
            }),
        )),
        crate::pickup::ResultDecl::TsInterface(interface) => {
            Some(swc_ecma_ast::ModuleItem::ModuleDecl(
                swc_ecma_ast::ModuleDecl::ExportDecl(swc_ecma_ast::ExportDecl {
                    span: {
                        let span = swc_common::Span::dummy_with_cmt();
                        match &module_item.comments {
                            Some(comment_vec) => {
                                swc_common::comments::Comments::add_leading_comments(
                                    &comments,
                                    span.lo,
                                    comment_vec.clone(),
                                )
                            }
                            None => {}
                        }
                        span
                    },
                    decl: swc_ecma_ast::Decl::TsInterface(Box::new(interface.clone())),
                }),
            ))
        }
        crate::pickup::ResultDecl::TsTypeAlias(alias) => {
            Some(swc_ecma_ast::ModuleItem::ModuleDecl(
                swc_ecma_ast::ModuleDecl::ExportDecl(swc_ecma_ast::ExportDecl {
                    span: {
                        let span = swc_common::Span::dummy_with_cmt();
                        match &module_item.comments {
                            Some(comment_vec) => {
                                swc_common::comments::Comments::add_leading_comments(
                                    &comments,
                                    span.lo,
                                    comment_vec.clone(),
                                )
                            }
                            None => {}
                        }
                        span
                    },
                    decl: swc_ecma_ast::Decl::TsTypeAlias(Box::new(alias.clone())),
                }),
            ))
        }
        crate::pickup::ResultDecl::TsEnum(enum_decl) => Some(swc_ecma_ast::ModuleItem::ModuleDecl(
            swc_ecma_ast::ModuleDecl::ExportDecl(swc_ecma_ast::ExportDecl {
                span: {
                    let span = swc_common::Span::dummy_with_cmt();
                    match &module_item.comments {
                        Some(comment_vec) => swc_common::comments::Comments::add_leading_comments(
                            &comments,
                            span.lo,
                            comment_vec.clone(),
                        ),
                        None => {}
                    }
                    span
                },
                decl: swc_ecma_ast::Decl::TsTypeAlias(Box::new(swc_ecma_ast::TsTypeAliasDecl {
                    span: swc_common::Span::default(),
                    declare: false,
                    id: enum_decl.id.clone(),
                    type_params: None,
                    type_ann: Box::new(swc_ecma_ast::TsType::TsTypeRef(swc_ecma_ast::TsTypeRef {
                        span: swc_common::Span::default(),
                        type_name: swc_ecma_ast::TsEntityName::Ident((*VALUE_OF_IDENT).clone()),
                        type_params: Some(Box::new(swc_ecma_ast::TsTypeParamInstantiation {
                            span: swc_common::Span::default(),
                            params: vec![Box::new(swc_ecma_ast::TsType::TsIndexedAccessType(
                                swc_ecma_ast::TsIndexedAccessType {
                                    span: swc_common::Span::default(),
                                    readonly: false,
                                    obj_type: Box::new(swc_ecma_ast::TsType::TsTypeRef(
                                        swc_ecma_ast::TsTypeRef {
                                            span: swc_common::Span::default(),
                                            type_name: swc_ecma_ast::TsEntityName::Ident(
                                                (*crate::ident::VS_CODE_API_IDENT).clone(),
                                            ),
                                            type_params: None,
                                        },
                                    )),
                                    index_type: Box::new(swc_ecma_ast::TsType::TsLitType(
                                        swc_ecma_ast::TsLitType {
                                            span: swc_common::Span::default(),
                                            lit: swc_ecma_ast::TsLit::Str(swc_ecma_ast::Str {
                                                span: swc_common::Span::default(),
                                                value: enum_decl.id.sym.clone(),
                                                raw: None,
                                            }),
                                        },
                                    )),
                                },
                            ))],
                        })),
                    })),
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
        swc_ecma_ast::ClassMember::ClassProp(class_prop) => {
            if class_prop.is_static {
                None
            } else {
                Some(swc_ecma_ast::TsTypeElement::TsPropertySignature(
                    swc_ecma_ast::TsPropertySignature {
                        span: class_prop.span,
                        readonly: class_prop.readonly,
                        key: Box::new(crate::fn_to_type::prop_name_to_expr(&class_prop.key)),
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
        swc_ecma_ast::ClassMember::Method(method) => {
            if method.is_static {
                None
            } else {
                Some(swc_ecma_ast::TsTypeElement::TsMethodSignature(
                    swc_ecma_ast::TsMethodSignature {
                        span: method.span,
                        readonly: false,
                        key: Box::new(crate::fn_to_type::prop_name_to_expr(&method.key)),
                        computed: method.key.is_computed(),
                        optional: false,
                        params: method
                            .function
                            .params
                            .iter()
                            .map(|param| crate::fn_to_type::pat_to_ts_fn_param(&param.pat))
                            .collect(),
                        type_ann: method.function.return_type.clone(),
                        type_params: method.function.type_params.clone(),
                    },
                ))
            }
        }
        _ => None,
    }
}
