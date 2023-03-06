/**
	 * Represents a line and character position, such as
	 * the position of the cursor.
	 *
	 * Position objects are __immutable__. Use the {@link Position.with with} or
	 * {@link Position.translate translate} methods to derive new positions
	 * from an existing position.
	 */ export type Position = {
    /**
		 * The zero-based line value.
		 */ readonly line: number;
    /**
		 * The zero-based character value.
		 */ readonly character: number;
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
		 * The start position. It is before or equal to {@link Range.end end}.
		 */ readonly start: Position;
    /**
		 * The end position. It is after or equal to {@link Range.start start}.
		 */ readonly end: Position;
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
    /**
		 * `true` if `start` and `end` are equal.
		 */ isEmpty: boolean;
    /**
		 * `true` if `start.line` and `end.line` are equal.
		 */ isSingleLine: boolean;
};
/**
	 * Represents a text selection in an editor.
	 */ export type Selection = Range & {
    /**
		 * The position at which the selection starts.
		 * This position might be before or after {@link Selection.active active}.
		 */ anchor: Position;
    /**
		 * The position of the cursor.
		 * This position might be before or after {@link Selection.anchor anchor}.
		 */ active: Position;
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
    /**
		 * A selection is reversed if its {@link Selection.anchor anchor} is the {@link Selection.end end} position.
		 */ isReversed: boolean;
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
		 * The id of the icon. The available icons are listed in https://code.visualstudio.com/api/references/icons-in-labels#icon-listing.
		 */ readonly id: string;
    /**
		 * The optional ThemeColor of the icon. The color is currently only used in {@link TreeItem}.
		 */ readonly color??: ThemeColor | undefined;
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
    /**
		 * Scheme is the `http` part of `http://www.example.com/some/path?query#fragment`.
		 * The part before the first colon.
		 */ readonly scheme: string;
    /**
		 * Authority is the `www.example.com` part of `http://www.example.com/some/path?query#fragment`.
		 * The part between the first double slashes and the next slash.
		 */ readonly authority: string;
    /**
		 * Path is the `/some/path` part of `http://www.example.com/some/path?query#fragment`.
		 */ readonly path: string;
    /**
		 * Query is the `query` part of `http://www.example.com/some/path?query#fragment`.
		 */ readonly query: string;
    /**
		 * Fragment is the `fragment` part of `http://www.example.com/some/path?query#fragment`.
		 */ readonly fragment: string;
    /**
		 * The string representing the corresponding file system path of this Uri.
		 *
		 * Will handle UNC paths and normalize windows drive letters to lower-case. Also
		 * uses the platform specific path separator.
		 *
		 * * Will *not* validate the path for invalid characters and semantics.
		 * * Will *not* look at the scheme of this Uri.
		 * * The resulting string shall *not* be used for display purposes but
		 * for disk operations, like `readFile` et al.
		 *
		 * The *difference* to the {@linkcode Uri.path path}-property is the use of the platform specific
		 * path separator and the handling of UNC paths. The sample below outlines the difference:
		 * ```ts
		 * const u = URI.parse('file://server/c$/folder/file.txt')
		 * u.authority === 'server'
		 * u.path === '/shares/c$/file.txt'
		 * u.fsPath === '\\server\c$\folder\file.txt'
		 * ```
		 */ readonly fsPath: string;
};
/**
	 * A cancellation source creates and controls a {@link CancellationToken cancellation token}.
	 */ export type CancellationTokenSource = {
    /**
		 * The cancellation token of this source.
		 */ token: CancellationToken;
};
/**
	 * An error type that should be used to signal cancellation of an operation.
	 *
	 * This type can be used in response to a {@link CancellationToken cancellation token}
	 * being cancelled or when an operation is being cancelled by the
	 * executor of that operation.
	 */ export type CancellationError = Error & {
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
    /**
		 * The event listeners can subscribe to.
		 */ event: Event<T>;
};
/**
	 * A relative pattern is a helper to construct glob patterns that are matched
	 * relatively to a base file path. The base path can either be an absolute file
	 * path as string or uri or a {@link WorkspaceFolder workspace folder}, which is the
	 * preferred way of creating the relative pattern.
	 */ export type RelativePattern = {
    /**
		 * A base file path to which this pattern will be matched against relatively. The
		 * file path must be absolute, should not have any trailing path separators and
		 * not include any relative segments (`.` or `..`).
		 */ baseUri: Uri;
    /**
		 * A base file path to which this pattern will be matched against relatively.
		 *
		 * This matches the `fsPath` value of {@link RelativePattern.baseUri}.
		 *
		 * *Note:* updating this value will update {@link RelativePattern.baseUri} to
		 * be a uri with `file` scheme.
		 *
		 * @deprecated This property is deprecated, please use {@link RelativePattern.baseUri} instead.
		 */ base: string;
    /**
		 * A file glob pattern like `*.{ts,js}` that will be matched on file paths
		 * relative to the base path.
		 *
		 * Example: Given a base of `/home/work/folder` and a file path of `/home/work/folder/index.js`,
		 * the file glob pattern will match on `index.js`.
		 */ pattern: string;
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
    /**
		 * String value of the kind, e.g. `"refactor.extract.function"`.
		 */ readonly value: string;
};
/**
	 * A code action represents a change that can be performed in code, e.g. to fix a problem or
	 * to refactor code.
	 *
	 * A CodeAction must set either {@linkcode CodeAction.edit edit} and/or a {@linkcode CodeAction.command command}. If both are supplied, the `edit` is applied first, then the command is executed.
	 */ export type CodeAction = {
    /**
		 * A short, human-readable, title for this code action.
		 */ title: string;
    /**
		 * A {@link WorkspaceEdit workspace edit} this code action performs.
		 */ edit??: WorkspaceEdit;
    /**
		 * {@link Diagnostic Diagnostics} that this code action resolves.
		 */ diagnostics??: Diagnostic[];
    /**
		 * A {@link Command} this code action executes.
		 *
		 * If this command throws an exception, the editor displays the exception message to users in the editor at the
		 * current cursor position.
		 */ command??: Command;
    /**
		 * {@link CodeActionKind Kind} of the code action.
		 *
		 * Used to filter code actions.
		 */ kind??: CodeActionKind;
    /**
		 * Marks this as a preferred action. Preferred actions are used by the `auto fix` command and can be targeted
		 * by keybindings.
		 *
		 * A quick fix should be marked preferred if it properly addresses the underlying error.
		 * A refactoring should be marked preferred if it is the most reasonable choice of actions to take.
		 */ isPreferred??: boolean;
    /**
		 * Marks that the code action cannot currently be applied.
		 *
		 * - Disabled code actions are not shown in automatic [lightbulb](https://code.visualstudio.com/docs/editor/editingevolved#_code-action)
		 * code action menu.
		 *
		 * - Disabled actions are shown as faded out in the code action menu when the user request a more specific type
		 * of code action, such as refactorings.
		 *
		 * - If the user has a [keybinding](https://code.visualstudio.com/docs/editor/refactoring#_keybindings-for-code-actions)
		 * that auto applies a code action and only a disabled code actions are returned, the editor will show the user an
		 * error message with `reason` in the editor.
		 */ disabled??: {
        /**
			 * Human readable description of why the code action is currently disabled.
			 *
			 * This is displayed in the code actions UI.
			 */ readonly reason: string;
    };
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
		 * The range in which this code lens is valid. Should only span a single line.
		 */ range: Range;
    /**
		 * The command this code lens represents.
		 */ command??: Command;
    /**
		 * `true` when there is a command associated.
		 */ readonly isResolved: boolean;
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
		 * The markdown string.
		 */ value: string;
    /**
		 * Indicates that this markdown string is from a trusted source. Only *trusted*
		 * markdown supports links that execute commands, e.g. `[Run it](command:myCommandId)`.
		 *
		 * Defaults to `false` (commands are disabled).
		 *
		 * If this is an object, only the set of commands listed in `enabledCommands` are allowed.
		 */ isTrusted??: boolean | {
        readonly enabledCommands: readonly string[];
    };
    /**
		 * Indicates that this markdown string can contain {@link ThemeIcon ThemeIcons}, e.g. `$(zap)`.
		 */ supportThemeIcons??: boolean;
    /**
		 * Indicates that this markdown string can contain raw html tags. Defaults to `false`.
		 *
		 * When `supportHtml` is false, the markdown renderer will strip out any raw html tags
		 * that appear in the markdown text. This means you can only use markdown syntax for rendering.
		 *
		 * When `supportHtml` is true, the markdown render will also allow a safe subset of html tags
		 * and attributes to be rendered. See https://github.com/microsoft/vscode/blob/6d2920473c6f13759c978dd89104c4270a83422d/src/vs/base/browser/markdownRenderer.ts#L296
		 * for a list of all supported tags and attributes.
		 */ supportHtml??: boolean;
    /**
		 * Uri that relative paths are resolved relative to.
		 *
		 * If the `baseUri` ends with `/`, it is considered a directory and relative paths in the markdown are resolved relative to that directory:
		 *
		 * ```ts
		 * const md = new vscode.MarkdownString(`[link](./file.js)`);
		 * md.baseUri = vscode.Uri.file('/path/to/dir/');
		 * // Here 'link' in the rendered markdown resolves to '/path/to/dir/file.js'
		 * ```
		 *
		 * If the `baseUri` is a file, relative paths in the markdown are resolved relative to the parent dir of that file:
		 *
		 * ```ts
		 * const md = new vscode.MarkdownString(`[link](./file.js)`);
		 * md.baseUri = vscode.Uri.file('/path/to/otherFile.js');
		 * // Here 'link' in the rendered markdown resolves to '/path/to/file.js'
		 * ```
		 */ baseUri??: Uri;
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
		 * The contents of this hover.
		 */ contents: Array<MarkdownString | MarkedString>;
    /**
		 * The range to which this hover applies. When missing, the
		 * editor will use the range at the current position or the
		 * current position itself.
		 */ range??: Range;
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
    /*
		 * The range is used to extract the evaluatable expression from the underlying document and to highlight it.
		 */ readonly range: Range;
    /*
		 * If specified the expression overrides the extracted expression.
		 */ readonly expression??: string | undefined;
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
		 * The document range for which the inline value applies.
		 */ readonly range: Range;
    /**
		 * The text of the inline value.
		 */ readonly text: string;
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
		 * The document range for which the inline value applies.
		 * The range is used to extract the variable name from the underlying document.
		 */ readonly range: Range;
    /**
		 * If specified the name of the variable to look up.
		 */ readonly variableName??: string | undefined;
    /**
		 * How to perform the lookup.
		 */ readonly caseSensitiveLookup: boolean;
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
		 * The document range for which the inline value applies.
		 * The range is used to extract the evaluatable expression from the underlying document.
		 */ readonly range: Range;
    /**
		 * If specified the expression overrides the extracted expression.
		 */ readonly expression??: string | undefined;
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
		 * The range this highlight applies to.
		 */ range: Range;
    /**
		 * The highlight kind, default is {@link DocumentHighlightKind.Text text}.
		 */ kind??: DocumentHighlightKind;
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
		 * The name of this symbol.
		 */ name: string;
    /**
		 * The name of the symbol containing this symbol.
		 */ containerName: string;
    /**
		 * The kind of this symbol.
		 */ kind: SymbolKind;
    /**
		 * Tags for this symbol.
		 */ tags??: readonly SymbolTag[];
    /**
		 * The location of this symbol.
		 */ location: Location;
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
		 * The name of this symbol.
		 */ name: string;
    /**
		 * More detail for this symbol, e.g. the signature of a function.
		 */ detail: string;
    /**
		 * The kind of this symbol.
		 */ kind: SymbolKind;
    /**
		 * Tags for this symbol.
		 */ tags??: readonly SymbolTag[];
    /**
		 * The range enclosing this symbol not including leading/trailing whitespace but everything else, e.g. comments and code.
		 */ range: Range;
    /**
		 * The range that should be selected and reveal when this symbol is being picked, e.g. the name of a function.
		 * Must be contained by the {@linkcode DocumentSymbol.range range}.
		 */ selectionRange: Range;
    /**
		 * Children of this symbol, e.g. properties of a class.
		 */ children: DocumentSymbol[];
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
		 * The range this edit applies to.
		 */ range: Range;
    /**
		 * The string this edit will insert.
		 */ newText: string;
    /**
		 * The eol-sequence used in the document.
		 *
		 * *Note* that the eol-sequence will be applied to the
		 * whole document.
		 */ newEol??: EndOfLine;
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
		 * The range this edit applies to.
		 */ range: Range;
    /**
		 * The {@link SnippetString snippet} this edit will perform.
		 */ snippet: SnippetString;
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
    /**
		 * Range of the cells being edited. May be empty.
		 */ range: NotebookRange;
    /**
		 * New cells being inserted. May be empty.
		 */ newCells: NotebookCellData[];
    /**
		 * Optional new metadata for the cells.
		 */ newCellMetadata??: {
        [key: string]: any;
    };
    /**
		 * Optional new metadata for the notebook.
		 */ newNotebookMetadata??: {
        [key: string]: any;
    };
    new(range: NotebookRange, newCells: NotebookCellData[]): NotebookEdit;
};
/**
	 * A workspace edit is a collection of textual and files changes for
	 * multiple resources and documents.
	 *
	 * Use the {@link workspace.applyEdit applyEdit}-function to apply a workspace edit.
	 */ export type WorkspaceEdit = {
    /**
		 * The number of affected resources of textual or resource changes.
		 */ readonly size: number;
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
    /**
		 * The snippet string.
		 */ value: string;
    new(value?: string): SnippetString;
};
/**
	 * A semantic tokens legend contains the needed information to decipher
	 * the integer encoded representation of semantic tokens.
	 */ export type SemanticTokensLegend = {
    /**
		 * The possible token types.
		 */ readonly tokenTypes: string[];
    /**
		 * The possible token modifiers.
		 */ readonly tokenModifiers: string[];
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
    /**
		 * The result id of the tokens.
		 *
		 * This is the id that will be passed to `DocumentSemanticTokensProvider.provideDocumentSemanticTokensEdits` (if implemented).
		 */ readonly resultId: string | undefined;
    /**
		 * The actual tokens data.
		 * @see {@link DocumentSemanticTokensProvider.provideDocumentSemanticTokens provideDocumentSemanticTokens} for an explanation of the format.
		 */ readonly data: Uint32Array;
    new(data: Uint32Array, resultId?: string): SemanticTokens;
};
/**
	 * Represents edits to semantic tokens.
	 * @see {@link DocumentSemanticTokensProvider.provideDocumentSemanticTokensEdits provideDocumentSemanticTokensEdits} for an explanation of the format.
	 */ export type SemanticTokensEdits = {
    /**
		 * The result id of the tokens.
		 *
		 * This is the id that will be passed to `DocumentSemanticTokensProvider.provideDocumentSemanticTokensEdits` (if implemented).
		 */ readonly resultId: string | undefined;
    /**
		 * The edits to the tokens data.
		 * All edits refer to the initial data state.
		 */ readonly edits: SemanticTokensEdit[];
    new(edits: SemanticTokensEdit[], resultId?: string): SemanticTokensEdits;
};
/**
	 * Represents an edit to semantic tokens.
	 * @see {@link DocumentSemanticTokensProvider.provideDocumentSemanticTokensEdits provideDocumentSemanticTokensEdits} for an explanation of the format.
	 */ export type SemanticTokensEdit = {
    /**
		 * The start offset of the edit.
		 */ readonly start: number;
    /**
		 * The count of elements to remove.
		 */ readonly deleteCount: number;
    /**
		 * The elements to insert.
		 */ readonly data: Uint32Array | undefined;
    new(start: number, deleteCount: number, data?: Uint32Array): SemanticTokensEdit;
};
/**
	 * Represents a parameter of a callable-signature. A parameter can
	 * have a label and a doc-comment.
	 */ export type ParameterInformation = {
    /**
		 * The label of this signature.
		 *
		 * Either a string or inclusive start and exclusive end offsets within its containing
		 * {@link SignatureInformation.label signature label}. *Note*: A label of type string must be
		 * a substring of its containing signature information's {@link SignatureInformation.label label}.
		 */ label: string | [number, number];
    /**
		 * The human-readable doc-comment of this signature. Will be shown
		 * in the UI but can be omitted.
		 */ documentation??: string | MarkdownString;
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
		 * The label of this signature. Will be shown in
		 * the UI.
		 */ label: string;
    /**
		 * The human-readable doc-comment of this signature. Will be shown
		 * in the UI but can be omitted.
		 */ documentation??: string | MarkdownString;
    /**
		 * The parameters of this signature.
		 */ parameters: ParameterInformation[];
    /**
		 * The index of the active parameter.
		 *
		 * If provided, this is used in place of {@linkcode SignatureHelp.activeParameter}.
		 */ activeParameter??: number;
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
    /**
		 * One or more signatures.
		 */ signatures: SignatureInformation[];
    /**
		 * The active signature.
		 */ activeSignature: number;
    /**
		 * The active parameter of the active signature.
		 */ activeParameter: number;
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
		 * The label of this completion item. By default
		 * this is also the text that is inserted when selecting
		 * this completion.
		 */ label: string | CompletionItemLabel;
    /**
		 * The kind of this completion item. Based on the kind
		 * an icon is chosen by the editor.
		 */ kind??: CompletionItemKind;
    /**
		 * Tags for this completion item.
		 */ tags??: readonly CompletionItemTag[];
    /**
		 * A human-readable string with additional information
		 * about this item, like type or symbol information.
		 */ detail??: string;
    /**
		 * A human-readable string that represents a doc-comment.
		 */ documentation??: string | MarkdownString;
    /**
		 * A string that should be used when comparing this item
		 * with other items. When `falsy` the {@link CompletionItem.label label}
		 * is used.
		 *
		 * Note that `sortText` is only used for the initial ordering of completion
		 * items. When having a leading word (prefix) ordering is based on how
		 * well completions match that prefix and the initial ordering is only used
		 * when completions match equally well. The prefix is defined by the
		 * {@linkcode CompletionItem.range range}-property and can therefore be different
		 * for each completion.
		 */ sortText??: string;
    /**
		 * A string that should be used when filtering a set of
		 * completion items. When `falsy` the {@link CompletionItem.label label}
		 * is used.
		 *
		 * Note that the filter text is matched against the leading word (prefix) which is defined
		 * by the {@linkcode CompletionItem.range range}-property.
		 */ filterText??: string;
    /**
		 * Select this item when showing. *Note* that only one completion item can be selected and
		 * that the editor decides which item that is. The rule is that the *first* item of those
		 * that match best is selected.
		 */ preselect??: boolean;
    /**
		 * A string or snippet that should be inserted in a document when selecting
		 * this completion. When `falsy` the {@link CompletionItem.label label}
		 * is used.
		 */ insertText??: string | SnippetString;
    /**
		 * A range or a insert and replace range selecting the text that should be replaced by this completion item.
		 *
		 * When omitted, the range of the {@link TextDocument.getWordRangeAtPosition current word} is used as replace-range
		 * and as insert-range the start of the {@link TextDocument.getWordRangeAtPosition current word} to the
		 * current position is used.
		 *
		 * *Note 1:* A range must be a {@link Range.isSingleLine single line} and it must
		 * {@link Range.contains contain} the position at which completion has been {@link CompletionItemProvider.provideCompletionItems requested}.
		 * *Note 2:* A insert range must be a prefix of a replace range, that means it must be contained and starting at the same position.
		 */ range??: Range | {
        inserting: Range;
        replacing: Range;
    };
    /**
		 * An optional set of characters that when pressed while this completion is active will accept it first and
		 * then type that character. *Note* that all commit characters should have `length=1` and that superfluous
		 * characters will be ignored.
		 */ commitCharacters??: string[];
    /**
		 * Keep whitespace of the {@link CompletionItem.insertText insertText} as is. By default, the editor adjusts leading
		 * whitespace of new lines so that they match the indentation of the line for which the item is accepted - setting
		 * this to `true` will prevent that.
		 */ keepWhitespace??: boolean;
    /**
		 * @deprecated Use `CompletionItem.insertText` and `CompletionItem.range` instead.
		 *
		 * An {@link TextEdit edit} which is applied to a document when selecting
		 * this completion. When an edit is provided the value of
		 * {@link CompletionItem.insertText insertText} is ignored.
		 *
		 * The {@link Range} of the edit must be single-line and on the same
		 * line completions were {@link CompletionItemProvider.provideCompletionItems requested} at.
		 */ textEdit??: TextEdit;
    /**
		 * An optional array of additional {@link TextEdit text edits} that are applied when
		 * selecting this completion. Edits must not overlap with the main {@link CompletionItem.textEdit edit}
		 * nor with themselves.
		 */ additionalTextEdits??: TextEdit[];
    /**
		 * An optional {@link Command} that is executed *after* inserting this completion. *Note* that
		 * additional modifications to the current document should be described with the
		 * {@link CompletionItem.additionalTextEdits additionalTextEdits}-property.
		 */ command??: Command;
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
		 * This list is not complete. Further typing should result in recomputing
		 * this list.
		 */ isIncomplete??: boolean;
    /**
		 * The completion items.
		 */ items: T[];
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
		 * The inline completion items.
		 */ items: InlineCompletionItem[];
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
		 * The text to replace the range with. Must be set.
		 * Is used both for the preview and the accept operation.
		 */ insertText: string | SnippetString;
    /**
		 * A text that is used to decide if this inline completion should be shown. When `falsy`
		 * the {@link InlineCompletionItem.insertText} is used.
		 *
		 * An inline completion is shown if the text to replace is a prefix of the filter text.
		 */ filterText??: string;
    /**
		 * The range to replace.
		 * Must begin and end on the same line.
		 *
		 * Prefer replacements over insertions to provide a better experience when the user deletes typed text.
		 */ range??: Range;
    /**
		 * An optional {@link Command} that is executed *after* inserting this completion.
		 */ command??: Command;
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
		 * The range this link applies to.
		 */ range: Range;
    /**
		 * The uri this link points to.
		 */ target??: Uri;
    /**
		 * The tooltip text when you hover over this link.
		 *
		 * If a tooltip is provided, is will be displayed in a string that includes instructions on how to
		 * trigger the link, such as `{0} (ctrl + click)`. The specific instructions vary depending on OS,
		 * user settings, and localization.
		 */ tooltip??: string;
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
		 * The red component of this color in the range [0-1].
		 */ readonly red: number;
    /**
		 * The green component of this color in the range [0-1].
		 */ readonly green: number;
    /**
		 * The blue component of this color in the range [0-1].
		 */ readonly blue: number;
    /**
		 * The alpha component of this color in the range [0-1].
		 */ readonly alpha: number;
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
		 * The range in the document where this color appears.
		 */ range: Range;
    /**
		 * The actual color value for this color range.
		 */ color: Color;
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
		 * The label of this color presentation. It will be shown on the color
		 * picker header. By default this is also the text that is inserted when selecting
		 * this color presentation.
		 */ label: string;
    /**
		 * An {@link TextEdit edit} which is applied to a document when selecting
		 * this presentation for the color.  When `falsy` the {@link ColorPresentation.label label}
		 * is used.
		 */ textEdit??: TextEdit;
    /**
		 * An optional array of additional {@link TextEdit text edits} that are applied when
		 * selecting this color presentation. Edits must not overlap with the main {@link ColorPresentation.textEdit edit} nor with themselves.
		 */ additionalTextEdits??: TextEdit[];
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
		 * The value of this label part.
		 */ value: string;
    /**
		 * The tooltip text when you hover over this label part.
		 *
		 * *Note* that this property can be set late during
		 * {@link InlayHintsProvider.resolveInlayHint resolving} of inlay hints.
		 */ tooltip??: string | MarkdownString | undefined;
    /**
		 * An optional {@link Location source code location} that represents this label
		 * part.
		 *
		 * The editor will use this location for the hover and for code navigation features: This
		 * part will become a clickable link that resolves to the definition of the symbol at the
		 * given location (not necessarily the location itself), it shows the hover that shows at
		 * the given location, and it shows a context menu with further code navigation commands.
		 *
		 * *Note* that this property can be set late during
		 * {@link InlayHintsProvider.resolveInlayHint resolving} of inlay hints.
		 */ location??: Location | undefined;
    /**
		 * An optional command for this label part.
		 *
		 * The editor renders parts with commands as clickable links. The command is added to the context menu
		 * when a label part defines {@link InlayHintLabelPart.location location} and {@link InlayHintLabelPart.command command} .
		 *
		 * *Note* that this property can be set late during
		 * {@link InlayHintsProvider.resolveInlayHint resolving} of inlay hints.
		 */ command??: Command | undefined;
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
		 * The position of this hint.
		 */ position: Position;
    /**
		 * The label of this hint. A human readable string or an array of {@link InlayHintLabelPart label parts}.
		 *
		 * *Note* that neither the string nor the label part can be empty.
		 */ label: string | InlayHintLabelPart[];
    /**
		 * The tooltip text when you hover over this item.
		 *
		 * *Note* that this property can be set late during
		 * {@link InlayHintsProvider.resolveInlayHint resolving} of inlay hints.
		 */ tooltip??: string | MarkdownString | undefined;
    /**
		 * The kind of this hint. The inlay hint kind defines the appearance of this inlay hint.
		 */ kind??: InlayHintKind;
    /**
		 * Optional {@link TextEdit text edits} that are performed when accepting this inlay hint. The default
		 * gesture for accepting an inlay hint is the double click.
		 *
		 * *Note* that edits are expected to change the document so that the inlay hint (or its nearest variant) is
		 * now part of the document and the inlay hint itself is now obsolete.
		 *
		 * *Note* that this property can be set late during
		 * {@link InlayHintsProvider.resolveInlayHint resolving} of inlay hints.
		 */ textEdits??: TextEdit[];
    /**
		 * Render padding before the hint. Padding will use the editor's background color,
		 * not the background color of the hint itself. That means padding can be used to visually
		 * align/separate an inlay hint.
		 */ paddingLeft??: boolean;
    /**
		 * Render padding after the hint. Padding will use the editor's background color,
		 * not the background color of the hint itself. That means padding can be used to visually
		 * align/separate an inlay hint.
		 */ paddingRight??: boolean;
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
		 * The zero-based start line of the range to fold. The folded area starts after the line's last character.
		 * To be valid, the end must be zero or larger and smaller than the number of lines in the document.
		 */ start: number;
    /**
		 * The zero-based end line of the range to fold. The folded area ends with the line's last character.
		 * To be valid, the end must be zero or larger and smaller than the number of lines in the document.
		 */ end: number;
    /**
		 * Describes the {@link FoldingRangeKind Kind} of the folding range such as {@link FoldingRangeKind.Comment Comment} or
		 * {@link FoldingRangeKind.Region Region}. The kind is used to categorize folding ranges and used by commands
		 * like 'Fold all comments'. See
		 * {@link FoldingRangeKind} for an enumeration of all kinds.
		 * If not set, the range is originated from a syntax element.
		 */ kind??: FoldingRangeKind;
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
		 * The {@link Range} of this selection range.
		 */ range: Range;
    /**
		 * The parent selection range containing this range.
		 */ parent??: SelectionRange;
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
		 * The name of this item.
		 */ name: string;
    /**
		 * The kind of this item.
		 */ kind: SymbolKind;
    /**
		 * Tags for this item.
		 */ tags??: readonly SymbolTag[];
    /**
		 * More detail for this item, e.g. the signature of a function.
		 */ detail??: string;
    /**
		 * The resource identifier of this item.
		 */ uri: Uri;
    /**
		 * The range enclosing this symbol not including leading/trailing whitespace but everything else, e.g. comments and code.
		 */ range: Range;
    /**
		 * The range that should be selected and revealed when this symbol is being picked, e.g. the name of a function.
		 * Must be contained by the {@linkcode CallHierarchyItem.range range}.
		 */ selectionRange: Range;
    /**
		 * Creates a new call hierarchy item.
		 */ new(kind: SymbolKind, name: string, detail: string, uri: Uri, range: Range, selectionRange: Range): CallHierarchyItem;
};
/**
	 * Represents an incoming call, e.g. a caller of a method or constructor.
	 */ export type CallHierarchyIncomingCall = {
    /**
		 * The item that makes the call.
		 */ from: CallHierarchyItem;
    /**
		 * The range at which at which the calls appears. This is relative to the caller
		 * denoted by {@linkcode CallHierarchyIncomingCall.from this.from}.
		 */ fromRanges: Range[];
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
		 * The item that is called.
		 */ to: CallHierarchyItem;
    /**
		 * The range at which this item is called. This is the range relative to the caller, e.g the item
		 * passed to {@linkcode CallHierarchyProvider.provideCallHierarchyOutgoingCalls provideCallHierarchyOutgoingCalls}
		 * and not {@linkcode CallHierarchyOutgoingCall.to this.to}.
		 */ fromRanges: Range[];
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
		 * The name of this item.
		 */ name: string;
    /**
		 * The kind of this item.
		 */ kind: SymbolKind;
    /**
		 * Tags for this item.
		 */ tags??: ReadonlyArray<SymbolTag>;
    /**
		 * More detail for this item, e.g. the signature of a function.
		 */ detail??: string;
    /**
		 * The resource identifier of this item.
		 */ uri: Uri;
    /**
		 * The range enclosing this symbol not including leading/trailing whitespace
		 * but everything else, e.g. comments and code.
		 */ range: Range;
    /**
		 * The range that should be selected and revealed when this symbol is being
		 * picked, e.g. the name of a class. Must be contained by the {@link TypeHierarchyItem.range range}-property.
		 */ selectionRange: Range;
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
    /**
		 * A list of ranges that can be edited together. The ranges must have
		 * identical length and text content. The ranges cannot overlap.
		 */ readonly ranges: Range[];
    /**
		 * An optional word pattern that describes valid contents for the given ranges.
		 * If no pattern is provided, the language configuration's word pattern will be used.
		 */ readonly wordPattern: RegExp | undefined;
};
/**
	 * An edit operation applied {@link DocumentDropEditProvider on drop}.
	 */ export type DocumentDropEdit = {
    /**
		 * The text or snippet to insert at the drop location.
		 */ insertText: string | SnippetString;
    /**
		 * An optional additional edit to apply on drop.
		 */ additionalEdit??: WorkspaceEdit;
    /**
		 * @param insertText The text or snippet to insert at the drop location.
		 */ new(insertText: string | SnippetString): DocumentDropEdit;
};
/**
	 * Represents a location inside a resource, such as a line
	 * inside a text file.
	 */ export type Location = {
    /**
		 * The resource identifier of this location.
		 */ uri: Uri;
    /**
		 * The document range of this location.
		 */ range: Range;
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
		 * The location of this related diagnostic information.
		 */ location: Location;
    /**
		 * The message of this related diagnostic information.
		 */ message: string;
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
		 * The range to which this diagnostic applies.
		 */ range: Range;
    /**
		 * The human-readable message.
		 */ message: string;
    /**
		 * The severity, default is {@link DiagnosticSeverity.Error error}.
		 */ severity: DiagnosticSeverity;
    /**
		 * A human-readable string describing the source of this
		 * diagnostic, e.g. 'typescript' or 'super lint'.
		 */ source??: string;
    /**
		 * A code or identifier for this diagnostic.
		 * Should be used for later processing, e.g. when providing {@link CodeActionContext code actions}.
		 */ code??: string | number | {
        /**
			 * A code or identifier for this diagnostic.
			 * Should be used for later processing, e.g. when providing {@link CodeActionContext code actions}.
			 */ value: string | number;
        /**
			 * A target URI to open with more information about the diagnostic error.
			 */ target: Uri;
    };
    /**
		 * An array of related diagnostic information, e.g. when symbol-names within
		 * a scope collide all definitions can be marked via this property.
		 */ relatedInformation??: DiagnosticRelatedInformation[];
    /**
		 * Additional metadata about the diagnostic.
		 */ tags??: DiagnosticTag[];
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
		 * The start index of the link on {@link TerminalLinkContext.line}.
		 */ startIndex: number;
    /**
		 * The length of the link on {@link TerminalLinkContext.line}.
		 */ length: number;
    /**
		 * The tooltip text when you hover over this link.
		 *
		 * If a tooltip is provided, is will be displayed in a string that includes instructions on
		 * how to trigger the link, such as `{0} (ctrl + click)`. The specific instructions vary
		 * depending on OS, user settings, and localization.
		 */ tooltip??: string;
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
		 * The options that the terminal will launch with.
		 */ options: TerminalOptions | ExtensionTerminalOptions;
    /**
		 * Creates a new terminal profile.
		 * @param options The options that the terminal will launch with.
		 */ new(options: TerminalOptions | ExtensionTerminalOptions): TerminalProfile;
};
/**
	 * A file decoration represents metadata that can be rendered with a file.
	 */ export type FileDecoration = {
    /**
		 * A very short string that represents this decoration.
		 */ badge??: string;
    /**
		 * A human-readable tooltip for this decoration.
		 */ tooltip??: string;
    /**
		 * The color of this decoration.
		 */ color??: ThemeColor;
    /**
		 * A flag expressing that this decoration should be
		 * propagated to its parents.
		 */ propagate??: boolean;
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
    /**
		 * Whether the task that is part of this group is the default for the group.
		 * This property cannot be set through API, and is controlled by a user's task configurations.
		 */ readonly isDefault: boolean | undefined;
    /**
		 * The ID of the task group. Is one of TaskGroup.Clean.id, TaskGroup.Build.id, TaskGroup.Rebuild.id, or TaskGroup.Test.id.
		 */ readonly id: string;
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
    /**
		 * The process to be executed.
		 */ process: string;
    /**
		 * The arguments passed to the process. Defaults to an empty array.
		 */ args: string[];
    /**
		 * The process options used when the process is executed.
		 * Defaults to undefined.
		 */ options??: ProcessExecutionOptions;
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
    /**
		 * The shell command line. Is `undefined` if created with a command and arguments.
		 */ commandLine: string | undefined;
    /**
		 * The shell command. Is `undefined` if created with a full command line.
		 */ command: string | ShellQuotedString;
    /**
		 * The shell args. Is `undefined` if created with a full command line.
		 */ args: (string | ShellQuotedString)[];
    /**
		 * The shell options used when the command line is executed in a shell.
		 * Defaults to undefined.
		 */ options??: ShellExecutionOptions;
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
    /**
		 * The task's definition.
		 */ definition: TaskDefinition;
    /**
		 * The task's scope.
		 */ readonly scope: TaskScope.Global | TaskScope.Workspace | WorkspaceFolder | undefined;
    /**
		 * The task's name
		 */ name: string;
    /**
		 * A human-readable string which is rendered less prominently on a separate line in places
		 * where the task's name is displayed. Supports rendering of {@link ThemeIcon theme icons}
		 * via the `$(<name>)`-syntax.
		 */ detail??: string;
    /**
		 * The task's execution engine
		 */ execution??: ProcessExecution | ShellExecution | CustomExecution;
    /**
		 * Whether the task is a background task or not.
		 */ isBackground: boolean;
    /**
		 * A human-readable string describing the source of this shell task, e.g. 'gulp'
		 * or 'npm'. Supports rendering of {@link ThemeIcon theme icons} via the `$(<name>)`-syntax.
		 */ source: string;
    /**
		 * The task group this tasks belongs to. See TaskGroup
		 * for a predefined set of available groups.
		 * Defaults to undefined meaning that the task doesn't
		 * belong to any special group.
		 */ group??: TaskGroup;
    /**
		 * The presentation options. Defaults to an empty literal.
		 */ presentationOptions: TaskPresentationOptions;
    /**
		 * The problem matchers attached to the task. Defaults to an empty
		 * array.
		 */ problemMatchers: string[];
    /**
		 * Run options for the task
		 */ runOptions: RunOptions;
};
/**
	 * A type that filesystem providers should use to signal errors.
	 *
	 * This class has factory methods for common error-cases, like `FileNotFound` when
	 * a file or folder doesn't exist, use them like so: `throw vscode.FileSystemError.FileNotFound(someUri);`
	 */ export type FileSystemError = Error & {
    /**
		 * Creates a new filesystem error.
		 *
		 * @param messageOrUri Message or uri.
		 */ new(messageOrUri?: string | Uri): FileSystemError;
    /**
		 * A code that identifies this error.
		 *
		 * Possible values are names of errors, like {@linkcode FileSystemError.FileNotFound FileNotFound},
		 * or `Unknown` for unspecified errors.
		 */ readonly code: string;
};
/**
	 * Encapsulates data transferred during drag and drop operations.
	 */ export type DataTransferItem = {
    /**
		 * Custom data stored on this item.
		 *
		 * You can use `value` to share data across operations. The original object can be retrieved so long as the extension that
		 * created the `DataTransferItem` runs in the same extension host.
		 */ readonly value: any;
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
		 * A human-readable string describing this item. When `falsy`, it is derived from {@link TreeItem.resourceUri resourceUri}.
		 */ label??: string | TreeItemLabel;
    /**
		 * Optional id for the tree item that has to be unique across tree. The id is used to preserve the selection and expansion state of the tree item.
		 *
		 * If not provided, an id is generated using the tree item's label. **Note** that when labels change, ids will change and that selection and expansion state cannot be kept stable anymore.
		 */ id??: string;
    /**
		 * The icon path or {@link ThemeIcon} for the tree item.
		 * When `falsy`, {@link ThemeIcon.Folder Folder Theme Icon} is assigned, if item is collapsible otherwise {@link ThemeIcon.File File Theme Icon}.
		 * When a file or folder {@link ThemeIcon} is specified, icon is derived from the current file icon theme for the specified theme icon using {@link TreeItem.resourceUri resourceUri} (if provided).
		 */ iconPath??: string | Uri | {
        light: string | Uri;
        dark: string | Uri;
    } | ThemeIcon;
    /**
		 * A human-readable string which is rendered less prominent.
		 * When `true`, it is derived from {@link TreeItem.resourceUri resourceUri} and when `falsy`, it is not shown.
		 */ description??: string | boolean;
    /**
		 * The {@link Uri} of the resource representing this item.
		 *
		 * Will be used to derive the {@link TreeItem.label label}, when it is not provided.
		 * Will be used to derive the icon from current file icon theme, when {@link TreeItem.iconPath iconPath} has {@link ThemeIcon} value.
		 */ resourceUri??: Uri;
    /**
		 * The tooltip text when you hover over this item.
		 */ tooltip??: string | MarkdownString | undefined;
    /**
		 * The {@link Command} that should be executed when the tree item is selected.
		 *
		 * Please use `vscode.open` or `vscode.diff` as command IDs when the tree item is opening
		 * something in the editor. Using these commands ensures that the resulting editor will
		 * appear consistent with how other built-in trees open editors.
		 */ command??: Command;
    /**
		 * {@link TreeItemCollapsibleState} of the tree item.
		 */ collapsibleState??: TreeItemCollapsibleState;
    /**
		 * Context value of the tree item. This can be used to contribute item specific actions in the tree.
		 * For example, a tree item is given a context value as `folder`. When contributing actions to `view/item/context`
		 * using `menus` extension point, you can specify context value for key `viewItem` in `when` expression like `viewItem == folder`.
		 * ```json
		 * "contributes": {
		 *   "menus": {
		 *     "view/item/context": [
		 *       {
		 *         "command": "extension.deleteFolder",
		 *         "when": "viewItem == folder"
		 *       }
		 *     ]
		 *   }
		 * }
		 * ```
		 * This will show action `extension.deleteFolder` only for items with `contextValue` is `folder`.
		 */ contextValue??: string;
    /**
		 * Accessibility information used when screen reader interacts with this tree item.
		 * Generally, a TreeItem has no need to set the `role` of the accessibilityInformation;
		 * however, there are cases where a TreeItem is not displayed in a tree-like way where setting the `role` may make sense.
		 */ accessibilityInformation??: AccessibilityInformation;
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
		 * The zero-based start index of this range.
		 */ readonly start: number;
    /**
		 * The exclusive end index of this range (zero-based).
		 */ readonly end: number;
    /**
		 * `true` if `start` and `end` are equal.
		 */ readonly isEmpty: boolean;
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
		 * The mime type which determines how the {@linkcode NotebookCellOutputItem.data data}-property
		 * is interpreted.
		 *
		 * Notebooks have built-in support for certain mime-types, extensions can add support for new
		 * types and override existing types.
		 */ mime: string;
    /**
		 * The data of this output item. Must always be an array of unsigned 8-bit integers.
		 */ data: Uint8Array;
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
		 * The output items of this output. Each item must represent the same result. _Note_ that repeated
		 * MIME types per output is invalid and that the editor will just pick one of them.
		 *
		 * ```ts
		 * new vscode.NotebookCellOutput([
		 * 	vscode.NotebookCellOutputItem.text('Hello', 'text/plain'),
		 * 	vscode.NotebookCellOutputItem.text('<i>Hello</i>', 'text/html'),
		 * 	vscode.NotebookCellOutputItem.text('_Hello_', 'text/markdown'),
		 * 	vscode.NotebookCellOutputItem.text('Hey', 'text/plain'), // INVALID: repeated type, editor will pick just one
		 * ])
		 * ```
		 */ items: NotebookCellOutputItem[];
    /**
		 * Arbitrary metadata for this cell output. Can be anything but must be JSON-stringifyable.
		 */ metadata??: {
        [key: string]: any;
    };
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
		 * The {@link NotebookCellKind kind} of this cell data.
		 */ kind: NotebookCellKind;
    /**
		 * The source value of this cell data - either source code or formatted text.
		 */ value: string;
    /**
		 * The language identifier of the source value of this cell data. Any value from
		 * {@linkcode languages.getLanguages getLanguages} is possible.
		 */ languageId: string;
    /**
		 * The outputs of this cell data.
		 */ outputs??: NotebookCellOutput[];
    /**
		 * Arbitrary metadata of this cell data. Can be anything but must be JSON-stringifyable.
		 */ metadata??: {
        [key: string]: any;
    };
    /**
		 * The execution summary of this cell data.
		 */ executionSummary??: NotebookCellExecutionSummary;
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
		 * The cell data of this notebook data.
		 */ cells: NotebookCellData[];
    /**
		 * Arbitrary metadata of notebook data.
		 */ metadata??: {
        [key: string]: any;
    };
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
		 * The text to show for the item.
		 */ text: string;
    /**
		 * Whether the item is aligned to the left or right.
		 */ alignment: NotebookCellStatusBarAlignment;
    /**
		 * An optional {@linkcode Command} or identifier of a command to run on click.
		 *
		 * The command must be {@link commands.getCommands known}.
		 *
		 * Note that if this is a {@linkcode Command} object, only the {@linkcode Command.command command} and {@linkcode Command.arguments arguments}
		 * are used by the editor.
		 */ command??: string | Command;
    /**
		 * A tooltip to show when the item is hovered.
		 */ tooltip??: string;
    /**
		 * The priority of the item. A higher value item will be shown more to the left.
		 */ priority??: number;
    /**
		 * Accessibility information used when a screen reader interacts with this item.
		 */ accessibilityInformation??: AccessibilityInformation;
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
    /**
		 * The command or path of the debug adapter executable.
		 * A command must be either an absolute path of an executable or the name of an command to be looked up via the PATH environment variable.
		 * The special value 'node' will be mapped to the editor's built-in Node.js runtime.
		 */ readonly command: string;
    /**
		 * The arguments passed to the debug adapter executable. Defaults to an empty array.
		 */ readonly args: string[];
    /**
		 * Optional options to be used when the debug adapter is started.
		 * Defaults to undefined.
		 */ readonly options??: DebugAdapterExecutableOptions;
};
/**
	 * Represents a debug adapter running as a socket based server.
	 */ export type DebugAdapterServer = {
    /**
		 * The port.
		 */ readonly port: number;
    /**
		 * The host.
		 */ readonly host??: string | undefined;
    /**
		 * Create a description for a debug adapter running as a socket based server.
		 */ new(port: number, host?: string): DebugAdapterServer;
};
/**
	 * Represents a debug adapter running as a Named Pipe (on Windows)/UNIX Domain Socket (on non-Windows) based server.
	 */ export type DebugAdapterNamedPipeServer = {
    /**
		 * The path to the NamedPipe/UNIX Domain Socket.
		 */ readonly path: string;
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
    /**
		 * The unique ID of the breakpoint.
		 */ readonly id: string;
    /**
		 * Is breakpoint enabled.
		 */ readonly enabled: boolean;
    /**
		 * An optional expression for conditional breakpoints.
		 */ readonly condition??: string | undefined;
    /**
		 * An optional expression that controls how many hits of the breakpoint are ignored.
		 */ readonly hitCondition??: string | undefined;
    /**
		 * An optional message that gets logged when this breakpoint is hit. Embedded expressions within {} are interpolated by the debug adapter.
		 */ readonly logMessage??: string | undefined;
    new(enabled?: boolean, condition?: string, hitCondition?: string, logMessage?: string): Breakpoint;
};
/**
	 * A breakpoint specified by a source location.
	 */ export type SourceBreakpoint = Breakpoint & {
    /**
		 * The source and line position of this breakpoint.
		 */ readonly location: Location;
    /**
		 * Create a new breakpoint for a source location.
		 */ new(location: Location, enabled?: boolean, condition?: string, hitCondition?: string, logMessage?: string): SourceBreakpoint;
};
/**
	 * A breakpoint specified by a function name.
	 */ export type FunctionBreakpoint = Breakpoint & {
    /**
		 * The name of the function to which this breakpoint is attached.
		 */ readonly functionName: string;
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
		 * ID of the test tag. `TestTag` instances with the same ID are considered
		 * to be identical.
		 */ readonly id: string;
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
		 * A filter for specific tests to run. If given, the extension should run
		 * all of the included tests and all their children, excluding any tests
		 * that appear in {@link TestRunRequest.exclude}. If this property is
		 * undefined, then the extension should simply run all tests.
		 *
		 * The process of running tests should resolve the children of any test
		 * items who have not yet been resolved.
		 */ readonly include: readonly TestItem[] | undefined;
    /**
		 * An array of tests the user has marked as excluded from the test included
		 * in this run; exclusions should apply after inclusions.
		 *
		 * May be omitted if no exclusions were requested. Test controllers should
		 * not run excluded tests or any children of excluded tests.
		 */ readonly exclude: readonly TestItem[] | undefined;
    /**
		 * The profile used for this request. This will always be defined
		 * for requests issued from the editor UI, though extensions may
		 * programmatically create requests not associated with any profile.
		 */ readonly profile: TestRunProfile | undefined;
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
		 * Human-readable message text to display.
		 */ message: string | MarkdownString;
    /**
		 * Expected test output. If given with {@link TestMessage.actualOutput actualOutput }, a diff view will be shown.
		 */ expectedOutput??: string;
    /**
		 * Actual test output. If given with {@link TestMessage.expectedOutput expectedOutput }, a diff view will be shown.
		 */ actualOutput??: string;
    /**
		 * Associated file location.
		 */ location??: Location;
    /**
		 * Creates a new TestMessage instance.
		 * @param message The message to show to the user.
		 */ new(message: string | MarkdownString): TestMessage;
};
/**
	 * The tab represents a single text based resource.
	 */ export type TabInputText = {
    /**
		 * The uri represented by the tab.
		 */ readonly uri: Uri;
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
		 * The uri of the original text resource.
		 */ readonly original: Uri;
    /**
		 * The uri of the modified text resource.
		 */ readonly modified: Uri;
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
		 * The uri that the tab is representing.
		 */ readonly uri: Uri;
    /**
		 * The type of custom editor.
		 */ readonly viewType: string;
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
		 * The type of webview. Maps to {@linkcode WebviewPanel.viewType WebviewPanel's viewType}
		 */ readonly viewType: string;
    /**
		 * Constructs a webview tab input with the given view type.
		 * @param viewType The type of webview. Maps to {@linkcode WebviewPanel.viewType WebviewPanel's viewType}
		 */ new(viewType: string): TabInputWebview;
};
/**
	 * The tab represents a notebook.
	 */ export type TabInputNotebook = {
    /**
		 * The uri that the tab is representing.
		 */ readonly uri: Uri;
    /**
		 * The type of notebook. Maps to {@linkcode NotebookDocument.notebookType NotebookDocuments's notebookType}
		 */ readonly notebookType: string;
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
		 * The uri of the original notebook.
		 */ readonly original: Uri;
    /**
		 * The uri of the modified notebook.
		 */ readonly modified: Uri;
    /**
		 * The type of notebook. Maps to {@linkcode NotebookDocument.notebookType NotebookDocuments's notebookType}
		 */ readonly notebookType: string;
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
    readonly value: T;
    new(value: T): TelemetryTrustedValue;
};
