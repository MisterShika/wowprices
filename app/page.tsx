import Image from "next/image";
import AuthGate from "@/components/AuthGate";
import ItemSelect from "@/components/ItemSelect";

export default function Home() {
  return (
    <AuthGate>
      <main
        className="flex min-h-screen flex-col items-center justify-between p-24"
      >
        <ItemSelect />
      </main>
    </AuthGate>
  );
}