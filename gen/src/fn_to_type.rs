pub fn param_or_ts_param_prop_to_ts_fn_param(
    p: &swc_ecma_ast::ParamOrTsParamProp,
) -> swc_ecma_ast::TsFnParam {
    match p {
        swc_ecma_ast::ParamOrTsParamProp::Param(param) => pat_to_ts_fn_param(&param.pat),
        swc_ecma_ast::ParamOrTsParamProp::TsParamProp(ts_param_prop) => {
            match &ts_param_prop.param {
                swc_ecma_ast::TsParamPropParam::Assign(assign_pat) => {
                    pat_to_ts_fn_param(&assign_pat.left)
                }
                swc_ecma_ast::TsParamPropParam::Ident(ident) => {
                    swc_ecma_ast::TsFnParam::Ident(ident.clone())
                }
            }
        }
    }
}

pub fn pat_to_ts_fn_param(param: &swc_ecma_ast::Pat) -> swc_ecma_ast::TsFnParam {
    match param {
        swc_ecma_ast::Pat::Ident(ident) => swc_ecma_ast::TsFnParam::Ident(ident.clone()),
        swc_ecma_ast::Pat::Array(array) => swc_ecma_ast::TsFnParam::Array(array.clone()),
        swc_ecma_ast::Pat::Rest(rest) => swc_ecma_ast::TsFnParam::Rest(rest.clone()),
        swc_ecma_ast::Pat::Object(object) => swc_ecma_ast::TsFnParam::Object(object.clone()),
        swc_ecma_ast::Pat::Assign(assign) => pat_to_ts_fn_param(&assign.left),
        swc_ecma_ast::Pat::Invalid(invalid) => {
            swc_ecma_ast::TsFnParam::Ident(swc_ecma_ast::BindingIdent {
                id: swc_ecma_ast::Ident::new(string_cache::Atom::from("__invalid__"), invalid.span),
                type_ann: None,
            })
        }
        swc_ecma_ast::Pat::Expr(_) => swc_ecma_ast::TsFnParam::Ident(swc_ecma_ast::BindingIdent {
            id: swc_ecma_ast::Ident::new(
                string_cache::Atom::from("__expr__"),
                swc_common::Span::default(),
            ),
            type_ann: None,
        }),
    }
}

pub fn prop_name_to_expr(prop_name: &swc_ecma_ast::PropName) -> swc_ecma_ast::Expr {
    match prop_name {
        swc_ecma_ast::PropName::BigInt(big_int) => {
            swc_ecma_ast::Expr::Lit(swc_ecma_ast::Lit::BigInt(big_int.clone()))
        }
        swc_ecma_ast::PropName::Ident(ident) => swc_ecma_ast::Expr::Ident(ident.clone()),
        swc_ecma_ast::PropName::Str(str) => {
            swc_ecma_ast::Expr::Lit(swc_ecma_ast::Lit::Str(str.clone()))
        }
        swc_ecma_ast::PropName::Num(num) => {
            swc_ecma_ast::Expr::Lit(swc_ecma_ast::Lit::Num(num.clone()))
        }
        swc_ecma_ast::PropName::Computed(computed) => *computed.expr.clone(),
    }
}
