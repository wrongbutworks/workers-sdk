import dedent from "ts-dedent";
import { CLICommandLineArgsError } from "../cli-command-line-args-error";

/**
 * Thrown when the user passes the deprecated `--experimental-include-runtime`
 * (or `--x-include-runtime`) flag, which has been superseded by the built-in
 * runtime type generation in `wrangler types`.
 */
export class DeprecatedIncludeRuntimeError extends CLICommandLineArgsError {
	constructor() {
		const humanMessage =
			"You no longer need to use --experimental-include-runtime.\n" +
			"`wrangler types` will now generate runtime types in the same file as the Env types.\n" +
			"You should delete the old runtime types file, and remove it from your tsconfig.json.\n" +
			"Then rerun `wrangler types`.";

		const aiMessage = dedent`
			## Error: Deprecated Flag \`--experimental-include-runtime\`

			The \`--experimental-include-runtime\` flag is no longer needed.

			### What happened
			The \`--experimental-include-runtime\` (or \`--x-include-runtime\`) flag was used
			to opt into runtime type generation as a separate file. This is now the default
			behavior: \`wrangler types\` generates both Env types and runtime types in a
			single output file.

			### How to fix
			1. Remove the \`--experimental-include-runtime\` flag from the command
			2. Delete the old separate runtime types file (if it exists)
			3. Remove the old runtime types file from \`tsconfig.json\` (if referenced)
			4. Run \`wrangler types\` without the deprecated flag

			### Question to ask the human
			To better resolve this issue, consider asking the human developer the following:
			- Is there an old runtime types file that should be deleted?
			- Does \`tsconfig.json\` reference the old runtime types file?
		`;

		super(humanMessage, aiMessage, {
			telemetryMessage: "type generation args include runtime deprecated",
		});
	}
}
