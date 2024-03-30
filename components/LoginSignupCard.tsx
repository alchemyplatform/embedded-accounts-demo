"use client";
import { useAccount, useAuthenticate } from "@alchemy/aa-alchemy/react";
import { useState } from "react";
import EmailForm from "./EmailForm";

export const LoginSignupCard = () => {
  const [email, setEmail] = useState<string | undefined>(undefined);
  const { authenticate, isPending } = useAuthenticate();
  const { isLoadingAccount } = useAccount({
    type: "MultiOwnerModularAccount",
    skipCreate: true,
  });

  return (
    <div className="card bg-base-100 shadow-xl w-[500px] max-w-[500px]">
      <div className="card-body gap-4">
        <h2 className="card-title">Login / Signup</h2>
        {email && isPending ? (
          <div>Check your email and click the link to complete login</div>
        ) : (
          // email input
          <>
            <EmailForm
              buttonDisabled={isLoadingAccount || isPending}
              onSubmit={(email) => {
                setEmail(email);
                authenticate({
                  type: "email",
                  email,
                });
              }}
            />
            <div className="flex flex-row gap-2">
              <button
                className="btn btn-ghost btn-sm"
                onClick={() =>
                  authenticate({
                    type: "passkey",
                    createNew: true,
                    username: "Test User",
                  })
                }
                disabled={isLoadingAccount || isPending}
              >
                Use New Passkey
              </button>
              <div className="divider divider-horizontal"></div>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() =>
                  authenticate({ type: "passkey", createNew: false })
                }
                disabled={isLoadingAccount || isPending}
              >
                Use Existing Passkey
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
