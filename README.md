# vscode

## Visual Studio Code Extension Development for Deno

## under development 開発中

https://deno.land/x/vscode

modified for Deno from
https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/vscode/index.d.ts

I think it needs to be used with esbuild ( https://deno.land/x/esbuild )

```ts
import {
  ExtensionContext,
  importVsCodeApi,
} from "https://deno.land/x/vscode@0.0.3";

export function activate(context: ExtensionContext) {
  const vscode = (() => {
    const api = importVsCodeApi();
    if (api === undefined) {
      throw new Error(
        "Could not import vscode api because it was not working within the extension",
      );
    }
    return api;
  })();

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
