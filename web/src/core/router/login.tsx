import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { apiRequest } from "../api/fetch";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const [username, setUsername] = useState("sara");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function login(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const result = await apiRequest<{ token: string }>("/api/login", "POST", { username, password });
      sessionStorage.setItem("enspct-token", result.token);
      sessionStorage.setItem("enspct-user", username);
      window.location.assign("/");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setPending(false);
    }
  }

  return <section>
    <h1>Sign in</h1>
    <p>Sara can access Grievances and Cairo facilities. Omar can access Inspections and Alexandria facilities.</p>
    <p>Demo accounts use password <strong>demo123</strong>.</p>
    <form onSubmit={login}>
      <label>User <select value={username} onChange={(event) => setUsername(event.target.value)}>
        <option value="sara">Sara Ahmed (sara)</option>
        <option value="omar">Omar Hassan (omar)</option>
      </select></label>
      <label>Password <input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
      <button disabled={pending}>{pending ? "Signing in…" : "Sign in"}</button>
      {error && <p role="alert">{error}</p>}
    </form>
  </section>;
}
