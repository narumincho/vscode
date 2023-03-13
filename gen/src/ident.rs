pub fn vs_code_api_ident() -> swc_ecma_ast::Ident {
    swc_ecma_ast::Ident::new(
        string_cache::Atom::from("VSCodeAPI"),
        swc_common::Span::default(),
    )
}
