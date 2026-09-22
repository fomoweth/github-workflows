import * as core from "@actions/core";

export async function run(): Promise<void> {
	try {
		core.info("RPC environment action is not implemented yet.");
	} catch (error) {
		core.setFailed(error instanceof Error ? error.message : String(error));
	}
}

void run();
