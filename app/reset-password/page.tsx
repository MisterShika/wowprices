// app/reset-password/page.tsx

"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setMessage("");
    setError("");

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    setMessage("Password updated successfully.");
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-mist-800 p-8 rounded-lg flex flex-col gap-4"
      >
        <h1 className="text-2xl font-bold text-yellow-400">
          Reset Password
        </h1>

        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-white text-black p-2 rounded"
          required
        />

        <button
          type="submit"
          className="bg-yellow-400 text-gray-800 font-bold p-2 rounded"
        >
          Update Password
        </button>

        {message && (
          <p className="text-green-400">{message}</p>
        )}

        {error && (
          <p className="text-red-400">{error}</p>
        )}
      </form>
    </main>
  );
}