import type { Message } from "./types";
import type { CompletionOptions } from "./provider";
import OpenAI, { type ClientOptions } from "openai";
import type { EmbeddingCreateParams } from "openai/resources/embeddings.mjs";
import type { ChatCompletionMessage } from "openai/resources/index.mjs";
import type { ChatCompletionMessageParam } from "openai/src/resources/index.js";

export type CreateEmbeddingParams = Omit<EmbeddingCreateParams, "input">;

/**
 * An embedding response.
 */
export interface Embed {
  /** The index of the input text. */
  index: number;
  /** The embedding of the input text. */
  embedding: number[];
}

/**
 * A provider for a large language model.
 */
export abstract class LLMProvider {
  /** The type of the provider. */
  abstract readonly type: string;

  /**
   * Generate a completion for a given facet.
   */
  abstract completion(
    messages: ChatCompletionMessage[],
    options: CompletionOptions,
  ): Promise<Message>;

  /**
   * Embed a single text.
   * @param text The text to embed.
   * @param options The options for the embedding.
   */
  abstract embed(text: string, options: CreateEmbeddingParams): Promise<Embed>;
  /**
   * Embed multiple texts.
   * @param text The text to embed.
   * @param options The options for the embedding.
   */
  abstract embed(
    text: string[],
    options: CreateEmbeddingParams,
  ): Promise<Embed[]>;
  abstract embed(
    text: string | string[],
    options: CreateEmbeddingParams,
  ): Promise<Embed[] | Embed[]>;
}

/**
 * A provider for OpenAI's large language model.
 */
export class OpenAILLMProvider extends LLMProvider {
  readonly type = "openai";

  /** The OpenAI client. */
  #client: OpenAI;

  constructor(options: ClientOptions) {
    super();
    this.#client = new OpenAI(options);
  }

  /** The OpenAI client. */
  get client() {
    return this.#client;
  }

  async completion(
    messages: ChatCompletionMessage[],
    options: CompletionOptions,
  ): Promise<Message> {
    //
  }

  async embed(text: string, options: CreateEmbeddingParams): Promise<Embed>;
  async embed(text: string[], options: CreateEmbeddingParams): Promise<Embed[]>;
  async embed(
    text: string | string[],
    options: CreateEmbeddingParams,
  ): Promise<Embed | Embed[]> {
    const response = await this.#client.embeddings.create({
      ...options,
      input: text,
    });

    return Array.isArray(text)
      ? response.data.map(({ embedding, index }) => ({ index, embedding }))
      : { index: 0, embedding: response.data[0].embedding };
  }
}
