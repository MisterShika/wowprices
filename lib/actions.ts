"use server";

import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function deletePriceCheck(priceCheckId: number) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in.");
  }

  const { error } = await supabase
    .from("price_checks")
    .delete()
    .eq("id", priceCheckId)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }
}