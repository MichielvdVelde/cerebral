/** The regular expression to match mentions. */
const MENTIONS_REGEX = /@(\w+)/g;

/**
 * Get the mentions from a text.
 * @param text The text to get the mentions from.
 * @param participants The participants to check for mentions.
 */
export function getMentions(
  text: string,
  participants: string[],
): string[] {
  const mentions: string[] = [];
  let match;

  while ((match = MENTIONS_REGEX.exec(text)) !== null) {
    const mentioned = match[1];
    const index = participants.findIndex((participant) =>
      participant.toLowerCase() === mentioned.toLowerCase()
    );

    if (!mentions.includes(participants[index])) {
      mentions.push(participants[index]);
    }
  }

  return mentions;
}
