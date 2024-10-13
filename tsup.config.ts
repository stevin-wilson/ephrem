import { defineConfig } from "tsup";

export default defineConfig({
	bundle: false,
	clean: true,
	dts: true,
	entry: ["src/**/*.ts", "!src/**/*.test.*", "!src/test-resources/**"],
	format: "esm",
	outDir: "lib",
	sourcemap: true,
});
