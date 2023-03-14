mod fn_to_type;
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

    let result = pickup::pick_module_item(&module.body, &comments);

    let mut module_map = Vec::<swc_ecma_ast::ModuleItem>::new();

    let result = swc_common::GLOBALS.set(&swc_common::Globals::default(), || {
        module_map.push(require_vs_code::module_item(&comments));

        module_map.push(vs_code_api_type::module_item(&comments, &result));

        module_map.push(value_of_type());

        for module_item in result {
            if let Some(new_module_item) = module_item_transform(&module_item, &comments) {
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

fn value_of_ident() -> swc_ecma_ast::Ident {
    swc_ecma_ast::Ident::new(
        string_cache::Atom::from("ValueOf"),
        swc_common::Span::default(),
    )
}

fn value_of_type() -> swc_ecma_ast::ModuleItem {
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
            id: value_of_ident(),
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

fn module_item_transform(
    module_item: &pickup::ResultDeclWithComments,
    comments: &dyn swc_common::comments::Comments,
) -> Option<swc_ecma_ast::ModuleItem> {
    match &module_item.decl {
        pickup::ResultDecl::Class(class) => Some(swc_ecma_ast::ModuleItem::ModuleDecl(
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
                    type_params: None,
                })),
            }),
        )),
        pickup::ResultDecl::TsInterface(interface) => Some(swc_ecma_ast::ModuleItem::ModuleDecl(
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
                decl: swc_ecma_ast::Decl::TsInterface(Box::new(interface.clone())),
            }),
        )),
        pickup::ResultDecl::TsTypeAlias(alias) => Some(swc_ecma_ast::ModuleItem::ModuleDecl(
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
                decl: swc_ecma_ast::Decl::TsTypeAlias(Box::new(alias.clone())),
            }),
        )),
        pickup::ResultDecl::TsEnum(enum_decl) => Some(swc_ecma_ast::ModuleItem::ModuleDecl(
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
                        type_name: swc_ecma_ast::TsEntityName::Ident(value_of_ident()),
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
                                                ident::vs_code_api_ident(),
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
                        key: Box::new(fn_to_type::prop_name_to_expr(&class_prop.key)),
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
