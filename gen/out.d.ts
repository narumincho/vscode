/**
	 * A file glob pattern to match file paths against. This can either be a glob pattern string
	 * (like `**​/*.{ts,js}` or `*.{ts,js}`) or a {@link RelativePattern relative pattern}.
	 *
	 * Glob patterns can have the following syntax:
	 * * `*` to match zero or more characters in a path segment
	 * * `?` to match on one character in a path segment
	 * * `**` to match any number of path segments, including none
	 * * `{}` to group conditions (e.g. `**​/*.{ts,js}` matches all TypeScript and JavaScript files)
	 * * `[]` to declare a range of characters to match in a path segment (e.g., `example.[0-9]` to match on `example.0`, `example.1`, …)
	 * * `[!...]` to negate a range of characters to match in a path segment (e.g., `example.[!0-9]` to match on `example.a`, `example.b`, but not `example.0`)
	 *
	 * Note: a backslash (`\`) is not valid within a glob pattern. If you have an existing file
	 * path to match against, consider to use the {@link RelativePattern relative pattern} support
	 * that takes care of converting any backslash into slash. Otherwise, make sure to convert
	 * any backslash to slash when creating the glob pattern.
	 */ export type GlobPattern = string | RelativePattern;
/**
	 * A language selector is the combination of one or many language identifiers
	 * and {@link DocumentFilter language filters}.
	 *
	 * *Note* that a document selector that is just a language identifier selects *all*
	 * documents, even those that are not saved on disk. Only use such selectors when
	 * a feature works without further context, e.g. without the need to resolve related
	 * 'files'.
	 *
	 * @example
	 * let sel:DocumentSelector = { scheme: 'file', language: 'typescript' };
	 */ export type DocumentSelector = DocumentFilter | string | ReadonlyArray<DocumentFilter | string>;
/**
	 * A provider result represents the values a provider, like the {@linkcode HoverProvider},
	 * may return. For once this is the actual result type `T`, like `Hover`, or a thenable that resolves
	 * to that type `T`. In addition, `null` and `undefined` can be returned - either directly or from a
	 * thenable.
	 *
	 * The snippets below are all valid implementations of the {@linkcode HoverProvider}:
	 *
	 * ```ts
	 * let a: HoverProvider = {
	 * 	provideHover(doc, pos, token): ProviderResult<Hover> {
	 * 		return new Hover('Hello World');
	 * 	}
	 * }
	 *
	 * let b: HoverProvider = {
	 * 	provideHover(doc, pos, token): ProviderResult<Hover> {
	 * 		return new Promise(resolve => {
	 * 			resolve(new Hover('Hello World'));
	 * 	 	});
	 * 	}
	 * }
	 *
	 * let c: HoverProvider = {
	 * 	provideHover(doc, pos, token): ProviderResult<Hover> {
	 * 		return; // undefined
	 * 	}
	 * }
	 * ```
	 */ export type ProviderResult<T> = T | undefined | null | Thenable<T | undefined | null>;
/**
	 * Information about where a symbol is defined.
	 *
	 * Provides additional metadata over normal {@link Location} definitions, including the range of
	 * the defining symbol
	 */ export type DefinitionLink = LocationLink;
/**
	 * The definition of a symbol represented as one or many {@link Location locations}.
	 * For most programming languages there is only one location at which a symbol is
	 * defined.
	 */ export type Definition = Location | Location[];
/**
	 * The declaration of a symbol representation as one or many {@link Location locations}
	 * or {@link LocationLink location links}.
	 */ export type Declaration = Location | Location[] | LocationLink[];
/**
	 * MarkedString can be used to render human-readable text. It is either a markdown string
	 * or a code-block that provides a language and a code snippet. Note that
	 * markdown strings will be sanitized - that means html will be escaped.
	 *
	 * @deprecated This type is deprecated, please use {@linkcode MarkdownString} instead.
	 */ export type MarkedString = string | {
    language: string;
    value: string;
};
/**
	 * Inline value information can be provided by different means:
	 * - directly as a text value (class InlineValueText).
	 * - as a name to use for a variable lookup (class InlineValueVariableLookup)
	 * - as an evaluatable expression (class InlineValueEvaluatableExpression)
	 * The InlineValue types combines all inline value types into one type.
	 */ export type InlineValue = InlineValueText | InlineValueVariableLookup | InlineValueEvaluatableExpression;
/**
	 * A tuple of two characters, like a pair of
	 * opening and closing brackets.
	 */ export type CharacterPair = [string, string];
/**
	 * The configuration scope which can be a
	 * a 'resource' or a languageId or both or
	 * a '{@link TextDocument}' or
	 * a '{@link WorkspaceFolder}'
	 */ export type ConfigurationScope = Uri | TextDocument | WorkspaceFolder | {
    uri?: Uri;
    languageId: string;
};
export type DebugAdapterDescriptor = DebugAdapterExecutable | DebugAdapterServer | DebugAdapterNamedPipeServer | DebugAdapterInlineImplementation;
