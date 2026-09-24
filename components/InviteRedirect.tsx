"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function InviteRedirect() {
  const router = useRouter();

  useEffect(() => {
    async function checkInvite() {
      // The invite link arrives with type=invite in the URL hash.
      const hash = window.location.hash;

      if (!hash.includes("type=invite")) {
        return;
      }

      // Give Supabase a moment to process the invitation session.
      await new Promise((resolve) => setTimeout(resolve, 500));

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        router.replace("/setup-account");
      }
    }

    checkInvite();
  }, [router]);

  return null;
}