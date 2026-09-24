"use client";

import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="admin-card items-center text-center max-w-sm w-full">
        <h1 className="font-tingtong text-4xl text-white">Vanillaine</h1>
        <p className="admin-hint">Login pakai akun Google kamu untuk edit isi card.</p>
        <button
          className="admin-btn-primary w-full justify-center flex items-center gap-2 py-2.5"
          onClick={() => authClient.signIn.social({ provider: "google", callbackURL: "/" })}
        >
          <i className="fa-brands fa-google"></i> Sign in with Google
        </button>
      </div>
    </div>
  );
}
