export function getItemIconUrl(icon: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/items-icons/${icon}.jpg`;
}