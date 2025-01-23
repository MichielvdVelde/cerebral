/**
 * A facet is a single aspect of the large language model.
 */
export interface Facet {
  /** The unique identifier of the facet. */
  id: string;
  /** The name of the facet. */
  name: string;
  /** The role of the facet. */
  role: string;
  /** The description of the facet. */
  description: string;
  /** The personality of the facet. */
  personality: string;
}

/**
 * The message content is the thinking and response parts of the message.
 */
export interface Content {
  /** The thinking part of the message. */
  thinking: string;
  /** The response part of the message. */
  response: string;
}

/**
 * The usage of the message is the prompt and completion usage.
 */
export interface Usage {
  /** The prompt usage. */
  prompt: number;
  /** The completion usage. */
  completion: number;
}

/**
 * The timing of the message is the start and end time.
 */
export interface Timing {
  /** The start time of the message. */
  start: number;
  /** The end time of the message. */
  end: number;
}

/** The message role. */
export type MessageRole = "system" | "user";

/**
 * A message is a single message in a conversation.
 */
export interface Message {
  /** The name of the user, if any. */
  name?: string;
  /** The facet of the message. */
  facet: Facet;
  /** The role of the message. */
  role: MessageRole;
  /** The content of the message. */
  content: {
    /** The thinking part of the message. */
    thinking: string;
    /** The response part of the message. */
    response: string;
  };
  /** The template of the message. */
  template: string;
  /** The usage of the message. */
  usage: Usage;
  /** The timing of the message. */
  timing: Timing;
  /** The details of the message. */
  details?: string;
  /** The mentions in the message. */
  mentions?: string[];
}

/**
 * A session is a single conversation between multiple facets.
 */
export interface Session {
  /** The unique identifier of the session. */
  id: string;
  /** The brief of the session. */
  brief: string;
  /** The round of the session. */
  round: number;
  /** The participants of the session. */
  participants: Facet[];
  /** The messages of the session. */
  messages: Message[];

  /** The working state of the session. */
  working: false | string;
  /** The error state of the session. */
  error?: string;
}

/**
 * Builds a session.
 * @param brief The brief of the session.
 * @param participants The participants of the session.
 */
export function buildSession(brief: string, participants: Facet[]): Session {
  return {
    id: crypto.randomUUID(),
    brief,
    round: 0,
    participants,
    messages: [],
    working: false,
  };
}
