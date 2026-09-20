"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cinzelDecorative } from "@/app/fonts";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    // Login successful
    router.refresh();
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-mist-800">
      <h1
        className={`text-4xl md:text-6xl text-center font-bold text-yellow-400 ${cinzelDecorative.className} [text-shadow:0_0_8px_#facc15] tracking-wide animate-glow`}
      >
        The
        <br /> Moneymaker
      </h1>

      <form
        onSubmit={handleLogin}
        className="flex flex-col items-center justify-center mt-8 space-y-4 bg-mist-700 p-8 rounded-lg shadow-md"
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-white px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-white px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
        />

        <button
          type="submit"
          className="px-4 py-2 bg-yellow-400 text-gray-800 font-bold rounded-md hover:bg-yellow-500"
        >
          Login
        </button>

        {error && (
          <p className="text-red-400 text-sm text-center">
            {error}
          </p>
        )}
      </form>
    </main>
  );
}