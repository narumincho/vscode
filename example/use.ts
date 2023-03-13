import { importVsCodeApi } from "../gen/out.ts";

const api = (() => {
  const api = importVsCodeApi();
  if (api === undefined) {
    throw new Error(
      "Could not import vscode api because it was not working within the extension",
    );
  }
  return api;
})();

const pos = new api.Position(1, 3);
pos.line;
pos.caller;
