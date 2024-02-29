"use client";

import { LoginSignupCard } from "@/components/LoginSignupCard";
import { UserCard } from "@/components/UserCard";
import { AccountContextProvider } from "@/context/AccountContext";
import { useSignerContext } from "@/context/SignerContext";

export default function Home() {
  const { signer, account, isLoadingUser, refetchUserDetails } =
    useSignerContext();

  return (
    <main className="flex min-h-screen flex-col items-center p-24 gap-4 justify-center">
      {isLoadingUser ? (
        <span className="loading loading-ring loading-lg"></span>
      ) : account == null ? (
        <LoginSignupCard signer={signer} onLogin={refetchUserDetails} />
      ) : (
        <AccountContextProvider account={account}>
          <UserCard />
        </AccountContextProvider>
      )}
    </main>
  );
}
