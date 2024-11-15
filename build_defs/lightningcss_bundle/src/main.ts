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

const urlLookupPaths = new Set<string>();
const { code } = bundle({
    filename: entryPoint,
    visitor: {
        StyleSheet(stylesheet) {
            stylesheet.sources.map(s => urlLookupPaths.add(path.normalize(path.dirname(s))));
        },
        Url(url) {
            // Adjust external references for the bundled script
            // By the time this runs, the CSS is already bundled so we have to check all relative sources
            const [base, ...extras] = Array.from(urlLookupPaths)   
                .filter(p => fs.existsSync(path.join(process.cwd(), p, url.url)));
            if (base == null) {
                throw new Error("No base url resolved");
            }
            if (extras.length > 0) {
                throw new Error(`Multiple base urls resolved: ${JSON.stringify([base, ...extras])}`);
            }

            return {
                ...url,
                // TODO Eliminate arbitrary `.replace`
                url: "./" + path.join(base.replace("src/", ""), url.url),
            };
        },
    }
});

await fs.promises.writeFile(path.join(outDir, path.basename(entryPoint)), code);
