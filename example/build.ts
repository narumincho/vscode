import { denoPlugins } from "jsr:@luca/esbuild-deno-loader";
import { build, type Plugin, stop } from "npm:esbuild";
import { ensureFile } from "jsr:@std/fs";
import { resolve } from "jsr:@std/path";

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

const buildMainJs = async (): Promise<string> => {
  const esbuildResult = await build({
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
    await buildMainJs(),
  ),

  // https://code.visualstudio.com/api/references/extension-manifest
  writeTextFileWithLog(
    resolve(distributionPath, "./package.json"),
    JSON.stringify({
      name: "example",
      version: "0.0.1",
      description: "example VSCode extension",
      repository: {
        url: "git+https://github.com/narumincho/vscode.git",
        type: "git",
      },
      license: "MIT",
      homepage: "https://github.com/narumincho/vscode",
      author: "narumincho",
      engines: {
        vscode: "^1.76.0",
      },
      dependencies: {},
      activationEvents: [],
      contributes: {
        commands: [
          {
            command: "extension.helloWorld",
            title: "Hello World",
          },
        ],
      },
      type: "module",
      browser: scriptRelativePath,
      publisher: "narumincho",
    }),
  ),

  writeTextFileWithLog(
    resolve(distributionPath, "README.md"),
    `example extension
`,
  ),
]);

await stop();
