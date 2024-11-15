import { cli } from "cleye";
import { rollup } from "rollup";
import commonjs__ from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import json__ from "@rollup/plugin-json";
import polyfillNode__ from "rollup-plugin-polyfill-node";
import sourcemaps from "rollup-plugin-sourcemaps2";

// Work around https://github.com/rollup/plugins/issues/1662
const commonjs = commonjs__ as unknown as typeof commonjs__.default;
const json = json__ as unknown as typeof json__.default;
const polyfillNode = polyfillNode__ as unknown as typeof polyfillNode__.default;

const argv = cli({
    flags: {
        entryPoint: {
            type: [String],
            placeholder: "<file>",
        },
        externalModule: {
            type: [String],
            placeholder: "<module-name>",
        },
        outDir: {
            type: String,
            placeholder: '<dir>',
        }
    },
});

if (Object.keys(argv.unknownFlags).length > 0) {
    console.error(`Unknown flags: ${Object.keys(argv.unknownFlags).map(v => `'${v}'`).join(", ")}.`);
    argv.showHelp();
    process.exit(1);
}

const entryPoints = (() => {
    if (argv.flags.entryPoint.length > 0) {
        return argv.flags.entryPoint;
    } else {
        console.log("At least one entry point must be specified.");
        argv.showHelp();
        process.exit(1);
    }
})();
const externalModules = argv.flags.externalModule;
const outDir = (() => {
    if (argv.flags.outDir) {
        return argv.flags.outDir;
    } else {
        console.log("Output directory must be specified.");
        argv.showHelp();
        process.exit(1);
    }
})();

const bundle = await (async () => {
    try {
        return await rollup({
            input: entryPoints,
            plugins: [
                sourcemaps(),
                polyfillNode(),
                nodeResolve({
                    preferBuiltins: false,
                }),
                commonjs(),
                json(),
            ],
            external: externalModules,
        });
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();

try {
    await bundle.write({
        dir: outDir,
        entryFileNames: (chunkInfo) => {
            let outName = chunkInfo.facadeModuleId;
            if (!outName) {
                throw new Error('Every entrypoint must have a fadadeModuleId');
            }

            if (outName.startsWith(process.cwd())) {
                // Remove path to module
                // TODO Infer this properly from inputs
                // "src/" for web_app, "dist/" for vendor
                outName = outName.replace(process.cwd() + "/dist/", "");
                outName = outName.replace(process.cwd() + "/src/", "");
                return outName;
            }

            return "chunks/[name].[hash].js";
        },
        format: "module",
        generatedCode: "es2015",
        // Bazel wants all outputs to be pre-declared, to satisfy this all chunks are put
        // into a single directory that maps to a directory output.
        chunkFileNames: "chunks/[name].js",
        sourcemap: "inline",
    });
    await bundle.close();
} catch (e) {
    console.error(e);
    process.exit(1);
}
