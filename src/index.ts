#!/usr/bin/env node

import * as yargs from "yargs";
import * as fs from "fs-extra-promise";
import * as path from "path";

const argv = yargs
    .scriptName("skip-packages")
    .command("$0", "skips or unskips packages", (args) =>
    {
        return args
            .option("unskip", {
                alias: "u",
                default: false,
                boolean: true
            });
    }, async (opts) =>
    {
        await run(opts);
    })
    .argv;

async function run(opts: { unskip: boolean })
{
    console.log(`${opts.unskip ? "Unskipping" : "Skipping"} packages in ${path.resolve("packages.json")}`);

    if (!await fs.existsAsync("package.json"))
    {
        console.error("No package.json found in current directory.");
        process.exit(1);
    }

    let packageJson = await fs.readJSONAsync("package.json");

    if (!packageJson.skip || !packageJson.skip.length)
    {
        console.error("Found no packages to skip in package.json.")
        process.exit(1);
    }

    if (!packageJson.skipped || !Object.keys(packageJson.skipped).length)
    {
        if (opts.unskip)
        {
            console.error("no skipped packages found");
            process.exit(1);
        }

        packageJson.skipped = {};
    }

    if (opts.unskip)
    {
        for (const p in packageJson.skipped)
        {
            if (Object.prototype.hasOwnProperty.call(packageJson.skipped, p))
            {
                const packageDef = packageJson.skipped[p];
                if ((<string[]>packageJson.skip).indexOf(p) > -1)
                {
                    console.log(`package ${p} ${packageDef} won't be skipped anymore`);
                    packageJson.dependencies[p] = packageDef;
                    delete packageJson.skipped[p];
                }
            }
        }

        delete packageJson.skipped;
    }
    else
    {
        for (const p in packageJson.dependencies)
        {
            if (Object.prototype.hasOwnProperty.call(packageJson.dependencies, p))
            {
                const packageDef = packageJson.dependencies[p];
                if ((<string[]>packageJson.skip).indexOf(p) > -1)
                {
                    console.log(`package ${p} ${packageDef} will be skipped`);
                    packageJson.skipped[p] = packageDef;
                    delete packageJson.dependencies[p];
                }
            }
        }
    }

    await fs.writeJSONAsync("package.json", packageJson);
}