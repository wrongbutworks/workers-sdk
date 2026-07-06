import dedent from "ts-dedent";
import { CLIError } from "../cli-error";

/**
 * Thrown when a configuration value cannot be parsed as a boolean (e.g. an
 * option that expects `true` or `false` receives an unrecognised string or
 * a non-string/non-boolean type).
 */
export class InvalidBooleanValueError extends CLIError {
	/**
	 * @param value - The value that could not be parsed as a boolean.
	 */
	constructor(value: unknown) {
		const humanMessage = `Invalid value: ${value}`;

		const aiMessage = dedent`
			## Error: Invalid Boolean Value

			The value \`${value}\` could not be parsed as a boolean.

			### What happened
			While parsing type-generation options from the generated types file header,
			Wrangler encountered a value that is neither \`true\`, \`false\`, nor a string
			representation of those values.

			### How to fix
			- Ensure boolean options in \`wrangler.json\` use \`true\` or \`false\` (without quotes for JSON, or as strings \`"true"\`/\`"false"\`)
			- If this error occurs during \`wrangler types --check\`, try regenerating the types file with \`wrangler types\`
			- Delete the generated types file and re-run \`wrangler types\`

			### Question to ask the human
			To better resolve this issue, consider asking the human developer the following:
			- Was the generated types file manually edited?
			- What value was intended for this option?
		`;

		super(humanMessage, aiMessage, {
			telemetryMessage: false,
		});
	}
}
