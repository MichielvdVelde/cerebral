import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Message, Session } from "./types";
import { RootState } from "../app/store";

interface ArenaState {
  sessions: Record<string, Session>;
  activeSession: string | null;
}

const initialState: ArenaState = {
  sessions: {},
  activeSession: null,
};

const arenaSlice = createSlice({
  name: "arena",
  initialState,
  reducers: {
    createSession(state, action: PayloadAction<Session>) {
      if (state.sessions[action.payload.id]) {
        return;
      }

      state.sessions[action.payload.id] = action.payload;
    },
    setActiveSession(state, action: PayloadAction<string | null>) {
      state.activeSession = action.payload;
    },
    setRound(state, action: PayloadAction<{ id: string; round: number }>) {
      state.sessions[action.payload.id].round = action.payload.round;
    },
    setWorking(
      state,
      action: PayloadAction<{ id: string; working: false | string }>,
    ) {
      state.sessions[action.payload.id].working = action.payload.working;
    },
    setError(state, action: PayloadAction<{ id: string; error?: string }>) {
      state.sessions[action.payload.id].error = action.payload.error;
    },
    addMessage(state, action: PayloadAction<{ id: string; message: Message }>) {
      state.sessions[action.payload.id].messages.push(action.payload.message);
    },
  },
});

export const {
  createSession,
  setActiveSession,
  setRound,
  setWorking,
  setError,
  addMessage,
} = arenaSlice.actions;

export default arenaSlice.reducer;

export const selectSessions = (state: RootState) => state.arena.sessions;
export const selectSession = (id: string) => (state: RootState) =>
  state.arena.sessions[id];
export const selectActiveSession = (state: RootState) =>
  state.arena.activeSession;
