# vscode

## Visual Studio Code Extension Development for Deno

https://deno.land/x/vscode

modified for Deno from
https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/vscode/index.d.ts

esbuild or something similar should be used. ( https://deno.land/x/esbuild )

```ts
import {
  ExtensionContext,
  importVsCodeApi,
} from "https://deno.land/x/vscode@1.81.0/mod.ts";

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
