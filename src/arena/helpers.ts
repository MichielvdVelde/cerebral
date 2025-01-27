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
): Record<string, number> {
  const mentions: Record<string, number> = {};
  let match;

  while ((match = MENTIONS_REGEX.exec(text)) !== null) {
    const mentioned = match[1];
    const participant = participants.find(
      (participant) => participant.toLowerCase() === mentioned.toLowerCase(),
    );

    if (participant) {
      mentions[participant] = (mentions[participant] ?? 0) + 1;
    }
  }

  return mentions;
}
