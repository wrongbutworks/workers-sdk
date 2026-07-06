import dedent from "ts-dedent";
import { CLIError } from "../cli-error";

/**
 * Thrown when the same binding name is used for different binding categories
 * across environments (e.g. a KV namespace and a D1 database both named
 * `"MY_BINDING"`).
 */
export class ConflictingBindingTypesError extends CLIError {
	/**
	 * @param bindingName - The shared binding name.
	 * @param existingCategory - The binding category from the first environment.
	 * @param conflictingCategory - The conflicting binding category.
	 * @param envName - The environment where the conflict was detected.
	 */
	constructor(
		bindingName: string,
		existingCategory: string,
		conflictingCategory: string,
		envName: string
	) {
		const humanMessage =
			`Binding "${bindingName}" has conflicting types across environments: ` +
			`"${existingCategory}" vs "${conflictingCategory}" (in ${envName}). ` +
			`Please use unique binding names for different binding types.`;

		const aiMessage = dedent`
			## Error: Conflicting Binding Types

			The binding \`${bindingName}\` is used as both \`${existingCategory}\` and \`${conflictingCategory}\`.

			### What happened
			When generating types across multiple environments, Wrangler found that the
			binding name \`${bindingName}\` is used for a \`${existingCategory}\` binding in one
			environment and a \`${conflictingCategory}\` binding in the \`${envName}\` environment.
			This creates a type conflict because the same name would need to represent
			two incompatible types in the generated TypeScript interface.

			### How to fix
			- Rename one of the \`${bindingName}\` bindings to use a unique name
			- For example, rename the \`${conflictingCategory}\` binding in \`${envName}\` to \`${bindingName}_${conflictingCategory.toUpperCase()}\`
			- Ensure each binding name maps to the same category across all environments

			### Question to ask the human
			To better resolve this issue, consider asking the human developer the following:
			- Which binding should be renamed: the \`${existingCategory}\` or the \`${conflictingCategory}\`?
			- What should the new binding name be?
		`;

		super(humanMessage, aiMessage, {
			telemetryMessage: "type generation bindings conflicting types",
		});
	}
}
