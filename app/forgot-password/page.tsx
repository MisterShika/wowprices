
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setMessage("");
    setError("");
    setSending(true);

    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      {
        redirectTo:
          "https://alwaystiredpriceapp.vercel.app/reset-password",
      }
    );

    setSending(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage("If the account exists, a password recovery email has been requested.");
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-mist-800 p-8 rounded-lg flex flex-col gap-4"
      >
        <h1 className="text-2xl font-bold text-yellow-400">
          Forgot Password
        </h1>

        <p className="text-gray-300">
          Enter your account email to receive a password reset link.
        </p>

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-white text-gray-800 p-2 rounded"
          required
        />

        <button
          type="submit"
          disabled={sending}
          className="bg-yellow-400 text-gray-800 font-bold py-2 rounded disabled:opacity-50"
        >
          {sending ? "Sending..." : "Send Reset Email"}
        </button>

        {message && <p className="text-green-400">{message}</p>}
        {error && <p className="text-red-400">{error}</p>}
      </form>
    </main>
  );
}
