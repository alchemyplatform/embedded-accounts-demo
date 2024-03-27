"use client";
import { AlchemySigner } from "@alchemy/aa-alchemy";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import EmailBundleForm from "./EmailBundleForm";
import EmailForm from "./EmailForm";

type Props = {
  signer?: AlchemySigner;
};

export const LoginSignupCard = ({ signer }: Props) => {
  const [email, setEmail] = useState<string | undefined>(undefined);

  const { mutate, isPending } = useMutation({
    mutationFn: signer?.authenticate,
    onError: (e) => {
      console.error("Failed to login", e);
    },
  });

  return (
    <div className="card bg-base-100 shadow-xl w-[500px] max-w-[500px]">
      <div className="card-body gap-4">
        <h2 className="card-title">Login / Signup</h2>
        {email && isPending ? (
          // OTP bundle input
          <EmailBundleForm
            onSubmit={(bundle) => {
              // resolve(bundle);
            }}
          />
        ) : (
          // email input
          <>
            <EmailForm
              onSubmit={(email) => {
                setEmail(email);
                mutate({
                  type: "email",
                  email,
                });
              }}
            />
            <div className="flex flex-row gap-2">
              <button
                onClick={() =>
                  mutate({
                    type: "passkey",
                    createNew: true,
                    username: "Test User",
                  })
                }
              >
                Use New Passkey
              </button>
              <div className="divider divider-horizontal"></div>
              <button
                onClick={() => mutate({ type: "passkey", createNew: false })}
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
