import dedent from "ts-dedent";
import { CLICommandLineArgsError } from "../cli-command-line-args-error";
import { CLIError } from "../cli-error";

/**
 * Builds the human-readable message for missing type selection.
 *
 * @param envOpt - The env option name (CLI flag or API option).
 * @param runtimeOpt - The runtime option name (CLI flag or API option).
 * @returns The formatted error message string.
 */
function buildHumanMessage(envOpt: string, runtimeOpt: string): string {
	return `At least one of ${envOpt} or ${runtimeOpt} must be enabled. Use ${envOpt} to generate environment/binding types, or ${runtimeOpt} to generate Workers runtime types.`;
}

/**
 * Builds the AI-oriented message for missing type selection.
 *
 * @param envOpt - The env option name (CLI flag or API option).
 * @param runtimeOpt - The runtime option name (CLI flag or API option).
 * @returns The formatted markdown error message string.
 */
function buildAiMessage(envOpt: string, runtimeOpt: string): string {
	return dedent`
		## Error: No Type Generation Selected

		Both \`${envOpt}\` and \`${runtimeOpt}\` are disabled. At least one must be enabled.

		### What happened
		\`wrangler types\` can generate two kinds of types:
		- **Environment types** (\`${envOpt}\`): TypeScript interfaces for your Worker's bindings (KV, D1, R2, etc.)
		- **Runtime types** (\`${runtimeOpt}\`): TypeScript definitions for the Workers runtime APIs

		Both have been explicitly disabled, leaving nothing to generate.

		### How to fix
		- Enable env types: \`${envOpt}\`
		- Enable runtime types: \`${runtimeOpt}\`
		- Or enable both (the default): omit both flags entirely

		### Question to ask the human
		To better resolve this issue, consider asking the human developer the following:
		- Which types are needed: environment types, runtime types, or both?
	`;
}

/**
 * Thrown from CLI argument validation (`validateArgs`) when both
 * `--include-env` and `--include-runtime` are disabled. Extends
 * {@link CLICommandLineArgsError} so `handleError()` displays contextual
 * `--help` output.
 */
export class MissingTypeSelectionArgsError extends CLICommandLineArgsError {
	constructor() {
		super(
			buildHumanMessage("--include-env", "--include-runtime"),
			buildAiMessage("--include-env", "--include-runtime"),
			{
				telemetryMessage: "type generation args missing type selection",
			}
		);
	}
}

/**
 * Thrown from the programmatic API validation path when both `includeEnv`
 * and `includeRuntime` are disabled. Extends {@link CLIError} (no `--help`
 * display).
 */
export class MissingTypeSelectionError extends CLIError {
	/**
	 * @param source - Whether the caller is `"cli"` or `"api"`, to select
	 *   the appropriate option names in the error message.
	 */
	constructor(source: "cli" | "api") {
		const [envOpt, runtimeOpt] =
			source === "cli"
				? ["--include-env", "--include-runtime"]
				: ["includeEnv", "includeRuntime"];

		super(
			buildHumanMessage(envOpt, runtimeOpt),
			buildAiMessage(envOpt, runtimeOpt),
			{
				telemetryMessage: "type generation args missing type selection",
			}
		);
	}
}
