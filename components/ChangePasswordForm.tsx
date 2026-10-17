"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ChangePasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw error;

      setPassword("");
      setConfirmPassword("");
      setSuccess("Your password has been changed successfully.");
    } catch (err) {
      console.error("Error changing password:", err);
      setError("Unable to change your password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-lg border border-mist-700 bg-mist-800 p-5">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm text-gray-300"
          >
            New Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={6}
            disabled={loading}
            className="w-full rounded border border-mist-700 bg-mist-900 px-3 py-2 text-white focus:border-yellow-400 focus:outline-none disabled:opacity-60"
          />
        </div>

        <div>
          <label
            htmlFor="confirm-password"
            className="mb-2 block text-sm text-gray-300"
          >
            Confirm New Password
          </label>
          <input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            minLength={6}
            disabled={loading}
            className="w-full rounded border border-mist-700 bg-mist-900 px-3 py-2 text-white focus:border-yellow-400 focus:outline-none disabled:opacity-60"
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-400">
            {error}
          </p>
        )}

        {success && (
          <p role="status" className="text-sm text-green-400">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !password || !confirmPassword}
          className="rounded bg-yellow-400 px-5 py-2 font-semibold text-mist-900 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Updating..." : "Change Password"}
        </button>
      </form>
    </section>
  );
}