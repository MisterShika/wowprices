
import AuthGate from "@/components/AuthGate";
import MyLists from "@/components/MyLists";

export default function ListsPage() {
  return (
    <AuthGate>
      <MyLists />
    </AuthGate>
  );
}
