import dedent from "ts-dedent";
import { CLIError } from "../cli-error";

/**
 * Thrown when the runtime type-generation worker (powered by Miniflare/workerd)
 * returns a non-OK response.
 */
export class RuntimeTypesFetchError extends CLIError {
	/**
	 * @param responseText - The HTTP response body returned by the
	 *   type-generation worker.
	 */
	constructor(responseText: string) {
		const humanMessage = responseText;

		const aiMessage = dedent`
			## Error: Runtime Types Generation Failed

			The workerd type-generation worker returned an error.

			### What happened
			Wrangler spawns a local workerd process (via Miniflare) to generate runtime
			type definitions. That worker responded with a non-OK status:

			\`\`\`
			${responseText}
			\`\`\`

			### How to fix
			- Check wether the workerd binary is accessible and functioning correctly
			- Ensure the \`compatibility_date\` and \`compatibility_flags\` in \`wrangler.json\` are valid
			- Try running \`wrangler types --include-runtime=false\` to skip runtime types and still generate Env types
			- Update Wrangler to the latest version: \`npm install -g wrangler@latest\`
		`;

		super(humanMessage, aiMessage, {
			telemetryMessage: "type generation runtime fetch failed",
		});
	}
}
