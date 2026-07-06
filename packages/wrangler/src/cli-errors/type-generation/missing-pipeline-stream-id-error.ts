import dedent from "ts-dedent";
import { CLIError } from "../cli-error";

/**
 * Thrown when a pipeline binding in the Wrangler configuration is missing
 * both the `stream` and `pipeline` (legacy) properties that identify the
 * pipeline stream.
 */
export class MissingPipelineStreamIdError extends CLIError {
	/**
	 * @param bindingName - The name of the pipeline binding that is missing
	 *   a stream ID.
	 */
	constructor(bindingName: string) {
		const humanMessage = `Pipeline binding ${bindingName} is missing the stream ID`;

		const aiMessage = dedent`
			## Error: Missing Pipeline Stream ID

			The pipeline binding \`${bindingName}\` does not have a \`stream\` (or legacy \`pipeline\`) property.

			### What happened
			Each pipeline binding needs a \`stream\` property that identifies the
			pipeline stream to fetch the schema from. Without it, Wrangler cannot
			generate accurate types for this binding.

			### How to fix
			- Add a \`stream\` property to the pipeline binding in \`wrangler.json\`:
			  \`\`\`json
			  { "binding": "${bindingName}", "stream": "<your-stream-id>" }
			  \`\`\`
			- Find your stream ID in the Cloudflare dashboard under Workers > Pipelines

			### Question to ask the human
			To better resolve this issue, consider asking the human developer the following:
			- What is the stream ID for the \`${bindingName}\` pipeline binding?
		`;

		super(humanMessage, aiMessage, {
			telemetryMessage: "type generation pipeline missing stream id",
		});
	}
}
