import Image from "next/image";
import AuthGate from "@/components/AuthGate";
import ItemSelect from "@/components/ItemSelect";
import InviteRedirect from "@/components/InviteRedirect";

export default function Home() {
  return (
    <>
    <InviteRedirect />
    <AuthGate>
      <main
        className="flex min-h-screen flex-col items-center justify-between p-24"
      >
        <ItemSelect />
      </main>
    </AuthGate>
    </>
  );
}