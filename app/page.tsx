"use client";

import { UserCard } from "@/components/UserCard";
import { uiConfig } from "@/config";
import { AuthCard, useSignerStatus, useUser } from "@alchemy/aa-alchemy/react";

export default function Home() {
  const signerStatus = useSignerStatus();
  const user = useUser();

  return (
    <main className="flex min-h-screen flex-col items-center p-24 gap-4 justify-center">
      {signerStatus.isInitializing ? (
        <span className="daisy-loading daisy-loading-ring daisy-loading-lg"></span>
      ) : user == null ? (
        <div className="daisy-card bg-base-100 shadow-xl w-[420px] max-w-[420px]">
          <div className="daisy-card-body">
            <AuthCard {...uiConfig?.auth} />
          </div>
        </div>
      ) : (
        <UserCard />
      )}
    </main>
  );
}
