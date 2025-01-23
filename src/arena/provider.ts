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

export async function chatCompletion(
  facet: Facet,
  participants: Facet[],
  brief: string,
  messages: Message[],
  details?: string,
): Promise<Message> {
  const systemMessage = {
    role: "system",
    content: compileTemplate({
      ...facet,
      participants,
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
    model: "meta-llama-3.1-8b-instruct",
    // @ts-expect-error
    messages: [systemMessage, ...chatMessages],
  });

  const end = performance.now();
  const duration = end - start;

  if (process.env.NODE_ENV === "development") {
    console.log("Chat completion duration:", `${duration.toFixed(2)}ms`);
  }

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

  const usage = {
    prompt: response.usage?.prompt_tokens ?? 0,
    completion: response.usage?.completion_tokens ?? 0,
  };

  const mentions = getMentions(
    responseContent,
    participants.map((participant) => participant.name),
  );

  return {
    name: facet.name,
    facet,
    role: "user",
    content: {
      thinking: thinkingContent,
      response: responseContent,
    },
    usage,
    timing: {
      start,
      end,
    },
    template: systemMessage.content,
    details,
    mentions,
  };
}

// embed
export async function embeddings(text: string): Promise<number[]> {
  const response = await provider.embeddings.create({
    model: "text-llama-3.1-8b-v1",
    input: text,
  });

  return response.data[0].embedding;
}
