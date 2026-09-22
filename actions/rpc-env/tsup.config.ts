import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts"],
	format: ["esm"],
	target: "node24",
	platform: "node",
	bundle: true,
	splitting: false,
	sourcemap: false,
	clean: true,
	minify: true,
});
