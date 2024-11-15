import { cli } from "cleye";
import fs from "node:fs";
import path from "node:path";
import { bundle } from "lightningcss";

const argv = cli({
    flags: {
        entryPoint: {
            type: String,
            placeholder: "<file>",
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

const entryPoint = (() => {
    if (argv.flags.entryPoint) {
        return argv.flags.entryPoint;
    } else {
        console.log("An entry point must be specified.");
        argv.showHelp();
        process.exit(1);
    }
})();
const outDir = (() => {
    if (argv.flags.outDir) {
        return argv.flags.outDir;
    } else {
        console.log("Output directory must be specified.");
        argv.showHelp();
        process.exit(1);
    }
})();

const { code } = bundle({
    filename: entryPoint,
    visitor: {
        Url(url) {
            // adjust external references for the new script
        },
    }
});

await fs.promises.writeFile(path.join(outDir, path.basename(entryPoint)), code);
