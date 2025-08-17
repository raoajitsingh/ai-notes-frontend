//Auth.jsx-->frontend

import { useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Auth({ onDone }) {
  const { setToken, setUser } = useAuth();

  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setErr("");

    // client-side checks
    if (!email || !password || (mode === "register" && !name)) {
      setBusy(false);
      setErr("Please fill all required fields.");
      return;
    }
    if (mode === "register" && password.length < 6) {
      setBusy(false);
      setErr("Password must be at least 6 characters.");
      return;
    }

    try {
      const path = mode === "login" ? "/auth/login" : "/auth/register";
      const payload =
        mode === "login" ? { email, password } : { name, email, password };

      const { data } = await api.post(path, payload);
      // backend returns: { token, user: { id, name, email } }
      setToken(data.token);
      setUser(data.user);
      onDone?.();
    } catch (e) {
      setErr(e?.response?.data?.error || "Authentication error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gray-50 px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm bg-white border rounded-2xl p-6 shadow"
      >
        <h1 className="text-xl font-semibold mb-4">
          AI Notes — {mode === "login" ? "Login" : "Register"}
        </h1>

        {mode === "register" && (
          <input
            className="w-full border rounded px-3 py-2 mb-3"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}

        <input
          className="w-full border rounded px-3 py-2 mb-3"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="w-full border rounded px-3 py-2 mb-3"
          placeholder={
            mode === "register" ? "Password (min 6 chars)" : "Password"
          }
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {err && <div className="text-sm text-red-600 mb-2">{err}</div>}

        <button
          disabled={busy}
          className="w-full rounded bg-black text-white py-2 disabled:opacity-60"
        >
          {busy
            ? "Please wait…"
            : mode === "login"
            ? "Login"
            : "Create account"}
        </button>

        <div className="text-sm mt-3">
          {mode === "login" ? (
            <>
              No account?{" "}
              <button
                type="button"
                className="underline"
                onClick={() => setMode("register")}
              >
                Register
              </button>
            </>
          ) : (
            <>
              Have an account?{" "}
              <button
                type="button"
                className="underline"
                onClick={() => setMode("login")}
              >
                Login
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
