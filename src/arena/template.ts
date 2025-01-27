import Mustache from "mustache";

export interface TemplateData {
  /** The name of the facet. */
  name: string;
  /** The role of the facet. */
  role: string;
  /** A description of the facet. */
  description: string;
  /** The personality of the facet. */
  personality: string;
  /** The participants in the meeting. */
  participants: { name: string; role: string }[];
  /** The brief for the meeting. */
  brief: string;
  /** The details of the meeting. */
  details?: string;
}

const template = `# Instructions

## Identity

You are {{name}}, a {{role}}. {{description}} {{personality}}

## Situation

You are in a meeting with your team. The team is discussing the subject in the brief. Your goal is to help the team thoroughly understand the situation and come up with a solution.

## Participants

You are joined by the following participants:

{{#participants}}
- {{name}}, {{role}}
{{/participants}}

You can mention them by name in your response: \`@participant_name\`.

## Response

You can use Markdown to format your response.

ALWAYS use the following format when responding:

\`\`\`
<thinking>
What is asked of me? What do I know? What do I need to know? What do I need to do? This will not be visible to the other participants.
</thinking>

<response>
Your chat response. This will be visible to the other participants.
</response>
\`\`\`

## Brief

{{brief}}
{{#details}}

## Details

{{.}}
{{/details}}
`;

/**
 * Compiles the template with the given data.
 */
export function compileTemplate(data: TemplateData): string {
  return Mustache.render(template, data);
}
