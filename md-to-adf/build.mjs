import * as esbuild from "esbuild";

const stubPlugin = {
  name: "stub-unused",
  setup(build) {
    const stubs = [
      "@atlaskit/tmp-editor-statsig",
      "@atlaskit/feature-gate-js-client",
      "@statsig/js-client",
      "@statsig/client-core",
    ];
    const filter = new RegExp(
      `^(${stubs.map((s) => s.replace(/[/\\-]/g, "[/\\\\-]")).join("|")})`
    );
    build.onResolve({ filter }, (args) => ({
      path: args.path,
      namespace: "stub",
    }));
    build.onLoad({ filter: /.*/, namespace: "stub" }, () => ({
      contents: "module.exports = {};",
      loader: "js",
    }));

    // Stub old entities v3 JSON (35KB) - only top-level, not prosemirror-markdown's copy
    build.onLoad(
      { filter: /node_modules[/\\]entities[/\\]lib[/\\]maps[/\\]entities\.json$/ },
      (args) => {
        if (!args.path.includes("prosemirror-markdown")) {
          return { contents: "module.exports = {};", loader: "js" };
        }
        return null;
      }
    );

    // Stub encode-html (23KB) - only used for HTML serialization, not needed for MD→ADF
    build.onLoad(
      { filter: /encode-html\.js$/ },
      () => ({ contents: "module.exports = {};", loader: "js" })
    );
  },
};

const result = await esbuild.build({
  entryPoints: ["md_to_adf_esm_entry.mjs"],
  bundle: true,
  platform: "node",
  format: "cjs",
  treeShaking: true,
  minify: true,
  plugins: [stubPlugin],
  outfile: "md_to_adf.bundle.cjs",
  metafile: true,
});

const text = esbuild.analyzeMetafileSync(result.metafile);
process.stdout.write(text.split("\n").slice(0, 5).join("\n") + "\n");
