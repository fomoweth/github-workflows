import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts"],
	format: ["cjs"],
	outExtension: () => ({ js: ".js" }),
	target: "node24",
	platform: "node",
	bundle: true,
	noExternal: ["@actions/core"],
	splitting: false,
	sourcemap: false,
	clean: true,
	minify: true,
});
