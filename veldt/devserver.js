import { Chalk } from "chalk";
import { createServer } from "esbuild-server";

const chalk = new Chalk({ level: 1 });
const server = createServer(
  {
    bundle: true,
    sourcemap: true,
    color: true,
    entryPoints: ["src/App.tsx"],
    loader: {
      ".png": "file",
      ".svg": "file",
      ".jpg": "file",
      ".jpeg": "file",
      ".gif": "file",
      ".woff": "file",
      ".woff2": "file",
      ".ttf": "file",
      ".eot": "file",
      ".mp4": "file",
      ".webm": "file",
      ".wav": "file",
      ".mp3": "file",
      ".m4a": "file",
      ".aac": "file",
      ".oga": "file",
    },
  },
  {
    static: "public",
    injectLiveReload: true,
    open: true,
    historyApiFallback: true,
  }
);

const buildStart = Date.now();
server
  .start()
  .then(() => {
    console.log(chalk.blue(`Build completed in ${Date.now() - buildStart}ms`));
    console.log(
      chalk.dim("Dev server started at"),
      chalk.magenta("http://localhost:8080")
    );
  })
  .catch((e) => {
    console.error(chalk.red("Build failed!"));
    console.error(e);
    process.exit(1);
  });
console.log(chalk.bgGreenBright("Starting dev server...\n"));
