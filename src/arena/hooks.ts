import type { Facet, Message, Session } from "./types";
import { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  addMessage,
  createSession,
  selectSession,
  selectSessions,
  setError,
  setRound,
  setWorking,
} from "./slice";
import { chatCompletion } from "./provider";

export interface SessionsHook {
  /** All sessions. */
  sessions: Record<string, Session>;
  /** Create a new session. */
  createSession: (session: Session) => void;
}

/**
 * Hook for managing sessions.
 */
export function useSessions(): SessionsHook {
  const dispatch = useAppDispatch();
  const sessions = useAppSelector(selectSessions);

  const create = useCallback((session: Session) => {
    dispatch(createSession(session));
  }, [dispatch]);

  return useMemo(() => ({
    sessions,
    createSession: create,
  }), [sessions, create]);
}

export interface SessionHook {
  /** The current round. */
  round: number;
  /** The participants. */
  participants: Facet[];
  /** The current working participant. */
  working: false | string;
  /** The current error message. */
  error?: string;
  /** The messages. */
  messages: Message[];
  /** Move to the next round. */
  nextRound: (options?: { facetId?: string; details?: string }) => void;
}

/**
 * Hook for managing a session.
 * @param id The session ID.
 */
export function useSession(id: string): SessionHook {
  const dispatch = useAppDispatch();
  const session = useAppSelector(selectSession(id));
  const { brief, participants, round, working, error, messages } = session;

  const nextRound = useCallback(
    ({ facetId, details }: { facetId?: string; details?: string } = {}) => {
      if (working) {
        console.debug("Already working");
        return;
      }

      const facet = facetId
        ? participants.find((f) => f.id === facetId)!
        : participants[round % participants.length];

      dispatch(setError({ id }));
      dispatch(setWorking({ id, working: facet.id }));

      const model = "meta-llama-3.1-8b-instruct";

      chatCompletion(facet, participants, brief, messages, { details, model })
        .then(
          (response) => {
            dispatch(addMessage({ id, message: response }));
            dispatch(setWorking({ id, working: false }));
            dispatch(setRound({ id, round: round + 1 }));
          },
        ).catch((error) => {
          dispatch(setWorking({ id, working: false }));
          dispatch(setError({ id, error: error.message }));
        });
    },
    [round, working],
  );

  return useMemo(() => ({
    round,
    participants,
    working,
    error,
    messages,
    nextRound,
  }), [round, participants, working, error, messages, nextRound]);
}
