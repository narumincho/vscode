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
                type_ann: Box::new(swc_ecma_ast::TsType::TsTypeLit(swc_ecma_ast::TsTypeLit {
                    span: swc_common::Span::default(),
                    members: class
                        .class
                        .body
                        .iter()
                        .filter_map(|item| class_member_to_ts_type_element(item, &class.ident))
                        .collect(),
                })),
            })),
            type_params: None,
        }),
        crate::pickup::ResultDecl::Fn(_) => None,
        crate::pickup::ResultDecl::Var(_) => None,
        crate::pickup::ResultDecl::TsInterface(_) => None,
        crate::pickup::ResultDecl::TsTypeAlias(_) => None,
        crate::pickup::ResultDecl::TsEnum(ts_enum) => Some(swc_ecma_ast::TsPropertySignature {
            span: result.span,
            readonly: true,
            key: Box::new(swc_ecma_ast::Expr::Ident(ts_enum.id.clone())),
            computed: false,
            optional: false,
            init: None,
            params: vec![],
            type_ann: Some(Box::new(swc_ecma_ast::TsTypeAnn {
                span: swc_common::Span::default(),
                type_ann: Box::new(swc_ecma_ast::TsType::TsTypeLit(swc_ecma_ast::TsTypeLit {
                    span: swc_common::Span::default(),
                    members: ts_enum
                        .members
                        .iter()
                        .map(|member| enum_member_to_ts_type_element(member))
                        .collect(),
                })),
            })),
            type_params: None,
        }),
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
                    span: constructor.span.clone(),
                    params: constructor
                        .params
                        .iter()
                        .map(|param| {
                            crate::fn_to_type::param_or_ts_param_prop_to_ts_fn_param(param)
                        })
                        .collect(),
                    type_params: None,
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
                },
            ))
        }
        swc_ecma_ast::ClassMember::Method(method) => {
            if method.is_static {
                Some(swc_ecma_ast::TsTypeElement::TsMethodSignature(
                    swc_ecma_ast::TsMethodSignature {
                        span: method.span,
                        readonly: true,
                        key: Box::new(crate::fn_to_type::prop_name_to_expr(&method.key)),
                        computed: false,
                        optional: method.is_optional,
                        params: method
                            .function
                            .params
                            .iter()
                            .map(|p| crate::fn_to_type::param_to_ts_fn_param(&p.pat))
                            .collect(),
                        type_ann: None,
                        type_params: None,
                    },
                ))
            } else {
                None
            }
        }
        swc_ecma_ast::ClassMember::PrivateMethod(_) => None,
        swc_ecma_ast::ClassMember::ClassProp(prop) => {
            if prop.is_static {
                Some(swc_ecma_ast::TsTypeElement::TsPropertySignature(
                    swc_ecma_ast::TsPropertySignature {
                        span: prop.span,
                        readonly: true,
                        key: Box::new(crate::fn_to_type::prop_name_to_expr(&prop.key)),
                        computed: false,
                        optional: prop.is_optional,
                        params: vec![],
                        type_ann: None,
                        type_params: None,
                        init: None,
                    },
                ))
            } else {
                None
            }
        }
        swc_ecma_ast::ClassMember::PrivateProp(_) => None,
        swc_ecma_ast::ClassMember::TsIndexSignature(_) => None,
        swc_ecma_ast::ClassMember::Empty(_) => None,
        swc_ecma_ast::ClassMember::StaticBlock(_) => None,
        swc_ecma_ast::ClassMember::AutoAccessor(_) => None,
    }
}

fn enum_member_to_ts_type_element(
    enum_member: &swc_ecma_ast::TsEnumMember,
) -> swc_ecma_ast::TsTypeElement {
    swc_ecma_ast::TsTypeElement::TsPropertySignature(swc_ecma_ast::TsPropertySignature {
        span: enum_member.span,
        readonly: true,
        key: Box::new(match &enum_member.id {
            swc_ecma_ast::TsEnumMemberId::Ident(ident) => swc_ecma_ast::Expr::Ident(ident.clone()),
            swc_ecma_ast::TsEnumMemberId::Str(str) => {
                swc_ecma_ast::Expr::Lit(swc_ecma_ast::Lit::Str(str.clone()))
            }
        }),
        computed: false,
        optional: false,
        params: vec![],
        type_ann: Some(Box::new(match &enum_member.init {
            Some(expr) => match &**expr {
                swc_ecma_ast::Expr::Lit(lit) => swc_ecma_ast::TsTypeAnn {
                    span: swc_common::Span::default(),
                    type_ann: Box::new(swc_ecma_ast::TsType::TsLitType(swc_ecma_ast::TsLitType {
                        span: swc_common::Span::default(),
                        lit: match lit {
                            swc_ecma_ast::Lit::Str(_) => todo!(),
                            swc_ecma_ast::Lit::Bool(_) => todo!(),
                            swc_ecma_ast::Lit::Null(_) => todo!(),
                            swc_ecma_ast::Lit::Num(num) => swc_ecma_ast::TsLit::Number(num.clone()),
                            swc_ecma_ast::Lit::BigInt(_) => todo!(),
                            swc_ecma_ast::Lit::Regex(_) => todo!(),
                            swc_ecma_ast::Lit::JSXText(_) => todo!(),
                        },
                    })),
                },
                swc_ecma_ast::Expr::Unary(unary_expr) => match unary_expr.op {
                    swc_ecma_ast::UnaryOp::Minus => swc_ecma_ast::TsTypeAnn {
                        span: swc_common::Span::default(),
                        type_ann: Box::new(swc_ecma_ast::TsType::TsLitType(
                            swc_ecma_ast::TsLitType {
                                span: swc_common::Span::default(),
                                lit: swc_ecma_ast::TsLit::Number(swc_ecma_ast::Number {
                                    span: swc_common::Span::default(),
                                    value: match &*unary_expr.arg {
                                        swc_ecma_ast::Expr::Lit(swc_ecma_ast::Lit::Num(num)) => {
                                            num.value
                                        }
                                        _ => todo!(),
                                    },
                                    raw: None,
                                }),
                            },
                        )),
                    },
                    swc_ecma_ast::UnaryOp::Plus => todo!(),
                    swc_ecma_ast::UnaryOp::Bang => todo!(),
                    swc_ecma_ast::UnaryOp::Tilde => todo!(),
                    swc_ecma_ast::UnaryOp::TypeOf => todo!(),
                    swc_ecma_ast::UnaryOp::Void => todo!(),
                    swc_ecma_ast::UnaryOp::Delete => todo!(),
                },
                _ => todo!(),
            },
            None => todo!(),
        })),
        type_params: None,
        init: None,
    })
}
