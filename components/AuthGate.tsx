import { createSupabaseServerClient } from "@/lib/supabase-server";
import Login from "@/components/Login";

export default async function AuthGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <Login />;
  }

  return <>{children}</>;
}