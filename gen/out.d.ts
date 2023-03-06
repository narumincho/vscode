/**
	 * Represents a line and character position, such as
	 * the position of the cursor.
	 *
	 * Position objects are __immutable__. Use the {@link Position.with with} or
	 * {@link Position.translate translate} methods to derive new positions
	 * from an existing position.
	 */ export type Position = {
    /**
		 * @param line A zero-based line value.
		 * @param character A zero-based character value.
		 */ new(line: number, character: number): Position;
};
/**
	 * A range represents an ordered pair of two positions.
	 * It is guaranteed that {@link Range.start start}.isBeforeOrEqual({@link Range.end end})
	 *
	 * Range objects are __immutable__. Use the {@link Range.with with},
	 * {@link Range.intersection intersection}, or {@link Range.union union} methods
	 * to derive new ranges from an existing range.
	 */ export type Range = {
    /**
		 * Create a new range from two positions. If `start` is not
		 * before or equal to `end`, the values will be swapped.
		 *
		 * @param start A position.
		 * @param end A position.
		 */ new(start: Position, end: Position): Range;
    /**
		 * Create a new range from number coordinates. It is a shorter equivalent of
		 * using `new Range(new Position(startLine, startCharacter), new Position(endLine, endCharacter))`
		 *
		 * @param startLine A zero-based line value.
		 * @param startCharacter A zero-based character value.
		 * @param endLine A zero-based line value.
		 * @param endCharacter A zero-based character value.
		 */ new(startLine: number, startCharacter: number, endLine: number, endCharacter: number): Range;
};
/**
	 * Represents a text selection in an editor.
	 */ export type Selection = {
    /**
		 * Create a selection from two positions.
		 *
		 * @param anchor A position.
		 * @param active A position.
		 */ new(anchor: Position, active: Position): Selection;
    /**
		 * Create a selection from four coordinates.
		 *
		 * @param anchorLine A zero-based line value.
		 * @param anchorCharacter A zero-based character value.
		 * @param activeLine A zero-based line value.
		 * @param activeCharacter A zero-based character value.
		 */ new(anchorLine: number, anchorCharacter: number, activeLine: number, activeCharacter: number): Selection;
};
/**
	 * A reference to one of the workbench colors as defined in https://code.visualstudio.com/docs/getstarted/theme-color-reference.
	 * Using a theme color is preferred over a custom color as it gives theme authors and users the possibility to change the color.
	 */ export type ThemeColor = {
    /**
		 * Creates a reference to a theme color.
		 * @param id of the color. The available colors are listed in https://code.visualstudio.com/docs/getstarted/theme-color-reference.
		 */ new(id: string): ThemeColor;
};
/**
	 * A reference to a named icon. Currently, {@link ThemeIcon.File File}, {@link ThemeIcon.Folder Folder},
	 * and [ThemeIcon ids](https://code.visualstudio.com/api/references/icons-in-labels#icon-listing) are supported.
	 * Using a theme icon is preferred over a custom icon as it gives product theme authors the possibility to change the icons.
	 *
	 * *Note* that theme icons can also be rendered inside labels and descriptions. Places that support theme icons spell this out
	 * and they use the `$(<name>)`-syntax, for instance `quickPick.label = "Hello World $(globe)"`.
	 */ export type ThemeIcon = {
    /**
		 * Creates a reference to a theme icon.
		 * @param id id of the icon. The available icons are listed in https://code.visualstudio.com/api/references/icons-in-labels#icon-listing.
		 * @param color optional `ThemeColor` for the icon. The color is currently only used in {@link TreeItem}.
		 */ new(id: string, color?: ThemeColor): ThemeIcon;
};
/**
	 * A universal resource identifier representing either a file on disk
	 * or another resource, like untitled resources.
	 */ export type Uri = {
    /**
		 * Use the `file` and `parse` factory functions to create new `Uri` objects.
		 */ new(scheme: string, authority: string, path: string, query: string, fragment: string): Uri;
};
/**
	 * A cancellation source creates and controls a {@link CancellationToken cancellation token}.
	 */ export type CancellationTokenSource = {
};
/**
	 * An error type that should be used to signal cancellation of an operation.
	 *
	 * This type can be used in response to a {@link CancellationToken cancellation token}
	 * being cancelled or when an operation is being cancelled by the
	 * executor of that operation.
	 */ export type CancellationError = {
    /**
		 * Creates a new cancellation error.
		 */ new(): CancellationError;
};
/**
	 * Represents a type which can release resources, such
	 * as event listening or a timer.
	 */ export type Disposable = {
    /**
		 * Creates a new disposable that calls the provided function
		 * on dispose.
		 *
		 * *Note* that an asynchronous function is not awaited.
		 *
		 * @param callOnDispose Function that disposes something.
		 */ new(callOnDispose: () => any): Disposable;
};
/**
	 * An event emitter can be used to create and manage an {@link Event} for others
	 * to subscribe to. One emitter always owns one event.
	 *
	 * Use this class if you want to provide event from within your extension, for instance
	 * inside a {@link TextDocumentContentProvider} or when providing
	 * API to other extensions.
	 */ export type EventEmitter = {
};
/**
	 * A relative pattern is a helper to construct glob patterns that are matched
	 * relatively to a base file path. The base path can either be an absolute file
	 * path as string or uri or a {@link WorkspaceFolder workspace folder}, which is the
	 * preferred way of creating the relative pattern.
	 */ export type RelativePattern = {
    /**
		 * Creates a new relative pattern object with a base file path and pattern to match. This pattern
		 * will be matched on file paths relative to the base.
		 *
		 * Example:
		 * ```ts
		 * const folder = vscode.workspace.workspaceFolders?.[0];
		 * if (folder) {
		 *
		 *   // Match any TypeScript file in the root of this workspace folder
		 *   const pattern1 = new vscode.RelativePattern(folder, '*.ts');
		 *
		 *   // Match any TypeScript file in `someFolder` inside this workspace folder
		 *   const pattern2 = new vscode.RelativePattern(folder, 'someFolder/*.ts');
		 * }
		 * ```
		 *
		 * @param base A base to which this pattern will be matched against relatively. It is recommended
		 * to pass in a {@link WorkspaceFolder workspace folder} if the pattern should match inside the workspace.
		 * Otherwise, a uri or string should only be used if the pattern is for a file path outside the workspace.
		 * @param pattern A file glob pattern like `*.{ts,js}` that will be matched on paths relative to the base.
		 */ new(base: WorkspaceFolder | Uri | string, pattern: string): RelativePattern;
};
/**
	 * Kind of a code action.
	 *
	 * Kinds are a hierarchical list of identifiers separated by `.`, e.g. `"refactor.extract.function"`.
	 *
	 * Code action kinds are used by the editor for UI elements such as the refactoring context menu. Users
	 * can also trigger code actions with a specific kind with the `editor.action.codeAction` command.
	 */ export type CodeActionKind = {
    new(value: string): CodeActionKind;
};
/**
	 * A code action represents a change that can be performed in code, e.g. to fix a problem or
	 * to refactor code.
	 *
	 * A CodeAction must set either {@linkcode CodeAction.edit edit} and/or a {@linkcode CodeAction.command command}. If both are supplied, the `edit` is applied first, then the command is executed.
	 */ export type CodeAction = {
    /**
		 * Creates a new code action.
		 *
		 * A code action must have at least a {@link CodeAction.title title} and {@link CodeAction.edit edits}
		 * and/or a {@link CodeAction.command command}.
		 *
		 * @param title The title of the code action.
		 * @param kind The kind of the code action.
		 */ new(title: string, kind?: CodeActionKind): CodeAction;
};
/**
	 * A code lens represents a {@link Command} that should be shown along with
	 * source text, like the number of references, a way to run tests, etc.
	 *
	 * A code lens is _unresolved_ when no command is associated to it. For performance
	 * reasons the creation of a code lens and resolving should be done to two stages.
	 *
	 * @see {@link CodeLensProvider.provideCodeLenses}
	 * @see {@link CodeLensProvider.resolveCodeLens}
	 */ export type CodeLens = {
    /**
		 * Creates a new code lens object.
		 *
		 * @param range The range to which this code lens applies.
		 * @param command The command associated to this code lens.
		 */ new(range: Range, command?: Command): CodeLens;
};
/**
	 * Human-readable text that supports formatting via the [markdown syntax](https://commonmark.org).
	 *
	 * Rendering of {@link ThemeIcon theme icons} via the `$(<name>)`-syntax is supported
	 * when the {@linkcode supportThemeIcons} is set to `true`.
	 *
	 * Rendering of embedded html is supported when {@linkcode supportHtml} is set to `true`.
	 */ export type MarkdownString = {
    /**
		 * Creates a new markdown string with the given value.
		 *
		 * @param value Optional, initial value.
		 * @param supportThemeIcons Optional, Specifies whether {@link ThemeIcon ThemeIcons} are supported within the {@linkcode MarkdownString}.
		 */ new(value?: string, supportThemeIcons?: boolean): MarkdownString;
};
/**
	 * A hover represents additional information for a symbol or word. Hovers are
	 * rendered in a tooltip-like widget.
	 */ export type Hover = {
    /**
		 * Creates a new hover object.
		 *
		 * @param contents The contents of the hover.
		 * @param range The range to which the hover applies.
		 */ new(contents: MarkdownString | MarkedString | Array<MarkdownString | MarkedString>, range?: Range): Hover;
};
/**
	 * An EvaluatableExpression represents an expression in a document that can be evaluated by an active debugger or runtime.
	 * The result of this evaluation is shown in a tooltip-like widget.
	 * If only a range is specified, the expression will be extracted from the underlying document.
	 * An optional expression can be used to override the extracted expression.
	 * In this case the range is still used to highlight the range in the document.
	 */ export type EvaluatableExpression = {
    /**
		 * Creates a new evaluatable expression object.
		 *
		 * @param range The range in the underlying document from which the evaluatable expression is extracted.
		 * @param expression If specified overrides the extracted expression.
		 */ new(range: Range, expression?: string): EvaluatableExpression;
};
/**
	 * Provide inline value as text.
	 */ export type InlineValueText = {
    /**
		 * Creates a new InlineValueText object.
		 *
		 * @param range The document line where to show the inline value.
		 * @param text The value to be shown for the line.
		 */ new(range: Range, text: string): InlineValueText;
};
/**
	 * Provide inline value through a variable lookup.
	 * If only a range is specified, the variable name will be extracted from the underlying document.
	 * An optional variable name can be used to override the extracted name.
	 */ export type InlineValueVariableLookup = {
    /**
		 * Creates a new InlineValueVariableLookup object.
		 *
		 * @param range The document line where to show the inline value.
		 * @param variableName The name of the variable to look up.
		 * @param caseSensitiveLookup How to perform the lookup. If missing lookup is case sensitive.
		 */ new(range: Range, variableName?: string, caseSensitiveLookup?: boolean): InlineValueVariableLookup;
};
/**
	 * Provide an inline value through an expression evaluation.
	 * If only a range is specified, the expression will be extracted from the underlying document.
	 * An optional expression can be used to override the extracted expression.
	 */ export type InlineValueEvaluatableExpression = {
    /**
		 * Creates a new InlineValueEvaluatableExpression object.
		 *
		 * @param range The range in the underlying document from which the evaluatable expression is extracted.
		 * @param expression If specified overrides the extracted expression.
		 */ new(range: Range, expression?: string): InlineValueEvaluatableExpression;
};
/**
	 * A document highlight is a range inside a text document which deserves
	 * special attention. Usually a document highlight is visualized by changing
	 * the background color of its range.
	 */ export type DocumentHighlight = {
    /**
		 * Creates a new document highlight object.
		 *
		 * @param range The range the highlight applies to.
		 * @param kind The highlight kind, default is {@link DocumentHighlightKind.Text text}.
		 */ new(range: Range, kind?: DocumentHighlightKind): DocumentHighlight;
};
/**
	 * Represents information about programming constructs like variables, classes,
	 * interfaces etc.
	 */ export type SymbolInformation = {
    /**
		 * Creates a new symbol information object.
		 *
		 * @param name The name of the symbol.
		 * @param kind The kind of the symbol.
		 * @param containerName The name of the symbol containing the symbol.
		 * @param location The location of the symbol.
		 */ new(name: string, kind: SymbolKind, containerName: string, location: Location): SymbolInformation;
    /**
		 * Creates a new symbol information object.
		 *
		 * @deprecated Please use the constructor taking a {@link Location} object.
		 *
		 * @param name The name of the symbol.
		 * @param kind The kind of the symbol.
		 * @param range The range of the location of the symbol.
		 * @param uri The resource of the location of symbol, defaults to the current document.
		 * @param containerName The name of the symbol containing the symbol.
		 */ new(name: string, kind: SymbolKind, range: Range, uri?: Uri, containerName?: string): SymbolInformation;
};
/**
	 * Represents programming constructs like variables, classes, interfaces etc. that appear in a document. Document
	 * symbols can be hierarchical and they have two ranges: one that encloses its definition and one that points to
	 * its most interesting range, e.g. the range of an identifier.
	 */ export type DocumentSymbol = {
    /**
		 * Creates a new document symbol.
		 *
		 * @param name The name of the symbol.
		 * @param detail Details for the symbol.
		 * @param kind The kind of the symbol.
		 * @param range The full range of the symbol.
		 * @param selectionRange The range that should be reveal.
		 */ new(name: string, detail: string, kind: SymbolKind, range: Range, selectionRange: Range): DocumentSymbol;
};
/**
	 * A text edit represents edits that should be applied
	 * to a document.
	 */ export type TextEdit = {
    /**
		 * Create a new TextEdit.
		 *
		 * @param range A range.
		 * @param newText A string.
		 */ new(range: Range, newText: string): TextEdit;
};
/**
	 * A snippet edit represents an interactive edit that is performed by
	 * the editor.
	 *
	 * *Note* that a snippet edit can always be performed as a normal {@link TextEdit text edit}.
	 * This will happen when no matching editor is open or when a {@link WorkspaceEdit workspace edit}
	 * contains snippet edits for multiple files. In that case only those that match the active editor
	 * will be performed as snippet edits and the others as normal text edits.
	 */ export type SnippetTextEdit = {
    /**
		 * Create a new snippet edit.
		 *
		 * @param range A range.
		 * @param snippet A snippet string.
		 */ new(range: Range, snippet: SnippetString): SnippetTextEdit;
};
/**
	 * A notebook edit represents edits that should be applied to the contents of a notebook.
	 */ export type NotebookEdit = {
    new(range: NotebookRange, newCells: NotebookCellData[]): NotebookEdit;
};
/**
	 * A workspace edit is a collection of textual and files changes for
	 * multiple resources and documents.
	 *
	 * Use the {@link workspace.applyEdit applyEdit}-function to apply a workspace edit.
	 */ export type WorkspaceEdit = {
};
/**
	 * A snippet string is a template which allows to insert text
	 * and to control the editor cursor when insertion happens.
	 *
	 * A snippet can define tab stops and placeholders with `$1`, `$2`
	 * and `${3:foo}`. `$0` defines the final tab stop, it defaults to
	 * the end of the snippet. Variables are defined with `$name` and
	 * `${name:default value}`. Also see
	 * [the full snippet syntax](https://code.visualstudio.com/docs/editor/userdefinedsnippets#_creating-your-own-snippets).
	 */ export type SnippetString = {
    new(value?: string): SnippetString;
};
/**
	 * A semantic tokens legend contains the needed information to decipher
	 * the integer encoded representation of semantic tokens.
	 */ export type SemanticTokensLegend = {
    new(tokenTypes: string[], tokenModifiers?: string[]): SemanticTokensLegend;
};
/**
	 * A semantic tokens builder can help with creating a `SemanticTokens` instance
	 * which contains delta encoded semantic tokens.
	 */ export type SemanticTokensBuilder = {
    new(legend?: SemanticTokensLegend): SemanticTokensBuilder;
};
/**
	 * Represents semantic tokens, either in a range or in an entire document.
	 * @see {@link DocumentSemanticTokensProvider.provideDocumentSemanticTokens provideDocumentSemanticTokens} for an explanation of the format.
	 * @see {@link SemanticTokensBuilder} for a helper to create an instance.
	 */ export type SemanticTokens = {
    new(data: Uint32Array, resultId?: string): SemanticTokens;
};
/**
	 * Represents edits to semantic tokens.
	 * @see {@link DocumentSemanticTokensProvider.provideDocumentSemanticTokensEdits provideDocumentSemanticTokensEdits} for an explanation of the format.
	 */ export type SemanticTokensEdits = {
    new(edits: SemanticTokensEdit[], resultId?: string): SemanticTokensEdits;
};
/**
	 * Represents an edit to semantic tokens.
	 * @see {@link DocumentSemanticTokensProvider.provideDocumentSemanticTokensEdits provideDocumentSemanticTokensEdits} for an explanation of the format.
	 */ export type SemanticTokensEdit = {
    new(start: number, deleteCount: number, data?: Uint32Array): SemanticTokensEdit;
};
/**
	 * Represents a parameter of a callable-signature. A parameter can
	 * have a label and a doc-comment.
	 */ export type ParameterInformation = {
    /**
		 * Creates a new parameter information object.
		 *
		 * @param label A label string or inclusive start and exclusive end offsets within its containing signature label.
		 * @param documentation A doc string.
		 */ new(label: string | [number, number], documentation?: string | MarkdownString): ParameterInformation;
};
/**
	 * Represents the signature of something callable. A signature
	 * can have a label, like a function-name, a doc-comment, and
	 * a set of parameters.
	 */ export type SignatureInformation = {
    /**
		 * Creates a new signature information object.
		 *
		 * @param label A label string.
		 * @param documentation A doc string.
		 */ new(label: string, documentation?: string | MarkdownString): SignatureInformation;
};
/**
	 * Signature help represents the signature of something
	 * callable. There can be multiple signatures but only one
	 * active and only one active parameter.
	 */ export type SignatureHelp = {
};
/**
	 * A completion item represents a text snippet that is proposed to complete text that is being typed.
	 *
	 * It is sufficient to create a completion item from just a {@link CompletionItem.label label}. In that
	 * case the completion item will replace the {@link TextDocument.getWordRangeAtPosition word}
	 * until the cursor with the given label or {@link CompletionItem.insertText insertText}. Otherwise the
	 * given {@link CompletionItem.textEdit edit} is used.
	 *
	 * When selecting a completion item in the editor its defined or synthesized text edit will be applied
	 * to *all* cursors/selections whereas {@link CompletionItem.additionalTextEdits additionalTextEdits} will be
	 * applied as provided.
	 *
	 * @see {@link CompletionItemProvider.provideCompletionItems}
	 * @see {@link CompletionItemProvider.resolveCompletionItem}
	 */ export type CompletionItem = {
    /**
		 * Creates a new completion item.
		 *
		 * Completion items must have at least a {@link CompletionItem.label label} which then
		 * will be used as insert text as well as for sorting and filtering.
		 *
		 * @param label The label of the completion.
		 * @param kind The {@link CompletionItemKind kind} of the completion.
		 */ new(label: string | CompletionItemLabel, kind?: CompletionItemKind): CompletionItem;
};
/**
	 * Represents a collection of {@link CompletionItem completion items} to be presented
	 * in the editor.
	 */ export type CompletionList = {
    /**
		 * Creates a new completion list.
		 *
		 * @param items The completion items.
		 * @param isIncomplete The list is not complete.
		 */ new(items?: T[], isIncomplete?: boolean): CompletionList;
};
/**
	 * Represents a collection of {@link InlineCompletionItem inline completion items} to be presented
	 * in the editor.
	 */ export type InlineCompletionList = {
    /**
		 * Creates a new list of inline completion items.
		*/ new(items: InlineCompletionItem[]): InlineCompletionList;
};
/**
	 * An inline completion item represents a text snippet that is proposed inline to complete text that is being typed.
	 *
	 * @see {@link InlineCompletionItemProvider.provideInlineCompletionItems}
	 */ export type InlineCompletionItem = {
    /**
		 * Creates a new inline completion item.
		 *
		 * @param insertText The text to replace the range with.
		 * @param range The range to replace. If not set, the word at the requested position will be used.
		 * @param command An optional {@link Command} that is executed *after* inserting this completion.
		 */ new(insertText: string | SnippetString, range?: Range, command?: Command): InlineCompletionItem;
};
/**
	 * A document link is a range in a text document that links to an internal or external resource, like another
	 * text document or a web site.
	 */ export type DocumentLink = {
    /**
		 * Creates a new document link.
		 *
		 * @param range The range the document link applies to. Must not be empty.
		 * @param target The uri the document link points to.
		 */ new(range: Range, target?: Uri): DocumentLink;
};
/**
	 * Represents a color in RGBA space.
	 */ export type Color = {
    /**
		 * Creates a new color instance.
		 *
		 * @param red The red component.
		 * @param green The green component.
		 * @param blue The blue component.
		 * @param alpha The alpha component.
		 */ new(red: number, green: number, blue: number, alpha: number): Color;
};
/**
	 * Represents a color range from a document.
	 */ export type ColorInformation = {
    /**
		 * Creates a new color range.
		 *
		 * @param range The range the color appears in. Must not be empty.
		 * @param color The value of the color.
		 */ new(range: Range, color: Color): ColorInformation;
};
/**
	 * A color presentation object describes how a {@linkcode Color} should be represented as text and what
	 * edits are required to refer to it from source code.
	 *
	 * For some languages one color can have multiple presentations, e.g. css can represent the color red with
	 * the constant `Red`, the hex-value `#ff0000`, or in rgba and hsla forms. In csharp other representations
	 * apply, e.g. `System.Drawing.Color.Red`.
	 */ export type ColorPresentation = {
    /**
		 * Creates a new color presentation.
		 *
		 * @param label The label of this color presentation.
		 */ new(label: string): ColorPresentation;
};
/**
	 * An inlay hint label part allows for interactive and composite labels of inlay hints.
	 */ export type InlayHintLabelPart = {
    /**
		 * Creates a new inlay hint label part.
		 *
		 * @param value The value of the part.
		 */ new(value: string): InlayHintLabelPart;
};
/**
	 * Inlay hint information.
	 */ export type InlayHint = {
    /**
		 * Creates a new inlay hint.
		 *
		 * @param position The position of the hint.
		 * @param label The label of the hint.
		 * @param kind The {@link InlayHintKind kind} of the hint.
		 */ new(position: Position, label: string | InlayHintLabelPart[], kind?: InlayHintKind): InlayHint;
};
/**
	 * A line based folding range. To be valid, start and end line must be bigger than zero and smaller than the number of lines in the document.
	 * Invalid ranges will be ignored.
	 */ export type FoldingRange = {
    /**
		 * Creates a new folding range.
		 *
		 * @param start The start line of the folded range.
		 * @param end The end line of the folded range.
		 * @param kind The kind of the folding range.
		 */ new(start: number, end: number, kind?: FoldingRangeKind): FoldingRange;
};
/**
	 * A selection range represents a part of a selection hierarchy. A selection range
	 * may have a parent selection range that contains it.
	 */ export type SelectionRange = {
    /**
		 * Creates a new selection range.
		 *
		 * @param range The range of the selection range.
		 * @param parent The parent of the selection range.
		 */ new(range: Range, parent?: SelectionRange): SelectionRange;
};
/**
	 * Represents programming constructs like functions or constructors in the context
	 * of call hierarchy.
	 */ export type CallHierarchyItem = {
    /**
		 * Creates a new call hierarchy item.
		 */ new(kind: SymbolKind, name: string, detail: string, uri: Uri, range: Range, selectionRange: Range): CallHierarchyItem;
};
/**
	 * Represents an incoming call, e.g. a caller of a method or constructor.
	 */ export type CallHierarchyIncomingCall = {
    /**
		 * Create a new call object.
		 *
		 * @param item The item making the call.
		 * @param fromRanges The ranges at which the calls appear.
		 */ new(item: CallHierarchyItem, fromRanges: Range[]): CallHierarchyIncomingCall;
};
/**
	 * Represents an outgoing call, e.g. calling a getter from a method or a method from a constructor etc.
	 */ export type CallHierarchyOutgoingCall = {
    /**
		 * Create a new call object.
		 *
		 * @param item The item being called
		 * @param fromRanges The ranges at which the calls appear.
		 */ new(item: CallHierarchyItem, fromRanges: Range[]): CallHierarchyOutgoingCall;
};
/**
	 * Represents an item of a type hierarchy, like a class or an interface.
	 */ export type TypeHierarchyItem = {
    /**
		 * Creates a new type hierarchy item.
		 *
		 * @param kind The kind of the item.
		 * @param name The name of the item.
		 * @param detail The details of the item.
		 * @param uri The Uri of the item.
		 * @param range The whole range of the item.
		 * @param selectionRange The selection range of the item.
		 */ new(kind: SymbolKind, name: string, detail: string, uri: Uri, range: Range, selectionRange: Range): TypeHierarchyItem;
};
/**
	 * Represents a list of ranges that can be edited together along with a word pattern to describe valid range contents.
	 */ export type LinkedEditingRanges = {
    /**
		 * Create a new linked editing ranges object.
		 *
		 * @param ranges A list of ranges that can be edited together
		 * @param wordPattern An optional word pattern that describes valid contents for the given ranges
		 */ new(ranges: Range[], wordPattern?: RegExp): LinkedEditingRanges;
};
/**
	 * An edit operation applied {@link DocumentDropEditProvider on drop}.
	 */ export type DocumentDropEdit = {
    /**
		 * @param insertText The text or snippet to insert at the drop location.
		 */ new(insertText: string | SnippetString): DocumentDropEdit;
};
/**
	 * Represents a location inside a resource, such as a line
	 * inside a text file.
	 */ export type Location = {
    /**
		 * Creates a new location object.
		 *
		 * @param uri The resource identifier.
		 * @param rangeOrPosition The range or position. Positions will be converted to an empty range.
		 */ new(uri: Uri, rangeOrPosition: Range | Position): Location;
};
/**
	 * Represents a related message and source code location for a diagnostic. This should be
	 * used to point to code locations that cause or related to a diagnostics, e.g. when duplicating
	 * a symbol in a scope.
	 */ export type DiagnosticRelatedInformation = {
    /**
		 * Creates a new related diagnostic information object.
		 *
		 * @param location The location.
		 * @param message The message.
		 */ new(location: Location, message: string): DiagnosticRelatedInformation;
};
/**
	 * Represents a diagnostic, such as a compiler error or warning. Diagnostic objects
	 * are only valid in the scope of a file.
	 */ export type Diagnostic = {
    /**
		 * Creates a new diagnostic object.
		 *
		 * @param range The range to which this diagnostic applies.
		 * @param message The human-readable message.
		 * @param severity The severity, default is {@link DiagnosticSeverity.Error error}.
		 */ new(range: Range, message: string, severity?: DiagnosticSeverity): Diagnostic;
};
/**
	 * A link on a terminal line.
	 */ export type TerminalLink = {
    /**
		 * Creates a new terminal link.
		 * @param startIndex The start index of the link on {@link TerminalLinkContext.line}.
		 * @param length The length of the link on {@link TerminalLinkContext.line}.
		 * @param tooltip The tooltip text when you hover over this link.
		 *
		 * If a tooltip is provided, is will be displayed in a string that includes instructions on
		 * how to trigger the link, such as `{0} (ctrl + click)`. The specific instructions vary
		 * depending on OS, user settings, and localization.
		 */ new(startIndex: number, length: number, tooltip?: string): TerminalLink;
};
/**
	 * A terminal profile defines how a terminal will be launched.
	 */ export type TerminalProfile = {
    /**
		 * Creates a new terminal profile.
		 * @param options The options that the terminal will launch with.
		 */ new(options: TerminalOptions | ExtensionTerminalOptions): TerminalProfile;
};
/**
	 * A file decoration represents metadata that can be rendered with a file.
	 */ export type FileDecoration = {
    /**
		 * Creates a new decoration.
		 *
		 * @param badge A letter that represents the decoration.
		 * @param tooltip The tooltip of the decoration.
		 * @param color The color of the decoration.
		 */ new(badge?: string, tooltip?: string, color?: ThemeColor): FileDecoration;
};
/**
	 * A grouping for tasks. The editor by default supports the
	 * 'Clean', 'Build', 'RebuildAll' and 'Test' group.
	 */ export type TaskGroup = {
    new(id: string, label: string): TaskGroup;
};
/**
	 * The execution of a task happens as an external process
	 * without shell interaction.
	 */ export type ProcessExecution = {
    /**
		 * Creates a process execution.
		 *
		 * @param process The process to start.
		 * @param options Optional options for the started process.
		 */ new(process: string, options?: ProcessExecutionOptions): ProcessExecution;
    /**
		 * Creates a process execution.
		 *
		 * @param process The process to start.
		 * @param args Arguments to be passed to the process.
		 * @param options Optional options for the started process.
		 */ new(process: string, args: string[], options?: ProcessExecutionOptions): ProcessExecution;
};
export type ShellExecution = {
    /**
		 * Creates a shell execution with a full command line.
		 *
		 * @param commandLine The command line to execute.
		 * @param options Optional options for the started the shell.
		 */ new(commandLine: string, options?: ShellExecutionOptions): ShellExecution;
    /**
		 * Creates a shell execution with a command and arguments. For the real execution the editor will
		 * construct a command line from the command and the arguments. This is subject to interpretation
		 * especially when it comes to quoting. If full control over the command line is needed please
		 * use the constructor that creates a `ShellExecution` with the full command line.
		 *
		 * @param command The command to execute.
		 * @param args The command arguments.
		 * @param options Optional options for the started the shell.
		 */ new(command: string | ShellQuotedString, args: (string | ShellQuotedString)[], options?: ShellExecutionOptions): ShellExecution;
};
/**
	 * Class used to execute an extension callback as a task.
	 */ export type CustomExecution = {
    /**
		 * Constructs a CustomExecution task object. The callback will be executed when the task is run, at which point the
		 * extension should return the Pseudoterminal it will "run in". The task should wait to do further execution until
		 * {@link Pseudoterminal.open} is called. Task cancellation should be handled using
		 * {@link Pseudoterminal.close}. When the task is complete fire
		 * {@link Pseudoterminal.onDidClose}.
		 * @param callback The callback that will be called when the task is started by a user. Any ${} style variables that
		 * were in the task definition will be resolved and passed into the callback as `resolvedDefinition`.
		 */ new(callback: (resolvedDefinition: TaskDefinition) => Thenable<Pseudoterminal>): CustomExecution;
};
/**
	 * A task to execute
	 */ export type Task = {
    /**
		 * Creates a new task.
		 *
		 * @param taskDefinition The task definition as defined in the taskDefinitions extension point.
		 * @param scope Specifies the task's scope. It is either a global or a workspace task or a task for a specific workspace folder. Global tasks are currently not supported.
		 * @param name The task's name. Is presented in the user interface.
		 * @param source The task's source (e.g. 'gulp', 'npm', ...). Is presented in the user interface.
		 * @param execution The process or shell execution.
		 * @param problemMatchers the names of problem matchers to use, like '$tsc'
		 *  or '$eslint'. Problem matchers can be contributed by an extension using
		 *  the `problemMatchers` extension point.
		 */ new(taskDefinition: TaskDefinition, scope: WorkspaceFolder | TaskScope.Global | TaskScope.Workspace, name: string, source: string, execution?: ProcessExecution | ShellExecution | CustomExecution, problemMatchers?: string | string[]): Task;
    /**
		 * Creates a new task.
		 *
		 * @deprecated Use the new constructors that allow specifying a scope for the task.
		 *
		 * @param taskDefinition The task definition as defined in the taskDefinitions extension point.
		 * @param name The task's name. Is presented in the user interface.
		 * @param source The task's source (e.g. 'gulp', 'npm', ...). Is presented in the user interface.
		 * @param execution The process or shell execution.
		 * @param problemMatchers the names of problem matchers to use, like '$tsc'
		 *  or '$eslint'. Problem matchers can be contributed by an extension using
		 *  the `problemMatchers` extension point.
		 */ new(taskDefinition: TaskDefinition, name: string, source: string, execution?: ProcessExecution | ShellExecution, problemMatchers?: string | string[]): Task;
};
/**
	 * A type that filesystem providers should use to signal errors.
	 *
	 * This class has factory methods for common error-cases, like `FileNotFound` when
	 * a file or folder doesn't exist, use them like so: `throw vscode.FileSystemError.FileNotFound(someUri);`
	 */ export type FileSystemError = {
    /**
		 * Creates a new filesystem error.
		 *
		 * @param messageOrUri Message or uri.
		 */ new(messageOrUri?: string | Uri): FileSystemError;
};
/**
	 * Encapsulates data transferred during drag and drop operations.
	 */ export type DataTransferItem = {
    /**
		 * @param value Custom data stored on this item. Can be retrieved using {@linkcode DataTransferItem.value}.
		 */ new(value: any): DataTransferItem;
};
/**
	 * A map containing a mapping of the mime type of the corresponding transferred data.
	 *
	 * Drag and drop controllers that implement {@link TreeDragAndDropController.handleDrag `handleDrag`} can add additional mime types to the
	 * data transfer. These additional mime types will only be included in the `handleDrop` when the the drag was initiated from
	 * an element in the same drag and drop controller.
	 */ export type DataTransfer = {
};
export type TreeItem = {
    /**
		 * @param label A human-readable string describing this item
		 * @param collapsibleState {@link TreeItemCollapsibleState} of the tree item. Default is {@link TreeItemCollapsibleState.None}
		 */ new(label: string | TreeItemLabel, collapsibleState?: TreeItemCollapsibleState): TreeItem;
    /**
		 * @param resourceUri The {@link Uri} of the resource representing this item.
		 * @param collapsibleState {@link TreeItemCollapsibleState} of the tree item. Default is {@link TreeItemCollapsibleState.None}
		 */ new(resourceUri: Uri, collapsibleState?: TreeItemCollapsibleState): TreeItem;
};
/**
	 * Predefined buttons for {@link QuickPick} and {@link InputBox}.
	 */ export type QuickInputButtons = {
    /**
		 * @hidden
		 */ new(): QuickInputButtons;
};
/**
	 * A notebook range represents an ordered pair of two cell indices.
	 * It is guaranteed that start is less than or equal to end.
	 */ export type NotebookRange = {
    /**
		 * Create a new notebook range. If `start` is not
		 * before or equal to `end`, the values will be swapped.
		 *
		 * @param start start index
		 * @param end end index.
		 */ new(start: number, end: number): NotebookRange;
};
/**
	 * One representation of a {@link NotebookCellOutput notebook output}, defined by MIME type and data.
	 */ export type NotebookCellOutputItem = {
    /**
		 * Create a new notebook cell output item.
		 *
		 * @param data The value of the output item.
		 * @param mime The mime type of the output item.
		 */ new(data: Uint8Array, mime: string): NotebookCellOutputItem;
};
/**
	 * Notebook cell output represents a result of executing a cell. It is a container type for multiple
	 * {@link NotebookCellOutputItem output items} where contained items represent the same result but
	 * use different MIME types.
	 */ export type NotebookCellOutput = {
    /**
		 * Create new notebook output.
		 *
		 * @param items Notebook output items.
		 * @param metadata Optional metadata.
		 */ new(items: NotebookCellOutputItem[], metadata?: {
        [key: string]: any;
    }): NotebookCellOutput;
};
/**
	 * NotebookCellData is the raw representation of notebook cells. Its is part of {@linkcode NotebookData}.
	 */ export type NotebookCellData = {
    /**
		 * Create new cell data. Minimal cell data specifies its kind, its source value, and the
		 * language identifier of its source.
		 *
		 * @param kind The kind.
		 * @param value The source value.
		 * @param languageId The language identifier of the source value.
		 */ new(kind: NotebookCellKind, value: string, languageId: string): NotebookCellData;
};
/**
	 * Raw representation of a notebook.
	 *
	 * Extensions are responsible for creating {@linkcode NotebookData} so that the editor
	 * can create a {@linkcode NotebookDocument}.
	 *
	 * @see {@link NotebookSerializer}
	 */ export type NotebookData = {
    /**
		 * Create new notebook data.
		 *
		 * @param cells An array of cell data.
		 */ new(cells: NotebookCellData[]): NotebookData;
};
/**
	 * A contribution to a cell's status bar
	 */ export type NotebookCellStatusBarItem = {
    /**
		 * Creates a new NotebookCellStatusBarItem.
		 * @param text The text to show for the item.
		 * @param alignment Whether the item is aligned to the left or right.
		 */ new(text: string, alignment: NotebookCellStatusBarAlignment): NotebookCellStatusBarItem;
};
/**
	 * Represents a debug adapter executable and optional arguments and runtime options passed to it.
	 */ export type DebugAdapterExecutable = {
    /**
		 * Creates a description for a debug adapter based on an executable program.
		 *
		 * @param command The command or executable path that implements the debug adapter.
		 * @param args Optional arguments to be passed to the command or executable.
		 * @param options Optional options to be used when starting the command or executable.
		 */ new(command: string, args?: string[], options?: DebugAdapterExecutableOptions): DebugAdapterExecutable;
};
/**
	 * Represents a debug adapter running as a socket based server.
	 */ export type DebugAdapterServer = {
    /**
		 * Create a description for a debug adapter running as a socket based server.
		 */ new(port: number, host?: string): DebugAdapterServer;
};
/**
	 * Represents a debug adapter running as a Named Pipe (on Windows)/UNIX Domain Socket (on non-Windows) based server.
	 */ export type DebugAdapterNamedPipeServer = {
    /**
		 * Create a description for a debug adapter running as a Named Pipe (on Windows)/UNIX Domain Socket (on non-Windows) based server.
		 */ new(path: string): DebugAdapterNamedPipeServer;
};
/**
	 * A debug adapter descriptor for an inline implementation.
	 */ export type DebugAdapterInlineImplementation = {
    /**
		 * Create a descriptor for an inline implementation of a debug adapter.
		 */ new(implementation: DebugAdapter): DebugAdapterInlineImplementation;
};
/**
	 * The base class of all breakpoint types.
	 */ export type Breakpoint = {
    new(enabled?: boolean, condition?: string, hitCondition?: string, logMessage?: string): Breakpoint;
};
/**
	 * A breakpoint specified by a source location.
	 */ export type SourceBreakpoint = {
    /**
		 * Create a new breakpoint for a source location.
		 */ new(location: Location, enabled?: boolean, condition?: string, hitCondition?: string, logMessage?: string): SourceBreakpoint;
};
/**
	 * A breakpoint specified by a function name.
	 */ export type FunctionBreakpoint = {
    /**
		 * Create a new function breakpoint.
		 */ new(functionName: string, enabled?: boolean, condition?: string, hitCondition?: string, logMessage?: string): FunctionBreakpoint;
};
/**
	 * Tags can be associated with {@link TestItem TestItems} and
	 * {@link TestRunProfile TestRunProfiles}. A profile with a tag can only
	 * execute tests that include that tag in their {@link TestItem.tags} array.
	 */ export type TestTag = {
    /**
		 * Creates a new TestTag instance.
		 * @param id ID of the test tag.
		 */ new(id: string): TestTag;
};
/**
	 * A TestRunRequest is a precursor to a {@link TestRun}, which in turn is
	 * created by passing a request to {@link TestController.createTestRun}. The
	 * TestRunRequest contains information about which tests should be run, which
	 * should not be run, and how they are run (via the {@link TestRunRequest.profile profile}).
	 *
	 * In general, TestRunRequests are created by the editor and pass to
	 * {@link TestRunProfile.runHandler}, however you can also create test
	 * requests and runs outside of the `runHandler`.
	 */ export type TestRunRequest = {
    /**
		 * @param include Array of specific tests to run, or undefined to run all tests
		 * @param exclude An array of tests to exclude from the run.
		 * @param profile The run profile used for this request.
		 */ new(include?: readonly TestItem[], exclude?: readonly TestItem[], profile?: TestRunProfile): TestRunRequest;
};
/**
	 * Message associated with the test state. Can be linked to a specific
	 * source range -- useful for assertion failures, for example.
	 */ export type TestMessage = {
    /**
		 * Creates a new TestMessage instance.
		 * @param message The message to show to the user.
		 */ new(message: string | MarkdownString): TestMessage;
};
/**
	 * The tab represents a single text based resource.
	 */ export type TabInputText = {
    /**
		 * Constructs a text tab input with the given URI.
		 * @param uri The URI of the tab.
		 */ new(uri: Uri): TabInputText;
};
/**
	 * The tab represents two text based resources
	 * being rendered as a diff.
	 */ export type TabInputTextDiff = {
    /**
		 * Constructs a new text diff tab input with the given URIs.
		 * @param original The uri of the original text resource.
		 * @param modified The uri of the modified text resource.
		 */ new(original: Uri, modified: Uri): TabInputTextDiff;
};
/**
	 * The tab represents a custom editor.
	 */ export type TabInputCustom = {
    /**
		 * Constructs a custom editor tab input.
		 * @param uri The uri of the tab.
		 * @param viewType The viewtype of the custom editor.
		 */ new(uri: Uri, viewType: string): TabInputCustom;
};
/**
	 * The tab represents a webview.
	 */ export type TabInputWebview = {
    /**
		 * Constructs a webview tab input with the given view type.
		 * @param viewType The type of webview. Maps to {@linkcode WebviewPanel.viewType WebviewPanel's viewType}
		 */ new(viewType: string): TabInputWebview;
};
/**
	 * The tab represents a notebook.
	 */ export type TabInputNotebook = {
    /**
		 * Constructs a new tab input for a notebook.
		 * @param uri The uri of the notebook.
		 * @param notebookType The type of notebook. Maps to {@linkcode NotebookDocument.notebookType NotebookDocuments's notebookType}
		 */ new(uri: Uri, notebookType: string): TabInputNotebook;
};
/**
	 * The tabs represents two notebooks in a diff configuration.
	 */ export type TabInputNotebookDiff = {
    /**
		 * Constructs a notebook diff tab input.
		 * @param original The uri of the original unmodified notebook.
		 * @param modified The uri of the modified notebook.
		 * @param notebookType The type of notebook. Maps to {@linkcode NotebookDocument.notebookType NotebookDocuments's notebookType}
		 */ new(original: Uri, modified: Uri, notebookType: string): TabInputNotebookDiff;
};
/**
	 * The tab represents a terminal in the editor area.
	 */ export type TabInputTerminal = {
    /**
		 * Constructs a terminal tab input.
		 */ new(): TabInputTerminal;
};
/**
	 * A special value wrapper denoting a value that is safe to not clean.
	 * This is to be used when you can guarantee no identifiable information is contained in the value and the cleaning is improperly redacting it.
	 */ export type TelemetryTrustedValue = {
    new(value: T): TelemetryTrustedValue;
};
