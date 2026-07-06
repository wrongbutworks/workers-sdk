import dedent from "ts-dedent";
import { CLIError } from "../cli-error";

/**
 * Thrown when a secondary Worker configuration (passed via `--config`) does
 * not have a resolvable entry point.
 */
export class MissingServiceEntryPointError extends CLIError {
	/**
	 * @param secondaryConfig - A string representation of the secondary
	 *   config that failed entry point resolution.
	 */
	constructor(secondaryConfig: string) {
		const humanMessage = `Could not resolve entry point for service config '${secondaryConfig}'.`;

		const aiMessage = dedent`
			## Error: Missing Service Entry Point

			Could not resolve an entry point for the secondary Worker config \`${secondaryConfig}\`.

			### What happened
			When using \`wrangler types\` with multiple \`--config\` flags for cross-worker
			type resolution (e.g. service bindings or Durable Object bindings that
			reference other Workers), each config must have a resolvable entry point.
			The specified config does not declare a \`main\` field or the file it points
			to cannot be found.

			### How to fix
			- Add a \`main\` field to the config at \`${secondaryConfig}\` pointing to the Worker's entry file
			- Verify the entry file exists at the specified path
			- If this Worker is not needed for type resolution, remove its \`--config\` flag

			### Question to ask the human
			To better resolve this issue, consider asking the human developer the following:
			- Where is the entry file for the Worker defined in \`${secondaryConfig}\`?
			- Is this secondary config still needed?
		`;

		super(humanMessage, aiMessage, {
			telemetryMessage: "type generation command service entrypoint missing",
		});
	}
}
