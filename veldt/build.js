import * as esbuild from "esbuild";
import publicDir from "esbuild-plugin-public-directory";

await esbuild.build({
  entryPoints: ["src/App.tsx"],
  bundle: true,
  minify: true,
  sourcemap: true,
  outdir: "build",
  logLevel: "debug",
  color: true,
  banner: {
    js: "/* Veldt v0.0.1\n Built by Arjun S \nhttps://github.com/arjunindia */",
  },
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
  plugins: [publicDir({ dir: "public" })],
});
