import dedent from "ts-dedent";
import { CLIError } from "../cli-error";

/**
 * Thrown when a named environment specified via `--env` does not exist in
 * the Wrangler configuration.
 */
export class MissingEnvironmentError extends CLIError {
	/**
	 * @param environmentName - The name of the missing environment.
	 * @param availableEnvs - The list of environment names defined in the config.
	 */
	constructor(environmentName: string, availableEnvs: string[]) {
		const envList =
			availableEnvs.length > 0
				? `Available environments: ${availableEnvs.join(", ")}`
				: "No environments are defined in the configuration file.";

		const humanMessage = `Environment "${environmentName}" not found in configuration.\n${envList}`;

		const availableSection =
			availableEnvs.length > 0
				? `\nAvailable environments:\n${availableEnvs.map((e) => `- \`${e}\``).join("\n")}`
				: "\nNo environments are defined in the configuration file.";

		const fixSuggestion =
			availableEnvs.length > 0
				? `- Use one of the available environments: ${availableEnvs.map((e) => `\`${e}\``).join(", ")}`
				: "- Add the environment to the `env` section of `wrangler.json`";

		const aiMessage = dedent`
			## Error: Environment Not Found

			The environment \`${environmentName}\` does not exist in the Wrangler configuration.

			### What happened
			The \`--env ${environmentName}\` flag was passed to \`wrangler types\`, but no
			environment with that name is defined in the \`env\` section of the config file.
			${availableSection}

			### How to fix
			${fixSuggestion}

			### Question to ask the human
			To better resolve this issue, consider asking the human developer the following:
			- Did they mean one of the available environments?
			- Or should the \`${environmentName}\` environment be created in the Wrangler config file?
		`;

		super(humanMessage, aiMessage, {
			telemetryMessage: "type generation config missing environment",
		});
	}
}
