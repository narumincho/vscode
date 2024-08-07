# vscode

## Visual Studio Code Extension Development for Deno

- https://deno.land/x/vscode
- https://jsr.io/@narumincho/vscode

modified for Deno from
https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/vscode/index.d.ts

Must be bundled with

- [esbuild](https://github.com/esbuild/deno-esbuild) with
  [esbuild-deno-loader](https://github.com/lucacasonato/esbuild_deno_loader)
- or similar

```ts
import { type ExtensionContext, importVsCodeApi } from "jsr:@narumincho/vscode";

export function activate(context: ExtensionContext) {
  const vscode = importVsCodeApi();
  if (vscode === undefined) {
    throw new Error(
      "Could not import vscode api because it was not working within the extension",
    );
  }

  console.log(
    'Congratulations, your extension "helloworld-sample" is now active!',
  );

  const disposable = vscode.commands.registerCommand(
    "extension.helloWorld",
    () => {
      vscode.window.showInformationMessage("Hello World!");
    },
  );

  context.subscriptions.push(disposable);
}
```

All examples can be found
[here](https://github.com/narumincho/vscode/tree/main/example)
