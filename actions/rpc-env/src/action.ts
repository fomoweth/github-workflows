import { debug, exportVariable, getInput } from "@actions/core";

import {
	ALCHEMY_NETWORKS,
	INFURA_NETWORKS,
	SUPPORTED_CHAINS,
} from "./constants.js";

const ALCHEMY_TEMPLATE = "https://{NETWORK}.g.alchemy.com/v2/{ALCHEMY_API_KEY}";

const INFURA_TEMPLATE = "https://{NETWORK}.infura.io/v3/{INFURA_API_KEY}";

function interpolateUrl(
	template: string,
	variables: Record<string, string>,
): string {
	return template.replace(
		/\{([A-Z0-9_]+)\}/g,
		(_, key: string) => variables[key] ?? "",
	);
}

export async function run(): Promise<void> {
	const ALCHEMY_API_KEY = getInput("alchemy-api-key") || undefined;
	const INFURA_API_KEY = getInput("infura-api-key") || undefined;

	for (const [chainAlias, chainId] of SUPPORTED_CHAINS) {
		const envVariableKey = `RPC_${chainAlias}`;

		const alchemyNetwork = ALCHEMY_NETWORKS[chainId];
		if (ALCHEMY_API_KEY && alchemyNetwork) {
			debug(`Setting ${envVariableKey} with Alchemy`);
			exportVariable(
				envVariableKey,
				interpolateUrl(ALCHEMY_TEMPLATE, {
					NETWORK: alchemyNetwork,
					ALCHEMY_API_KEY,
				}),
			);
			continue;
		}

		const infuraNetwork = INFURA_NETWORKS[chainId];
		if (INFURA_API_KEY && infuraNetwork) {
			debug(`Setting ${envVariableKey} with Infura`);
			exportVariable(
				envVariableKey,
				interpolateUrl(INFURA_TEMPLATE, {
					NETWORK: infuraNetwork,
					INFURA_API_KEY,
				}),
			);
		}
	}
}
