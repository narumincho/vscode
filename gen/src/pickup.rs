pub fn pick_module_item(module_items: &Vec<swc_ecma_ast::ModuleItem>) -> Vec<ResultDeclWithSpan> {
    module_items
        .iter()
        .flat_map(|item| match item {
            swc_ecma_ast::ModuleItem::ModuleDecl(module_decl) => match module_decl {
                swc_ecma_ast::ModuleDecl::Import(_) => vec![],
                swc_ecma_ast::ModuleDecl::ExportDecl(export_decl) => match &export_decl.decl {
                    swc_ecma_ast::Decl::Class(decl) => vec![ResultDeclWithSpan {
                        span: export_decl.span.clone(),
                        decl: ResultDecl::Class(decl.clone()),
                    }],
                    swc_ecma_ast::Decl::Fn(decl) => vec![ResultDeclWithSpan {
                        span: export_decl.span.clone(),
                        decl: ResultDecl::Fn(decl.clone()),
                    }],
                    swc_ecma_ast::Decl::Var(decl) => vec![ResultDeclWithSpan {
                        span: export_decl.span.clone(),
                        decl: ResultDecl::Var(*decl.clone()),
                    }],
                    swc_ecma_ast::Decl::TsInterface(decl) => vec![ResultDeclWithSpan {
                        span: export_decl.span.clone(),
                        decl: ResultDecl::TsInterface(*decl.clone()),
                    }],
                    swc_ecma_ast::Decl::TsTypeAlias(decl) => vec![ResultDeclWithSpan {
                        span: export_decl.span.clone(),
                        decl: ResultDecl::TsTypeAlias(*decl.clone()),
                    }],
                    swc_ecma_ast::Decl::TsEnum(decl) => vec![ResultDeclWithSpan {
                        span: export_decl.span.clone(),
                        decl: ResultDecl::TsEnum(*decl.clone()),
                    }],
                    swc_ecma_ast::Decl::TsModule(ts_module) => {
                        ts_module_decl_to_result_decl_vec(ts_module)
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
            swc_ecma_ast::ModuleItem::Stmt(statement) => statement_to_result_decl_vec(statement),
        })
        .collect()
}

fn statement_to_result_decl_vec(statement: &swc_ecma_ast::Stmt) -> Vec<ResultDeclWithSpan> {
    match statement {
        swc_ecma_ast::Stmt::Block(block) => block
            .stmts
            .iter()
            .flat_map(|stmt| statement_to_result_decl_vec(stmt))
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
            swc_ecma_ast::Decl::Class(decl) => vec![ResultDeclWithSpan {
                span: decl.class.span.clone(),
                decl: ResultDecl::Class(decl.clone()),
            }],
            swc_ecma_ast::Decl::Fn(decl) => vec![ResultDeclWithSpan {
                span: decl.function.span.clone(),
                decl: ResultDecl::Fn(decl.clone()),
            }],
            swc_ecma_ast::Decl::Var(decl) => vec![ResultDeclWithSpan {
                span: decl.span.clone(),
                decl: ResultDecl::Var(*decl.clone()),
            }],
            swc_ecma_ast::Decl::TsInterface(decl) => vec![ResultDeclWithSpan {
                span: decl.span.clone(),
                decl: ResultDecl::TsInterface(*decl.clone()),
            }],
            swc_ecma_ast::Decl::TsTypeAlias(decl) => vec![ResultDeclWithSpan {
                span: decl.span.clone(),
                decl: ResultDecl::TsTypeAlias(*decl.clone()),
            }],
            swc_ecma_ast::Decl::TsEnum(decl) => vec![ResultDeclWithSpan {
                span: decl.span.clone(),
                decl: ResultDecl::TsEnum(*decl.clone()),
            }],
            swc_ecma_ast::Decl::TsModule(module_decl) => {
                ts_module_decl_to_result_decl_vec(module_decl)
            }
        },
        swc_ecma_ast::Stmt::Expr(_) => todo!(),
    }
}

fn ts_module_decl_to_result_decl_vec(
    ts_module_decl: &swc_ecma_ast::TsModuleDecl,
) -> Vec<ResultDeclWithSpan> {
    match &ts_module_decl.body {
        Some(body) => match body {
            swc_ecma_ast::TsNamespaceBody::TsModuleBlock(block) => pick_module_item(&block.body),
            swc_ecma_ast::TsNamespaceBody::TsNamespaceDecl(_) => vec![],
        },
        None => vec![],
    }
}

pub struct ResultDeclWithSpan {
    pub span: swc_common::Span,
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
