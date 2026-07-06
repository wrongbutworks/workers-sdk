import dedent from "ts-dedent";
import { CLIError } from "../cli-error";

/**
 * Thrown when the user provides a custom `--env-interface` value but the
 * Worker uses the Service Worker syntax, which does not support named
 * environment interfaces.
 */
export class IncompatibleServiceWorkerError extends CLIError {
	constructor() {
		const humanMessage =
			"An env-interface value has been provided but the worker uses the incompatible Service Worker syntax";

		const aiMessage = dedent`
			## Error: Incompatible Service Worker Syntax

			A custom \`--env-interface\` was specified, but the Worker uses Service Worker syntax.

			### What happened
			The \`--env-interface\` option generates a named TypeScript interface for the
			Worker's environment bindings. This only works with the ES Modules (module)
			Worker format, where bindings are passed as the \`env\` parameter to the
			\`fetch\` handler. Service Worker syntax accesses bindings as global variables
			and does not use an environment interface.

			### How to fix
			- Remove the \`--env-interface\` flag and use the default behavior
			- Or migrate the Worker to ES Modules syntax (recommended):
			  - Change \`addEventListener('fetch', ...)\` to \`export default { fetch(request, env, ctx) { ... } }\`
			  - See https://developers.cloudflare.com/workers/reference/migrate-to-module-workers/

			### Question to ask the human
			To better resolve this issue, consider asking the human developer the following:
			- Should the Worker be migrated from Service Worker syntax to ES Modules?
			- Or should the \`--env-interface\` flag be removed?
		`;

		super(humanMessage, aiMessage, {
			telemetryMessage: "type generation command env interface incompatible",
		});
	}
}
