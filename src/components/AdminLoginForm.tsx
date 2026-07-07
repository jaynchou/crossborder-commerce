"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

type ApiResult<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};

export function AdminLoginForm() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("Enter the ADMIN_TOKEN configured for this deployment.");
  const nextPath = searchParams.get("next") ?? "/admin";

  async function login() {
    setMessage("Signing in...");
    const response = await fetch("/api/admin/session", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token })
    });
    const result = (await response.json()) as ApiResult<{ authenticated: boolean }>;

    if (result.ok && result.data?.authenticated) {
      window.location.assign(nextPath);
    } else {
      setMessage(result.error ?? "Unable to sign in.");
    }
  }

  return (
    <main className="adminLoginPage">
      <section className="adminLoginPanel">
        <span className="microLabel">Secure admin</span>
        <h1>Admin sign in</h1>
        <p>Protect catalog, orders, refunds, reviews, and store settings before operational use.</p>
        <label>Admin token
          <input
            autoComplete="current-password"
            type="password"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") login();
            }}
            placeholder="ADMIN_TOKEN"
          />
        </label>
        <button type="button" onClick={login}>Sign in</button>
        <p className="statusText">{message}</p>
      </section>
    </main>
  );
}
