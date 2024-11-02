#!/usr/bin/env node
import { Command } from "@commander-js/extra-typings";
import { readFileSync } from "node:fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import { setupEphrem } from "./api-bible.js";

interface PackageJson {
	version: string;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packageJson = JSON.parse(
	readFileSync(join(__dirname, "../package.json"), "utf-8"),
) as PackageJson;

const program = new Command();

program
	.version(packageJson.version)
	.description(
		"Setup Ephrem by fetching details about available Bibles from API.Bible",
	)
	.option(
		"-l, --languages <ids>",
		"Comma-separated list of language IDs (ISO-639-3; lower case)",
		"eng",
	)
	.action(async (options) => {
		const languageIds = options.languages
			.split(",")
			.map((id: string) => id.trim());
		try {
			await setupEphrem(languageIds);
			console.log(`Successfully set up Ephrem!`);
		} catch (error: unknown) {
			if (error instanceof Error) {
				console.error("Error setting up Ephrem:", error.message);
			} else {
				console.error("An unknown error occurred during Ephrem setup.");
			}
		}
	});

program.parse(process.argv);
