pub fn pick_module_item(
    module_items: &Vec<swc_ecma_ast::ModuleItem>,
    comments: &dyn swc_common::comments::Comments,
) -> Vec<ResultDeclWithComments> {
    module_items
        .iter()
        .flat_map(|item| match item {
            swc_ecma_ast::ModuleItem::ModuleDecl(module_decl) => match module_decl {
                swc_ecma_ast::ModuleDecl::Import(_) => vec![],
                swc_ecma_ast::ModuleDecl::ExportDecl(export_decl) => match &export_decl.decl {
                    swc_ecma_ast::Decl::Class(decl) => vec![ResultDeclWithComments {
                        comments: get_comment_in_span(comments, &export_decl.span),
                        decl: ResultDecl::Class(decl.clone()),
                    }],
                    swc_ecma_ast::Decl::Fn(decl) => vec![ResultDeclWithComments {
                        comments: get_comment_in_span(comments, &export_decl.span),
                        decl: ResultDecl::Fn(decl.clone()),
                    }],
                    swc_ecma_ast::Decl::Var(decl) => vec![ResultDeclWithComments {
                        comments: get_comment_in_span(comments, &export_decl.span),
                        decl: ResultDecl::Var(*decl.clone()),
                    }],
                    swc_ecma_ast::Decl::TsInterface(decl) => vec![ResultDeclWithComments {
                        comments: get_comment_in_span(comments, &export_decl.span),
                        decl: ResultDecl::TsInterface(*decl.clone()),
                    }],
                    swc_ecma_ast::Decl::TsTypeAlias(decl) => vec![ResultDeclWithComments {
                        comments: get_comment_in_span(comments, &export_decl.span),
                        decl: ResultDecl::TsTypeAlias(*decl.clone()),
                    }],
                    swc_ecma_ast::Decl::TsEnum(decl) => vec![ResultDeclWithComments {
                        comments: get_comment_in_span(comments, &export_decl.span),
                        decl: ResultDecl::TsEnum(*decl.clone()),
                    }],
                    swc_ecma_ast::Decl::TsModule(ts_module) => {
                        ts_module_decl_to_result_decl_vec(ts_module, comments)
                    }
                },
                swc_ecma_ast::ModuleDecl::ExportNamed(_) => vec![],
                swc_ecma_ast::ModuleDecl::ExportDefaultDecl(_) => vec![],
                swc_ecma_ast::ModuleDecl::ExportDefaultExpr(_) => vec![],
                swc_ecma_ast::ModuleDecl::ExportAll(_) => vec![],
                swc_ecma_ast::ModuleDecl::TsImportEquals(_) => vec![],
                swc_ecma_ast::ModuleDecl::TsExportAssignment(_) => vec![],
                swc_ecma_ast::ModuleDecl::TsNamespaceExport(_) => vec![],
            },
            swc_ecma_ast::ModuleItem::Stmt(statement) => {
                statement_to_result_decl_vec(statement, comments)
            }
        })
        .collect()
}

fn statement_to_result_decl_vec(
    statement: &swc_ecma_ast::Stmt,
    comments: &dyn swc_common::comments::Comments,
) -> Vec<ResultDeclWithComments> {
    match statement {
        swc_ecma_ast::Stmt::Block(block) => block
            .stmts
            .iter()
            .flat_map(|stmt| statement_to_result_decl_vec(stmt, comments))
            .collect::<Vec<_>>(),
        swc_ecma_ast::Stmt::Empty(_) => vec![],
        swc_ecma_ast::Stmt::Debugger(_) => vec![],
        swc_ecma_ast::Stmt::With(_) => vec![],
        swc_ecma_ast::Stmt::Return(_) => vec![],
        swc_ecma_ast::Stmt::Labeled(_) => vec![],
        swc_ecma_ast::Stmt::Break(_) => vec![],
        swc_ecma_ast::Stmt::Continue(_) => vec![],
        swc_ecma_ast::Stmt::If(_) => vec![],
        swc_ecma_ast::Stmt::Switch(_) => vec![],
        swc_ecma_ast::Stmt::Throw(_) => vec![],
        swc_ecma_ast::Stmt::Try(_) => vec![],
        swc_ecma_ast::Stmt::While(_) => vec![],
        swc_ecma_ast::Stmt::DoWhile(_) => vec![],
        swc_ecma_ast::Stmt::For(_) => vec![],
        swc_ecma_ast::Stmt::ForIn(_) => vec![],
        swc_ecma_ast::Stmt::ForOf(_) => vec![],
        swc_ecma_ast::Stmt::Decl(decl) => match decl {
            swc_ecma_ast::Decl::Class(decl) => vec![ResultDeclWithComments {
                comments: get_comment_in_span(comments, &decl.class.span),
                decl: ResultDecl::Class(decl.clone()),
            }],
            swc_ecma_ast::Decl::Fn(decl) => vec![ResultDeclWithComments {
                comments: get_comment_in_span(comments, &decl.function.span),
                decl: ResultDecl::Fn(decl.clone()),
            }],
            swc_ecma_ast::Decl::Var(decl) => vec![ResultDeclWithComments {
                comments: get_comment_in_span(comments, &decl.span),
                decl: ResultDecl::Var(*decl.clone()),
            }],
            swc_ecma_ast::Decl::TsInterface(decl) => vec![ResultDeclWithComments {
                comments: get_comment_in_span(comments, &decl.span),
                decl: ResultDecl::TsInterface(*decl.clone()),
            }],
            swc_ecma_ast::Decl::TsTypeAlias(decl) => vec![ResultDeclWithComments {
                comments: get_comment_in_span(comments, &decl.span),
                decl: ResultDecl::TsTypeAlias(*decl.clone()),
            }],
            swc_ecma_ast::Decl::TsEnum(decl) => vec![ResultDeclWithComments {
                comments: get_comment_in_span(comments, &decl.span),
                decl: ResultDecl::TsEnum(*decl.clone()),
            }],
            swc_ecma_ast::Decl::TsModule(module_decl) => {
                ts_module_decl_to_result_decl_vec(module_decl, comments)
            }
        },
        swc_ecma_ast::Stmt::Expr(_) => todo!(),
    }
}

fn ts_module_decl_to_result_decl_vec(
    ts_module_decl: &swc_ecma_ast::TsModuleDecl,
    comments: &dyn swc_common::comments::Comments,
) -> Vec<ResultDeclWithComments> {
    match &ts_module_decl.body {
        Some(body) => match body {
            swc_ecma_ast::TsNamespaceBody::TsModuleBlock(block) => {
                pick_module_item(&block.body, comments)
            }
            swc_ecma_ast::TsNamespaceBody::TsNamespaceDecl(_) => vec![],
        },
        None => vec![],
    }
}

pub struct ResultDeclWithComments {
    pub comments: Option<Vec<swc_common::comments::Comment>>,
    pub decl: ResultDecl,
}

pub enum ResultDecl {
    Class(swc_ecma_ast::ClassDecl),
    Fn(swc_ecma_ast::FnDecl),
    Var(swc_ecma_ast::VarDecl),
    TsInterface(swc_ecma_ast::TsInterfaceDecl),
    TsTypeAlias(swc_ecma_ast::TsTypeAliasDecl),
    TsEnum(swc_ecma_ast::TsEnumDecl),
}

fn get_comment_in_span(
    comments: &dyn swc_common::comments::Comments,
    span: &swc_common::Span,
) -> Option<Vec<swc_common::comments::Comment>> {
    comments.get_leading(span.lo)
}
