// auth.js-->frontend

import { atom } from "jotai";

const tokenKey = "ai_notes_token";

// Read token from localStorage just once
const initialAuth = (() => {
  const token = localStorage.getItem(tokenKey);
  return token ? { token } : { token: null };
})();

// Base atom for storing auth state
export const authAtom = atom(initialAuth);

// Write atom to update auth state
export const setAuthAtom = atom(
  null, // write-only atom
  (_get, set, payload) => {
    if (payload?.token) {
      localStorage.setItem(tokenKey, payload.token);
      set(authAtom, { token: payload.token });
    } else {
      localStorage.removeItem(tokenKey);
      set(authAtom, { token: null });
    }
  }
);
