import dedent from "ts-dedent";
import { CLIError } from "../cli-error";

/**
 * Thrown when two different environment names convert to the same TypeScript
 * interface name after PascalCase normalization.
 */
export class DuplicateInterfaceNameError extends CLIError {
	/**
	 * @param existingEnvName - The first environment name that claimed the interface name.
	 * @param newEnvName - The second environment name that collides with it.
	 * @param interfaceName - The PascalCase interface name both convert to.
	 */
	constructor(
		existingEnvName: string,
		newEnvName: string,
		interfaceName: string
	) {
		const humanMessage =
			`Environment names "${existingEnvName}" and "${newEnvName}" both convert to interface name "${interfaceName}". ` +
			`Please rename one of these environments to avoid conflicts.`;

		const aiMessage = dedent`
			## Error: Duplicate Interface Name

			The environments \`${existingEnvName}\` and \`${newEnvName}\` both convert to the TypeScript interface name \`${interfaceName}\`.

			### What happened
			Wrangler generates a TypeScript interface for each environment by converting
			the environment name to PascalCase and appending \`Env\`. Both \`${existingEnvName}\`
			and \`${newEnvName}\` produce the same interface name \`${interfaceName}\`, which
			would result in a TypeScript compilation error.

			### How to fix
			- Rename one of the environments in \`wrangler.json\` so they produce distinct interface names
			- For example, rename \`${newEnvName}\` to something more distinct

			### Question to ask the human
			To better resolve this issue, consider asking the human developer the following:
			- Which environment should be renamed: \`${existingEnvName}\` or \`${newEnvName}\`?
			- What should the new name be?
		`;

		super(humanMessage, aiMessage, {
			telemetryMessage: "type generation environment interface duplicate",
		});
	}
}
