import dedent from "ts-dedent";
import { CLICommandLineArgsError } from "../cli-command-line-args-error";
import { CLIError } from "../cli-error";

/**
 * Builds the human-readable message for an invalid output path.
 *
 * @param outputPath - The invalid path.
 * @returns The formatted error message string.
 */
function buildHumanMessage(outputPath: string): string {
	return `The provided output path '${outputPath}' does not point to a declaration file - please use the '.d.ts' extension`;
}

/**
 * Builds the AI-oriented message for an invalid output path.
 *
 * @param outputPath - The invalid path.
 * @returns The formatted markdown error message string.
 */
function buildAiMessage(outputPath: string): string {
	const possibleReplacementPath = `${outputPath.replace(/\.[^.]*$/, "")}.d.ts`;
	return dedent`
		## Error: Invalid Output Path

		The output path \`${outputPath}\` does not have a \`.d.ts\` extension.

		### What happened
		The \`wrangler types\` command generates a TypeScript declaration file. The
		output path must end with \`.d.ts\` so TypeScript can recognize it as an
		ambient declaration file.

		### How to fix
		- Change the file extension to \`.d.ts\`
		- Example: \`wrangler types ${possibleReplacementPath}\`
		- If no path is specified, the default \`worker-configuration.d.ts\` is used

		### Question to ask the human
		To better resolve this issue, consider asking the human developer the following:
		- What should the output file be named? is "${possibleReplacementPath}" ok?
	`;
}

/**
 * Thrown from CLI argument validation (`validateArgs`) when the output path
 * does not have a `.d.ts` extension. Extends {@link CLICommandLineArgsError}
 * so `handleError()` displays contextual `--help` output.
 */
export class InvalidOutputPathArgsError extends CLICommandLineArgsError {
	/**
	 * @param outputPath - The invalid output path.
	 */
	constructor(outputPath: string) {
		super(buildHumanMessage(outputPath), buildAiMessage(outputPath), {
			telemetryMessage: "type generation args invalid output path",
		});
	}
}

/**
 * Thrown from the programmatic API validation path when the output path
 * does not have a `.d.ts` extension. Extends {@link CLIError} (no `--help`
 * display).
 */
export class InvalidOutputPathError extends CLIError {
	/**
	 * @param outputPath - The invalid output path.
	 */
	constructor(outputPath: string) {
		super(buildHumanMessage(outputPath), buildAiMessage(outputPath), {
			telemetryMessage: "type generation args invalid output path",
		});
	}
}
