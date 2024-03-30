"use client";

import { LoginSignupCard } from "@/components/LoginSignupCard";
import { UserCard } from "@/components/UserCard";
import { useAccount, useSignerStatus } from "@alchemy/aa-alchemy/react";

export default function Home() {
  const signerStatus = useSignerStatus();
  const { account } = useAccount({
    type: "MultiOwnerModularAccount",
  });

  return (
    <main className="flex min-h-screen flex-col items-center p-24 gap-4 justify-center">
      {signerStatus.isInitializing ? (
        <span className="loading loading-ring loading-lg"></span>
      ) : account == null ? (
        <LoginSignupCard />
      ) : (
        <UserCard />
      )}
    </main>
  );
}
