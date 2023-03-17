import { ExtensionContext, importVsCodeApi } from "../mod.ts";

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
