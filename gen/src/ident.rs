pub const VS_CODE_API_IDENT: once_cell::sync::Lazy<swc_ecma_ast::Ident> =
    once_cell::sync::Lazy::new(|| {
        swc_ecma_ast::Ident::new(
            string_cache::Atom::from("VSCodeAPI"),
            swc_common::Span::default(),
        )
    });
