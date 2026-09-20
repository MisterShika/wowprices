import { createSupabaseServerClient } from "@/lib/supabase-server";

type Props = {
  itemId: number;
};

function formatPrice(copper: number) {
  const gold = Math.floor(copper / 10000);
  const silver = Math.floor((copper % 10000) / 100);
  const remainingCopper = copper % 100;

  return `${gold}g ${silver}s ${remainingCopper}c`;
}

export default async function MostRecentSubmissions({
  itemId,
}: Props) {
  const supabase = await createSupabaseServerClient();

  const { data: submissions, error } = await supabase
    .from("price_checks")
    .select("id, sale_price, created_at, user_id")
    .eq("item_id", itemId)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    return (
      <div className="bg-mist-800 text-red-400 p-4 rounded-md">
        Error loading submissions: {error.message}
      </div>
    );
  }

  // Get the profiles for the users who submitted these prices
  const userIds = [...new Set(submissions.map((submission) => submission.user_id))];

  const { data: profiles, error: profileError } = await supabase
    .from("profiles")
    .select("id, display_name")
    .in("id", userIds);

  if (profileError) {
    return (
      <div className="bg-mist-800 text-red-400 p-4 rounded-md">
        Error loading profiles: {profileError.message}
      </div>
    );
  }

  const profileMap = new Map(
    profiles.map((profile) => [profile.id, profile.display_name])
  );

  return (
    <div className="bg-mist-800 text-white p-4 rounded-md">
      <h2 className="text-xl font-bold mb-4">
        Most Recent Submissions
      </h2>

      {submissions.length === 0 ? (
        <p className="text-gray-400">
          No price submissions yet.
        </p>
      ) : (
        <div className="space-y-2">
          {submissions.map((submission) => (
            <div
              key={submission.id}
              className="flex justify-between items-center"
            >
              <div>
                <span className="font-semibold">
                  {formatPrice(submission.sale_price)}
                </span>

                <span className="ml-3 text-sm text-gray-400">
                  {profileMap.get(submission.user_id) ?? "Unknown User"}
                </span>
              </div>

              <span className="text-sm text-gray-400">
                {new Date(submission.created_at).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}