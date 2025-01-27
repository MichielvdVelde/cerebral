import OpenAI from "openai";
import type { Facet, Message } from "./types";
import { getMentions } from "./helpers";
import { compileTemplate } from "./template";

const provider = new OpenAI({
  baseURL: "http://127.0.0.1:1234/v1",
  apiKey: "",
  dangerouslyAllowBrowser: true,
});

const thinkingRegex = /<thinking>(.*?)<\/thinking>/s;
const responseRegex = /<response>(.*?)(?:<\/response>|$)/s;

export interface CompletionOptions {
  model: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stop?: string | string[];
  details?: string;
}

/**
 * Generate a completion for a given facet.
 * @param facet The facet to generate a completion for.
 * @param participants The participants in the conversation.
 * @param brief The brief for the conversation.
 * @param messages The messages in the conversation.
 * @param options The options for the completion.
 */
export async function chatCompletion(
  facet: Facet,
  participants: Facet[],
  brief: string,
  messages: Message[],
  options: CompletionOptions,
): Promise<Message> {
  const { details, ...rest } = options;

  const systemMessage = {
    role: "system",
    content: compileTemplate({
      ...facet,
      participants: participants.filter((participant) =>
        participant.id !== facet.id
      ),
      brief,
      details,
    }),
  };

  const chatMessages = messages.map((message) => ({
    name: message.name,
    role: message.role,
    content: message.content.response,
  }));

  const start = performance.now();

  const response = await provider.chat.completions.create({
    ...rest,
    // @ts-expect-error
    messages: [systemMessage, ...chatMessages],
  });

  const end = performance.now();
  const { content } = response.choices[0].message;

  if (!content) {
    throw new Error("No content in response");
  }

  // extract the thinking and response from the completion
  const thinkingMatch = content.match(thinkingRegex);
  const responseMatch = content.match(responseRegex);

  if (!thinkingMatch) {
    throw new Error("No thinking in response");
  } else if (!responseMatch) {
    throw new Error("No response in response");
  }

  const thinkingContent = thinkingMatch[1];
  const responseContent = responseMatch[1];

  return {
    name: facet.name,
    facet,
    role: "user",
    content: {
      thinking: thinkingContent,
      response: responseContent,
    },
    usage: {
      prompt: response.usage?.prompt_tokens ?? 0,
      completion: response.usage?.completion_tokens ?? 0,
    },
    timing: {
      start,
      end,
    },
    template: systemMessage.content,
    details,
    mentions: getMentions(
      responseContent,
      participants.map((participant) => participant.name),
    ),
  };
}

/**
 * Generate embeddings for a given text.
 * @param text The text to generate embeddings for.
 */
export async function embeddings(text: string): Promise<number[]> {
  const response = await provider.embeddings.create({
    model: "text-llama-3.1-8b-v1",
    input: text,
  });

  return response.data[0].embedding;
}
