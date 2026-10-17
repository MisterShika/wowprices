import AuthGate from "@/components/AuthGate";
import Header from "@/components/Header";
import ChangePasswordForm from "@/components/ChangePasswordForm";

export default function ChangePasswordPage() {
  return (
    <AuthGate>
      <main>
        <Header />

        <div className="mx-auto max-w-5xl p-4">
          <h1 className="mb-6 text-3xl font-bold text-yellow-400">
            Change Password
          </h1>

          <ChangePasswordForm />
        </div>
      </main>
    </AuthGate>
  );
}