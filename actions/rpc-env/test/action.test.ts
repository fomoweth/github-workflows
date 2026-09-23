import { beforeEach, describe, expect, it, vi } from "vitest";

const { debug, exportVariable, getInput } = vi.hoisted(() => ({
	debug: vi.fn(),
	exportVariable: vi.fn(),
	getInput: vi.fn(),
}));

vi.mock("@actions/core", () => ({
	debug,
	exportVariable,
	getInput,
}));

import { run } from "../src/action.js";

function exportedValue(key: string): string | undefined {
	return exportVariable.mock.calls.find(([name]) => name === key)?.[1] as
		| string
		| undefined;
}

describe("rpc-env", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("exports Alchemy RPCs when only an Alchemy API key is provided", async () => {
		getInput.mockImplementation((name: string) =>
			name === "alchemy-api-key" ? "alchemy-key" : "",
		);

		await run();

		expect(exportedValue("RPC_MAINNET")).toBe(
			"https://eth-mainnet.g.alchemy.com/v2/alchemy-key",
		);
		expect(exportedValue("RPC_HEMI")).toBeUndefined();
	});

	it("exports Infura RPCs when only an Infura API key is provided", async () => {
		getInput.mockImplementation((name: string) =>
			name === "infura-api-key" ? "infura-key" : "",
		);

		await run();

		expect(exportedValue("RPC_MAINNET")).toBe(
			"https://mainnet.infura.io/v3/infura-key",
		);
		expect(exportedValue("RPC_HEMI")).toBe(
			"https://hemi-mainnet.infura.io/v3/infura-key",
		);
	});

	it("prefers Alchemy and falls back to Infura when both API keys are provided", async () => {
		getInput.mockImplementation((name: string) => {
			if (name === "alchemy-api-key") return "alchemy-key";
			if (name === "infura-api-key") return "infura-key";
			return "";
		});

		await run();

		expect(exportedValue("RPC_MAINNET")).toBe(
			"https://eth-mainnet.g.alchemy.com/v2/alchemy-key",
		);
		expect(exportedValue("RPC_HEMI")).toBe(
			"https://hemi-mainnet.infura.io/v3/infura-key",
		);
	});

	it("exports no RPCs when no API keys are provided", async () => {
		getInput.mockReturnValue("");

		await run();

		expect(exportVariable).not.toHaveBeenCalled();
	});
});
