import { setFailed } from "@actions/core";

import { run } from "./action.js";

run().catch((e) => {
	setFailed(e instanceof Error ? e.message : e);
});
