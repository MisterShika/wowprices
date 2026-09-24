"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SetupAccountPage() {
  const router = useRouter();

  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [checking, setChecking] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/");
        return;
      }

      setChecking(false);
    }

    checkUser();
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");

    if (!displayName.trim()) {
      setError("Please enter a display name.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSaving(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError("You are not logged in.");
      setSaving(false);
      return;
    }

    // Set the user's password.
    const { error: passwordError } =
      await supabase.auth.updateUser({
        password,
      });

    if (passwordError) {
      setError(passwordError.message);
      setSaving(false);
      return;
    }

    // Create/update the user's profile.
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        display_name: displayName.trim(),
      });

    if (profileError) {
      setError(profileError.message);
      setSaving(false);
      return;
    }

    router.replace("/");
    router.refresh();
  }

  if (checking) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-300">
          Setting up your account...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-mist-800 p-8 rounded-lg flex flex-col gap-5"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-yellow-400">
            Welcome to WoW Prices
          </h1>

          <p className="text-gray-300 mt-2">
            Set up your account.
          </p>
        </div>

        <div>
          <label
            htmlFor="displayName"
            className="block text-gray-200 mb-2"
          >
            Display Name
          </label>

          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full bg-white text-gray-800 px-3 py-2 rounded-md"
            placeholder="Your display name"
            required
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-gray-200 mb-2"
          >
            Password
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white text-gray-800 px-3 py-2 rounded-md"
            placeholder="Password"
            required
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-gray-200 mb-2"
          >
            Confirm Password
          </label>

          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            className="w-full bg-white text-gray-800 px-3 py-2 rounded-md"
            placeholder="Confirm password"
            required
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="bg-yellow-400 text-gray-800 font-bold py-2 rounded-md hover:bg-yellow-500 disabled:opacity-50"
        >
          {saving ? "Creating Account..." : "Create Account"}
        </button>
      </form>
    </main>
  );
}