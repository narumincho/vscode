import { denoPlugins } from "https://deno.land/x/esbuild_deno_loader@0.8.2/mod.ts";
import {
  build as esBuild,
  Plugin,
} from "https://deno.land/x/esbuild@v0.19.7/mod.js";
import { ensureFile } from "https://deno.land/std@0.208.0/fs/mod.ts";
import { resolve } from "https://deno.land/std@0.208.0/path/mod.ts";

/**
 * ```bash
 * deno run -A ./example/build.ts
 * ```
 */

/** */
export const writeTextFileWithLog = async (
  path: string,
  content: string,
): Promise<void> => {
  console.log(path + " に書き込み中... " + content.length + "文字");
  await ensureFile(path);
  await Deno.writeTextFile(path, content);
  console.log(path + " に書き込み完了!");
};

const distributionPath = "./vscodeExtensionDistribution/";

const build = async (): Promise<string> => {
  const esbuildResult = await esBuild({
    entryPoints: ["./example/main.ts"],
    plugins: denoPlugins() as Plugin[],
    write: false,
    bundle: true,
    format: "cjs",
    target: ["node20"],
  });

  for (const esbuildResultFile of esbuildResult.outputFiles ?? []) {
    if (esbuildResultFile.path === "<stdout>") {
      console.log("js 発見");
      const scriptContent = new TextDecoder().decode(
        esbuildResultFile.contents,
      );

      return scriptContent;
    }
  }
  throw new Error("esbuild で <stdout> の出力を取得できなかった...");
};

const scriptRelativePath = "./main.js";

await Promise.all([
  writeTextFileWithLog(
    resolve(distributionPath, scriptRelativePath),
    await build(),
  ),

  writeTextFileWithLog(
    resolve(distributionPath, "./package.json"),
    JSON.stringify({
      "name": "example",
      "version": "0.0.1",
      "description": "example VSCode extension",
      "repository": {
        "url": "git+https://github.com/narumincho/vscode.git",
        "type": "git",
      },
      "license": "MIT",
      "homepage": "https://github.com/narumincho/vscode",
      "author": "narumincho",
      "engines": {
        "vscode": "^1.76.0",
      },
      "dependencies": {},
      "activationEvents": [],
      "contributes": {
        "commands": [
          {
            "command": "extension.helloWorld",
            "title": "Hello World",
          },
        ],
      },
      "browser": scriptRelativePath,
      "publisher": "narumincho",
    }),
  ),

  writeTextFileWithLog(
    resolve(distributionPath, "README.md"),
    `example extension
`,
  ),
]);

Deno.exit();
