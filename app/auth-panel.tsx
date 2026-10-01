"use client";

import { useEffect, useState, type FormEvent } from "react";
import { isConfigured, logIn, logOut, restoreSession, signUp, type Session } from "./supabase-auth";

type Mode = "login" | "signup";

export default function AuthPanel() {
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);
  const [mode, setMode] = useState<Mode | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isConfigured()) {
      setChecking(false);
      return;
    }
    restoreSession()
      .then(setSession)
      .catch(() => setSession(null))
      .finally(() => setChecking(false));
  }, []);

  function openForm(next: Mode) {
    setMode(next);
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const next = mode === "signup" ? await signUp(email, password) : await logIn(email, password);
      setSession(next);
      setMode(null);
      setPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function handleLogOut() {
    if (!session) return;
    setBusy(true);
    await logOut(session);
    setSession(null);
    setEmail("");
    setPassword("");
    setBusy(false);
  }

  if (!isConfigured()) {
    return (
      <section className="section auth">
        <p className="auth-error">Login is not set up yet: the Supabase settings are missing.</p>
      </section>
    );
  }

  if (checking) {
    return (
      <section className="section auth">
        <p>Checking login…</p>
      </section>
    );
  }

  if (session) {
    return (
      <section className="section auth">
        <p>
          Logged in as <strong>{session.email}</strong>
        </p>
        <button type="button" onClick={handleLogOut} disabled={busy}>
          Log out
        </button>
      </section>
    );
  }

  return (
    <section className="section auth">
      <div className="auth-buttons">
        <button type="button" onClick={() => openForm("login")} aria-pressed={mode === "login"}>
          Log in
        </button>
        <button type="button" onClick={() => openForm("signup")} aria-pressed={mode === "signup"}>
          Sign up
        </button>
      </div>

      {mode && (
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>{mode === "signup" ? "Sign up" : "Log in"}</h2>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              required
            />
          </label>
          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}
          <button type="submit" disabled={busy}>
            {busy ? "Please wait…" : mode === "signup" ? "Create account" : "Log in"}
          </button>
        </form>
      )}
    </section>
  );
}
