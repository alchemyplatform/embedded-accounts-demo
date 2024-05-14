"use client";
import {
  useAddPasskey,
  useBundlerClient,
  useExportAccount,
  useLogout,
  useSigner,
  useSignMessage,
  useSmartAccountClient,
  useUser,
} from "@alchemy/aa-alchemy/react";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import React, { useState } from "react";
import { isHex } from "viem";
import { z } from "zod";

const TurnkeyExportWalletContainerId = "turnkey-export-wallet-container-id";
const TurnkeyExportWalletElementId = "turnkey-export-wallet-element-id";

const iframeCss: React.CSSProperties = {
  boxSizing: "border-box",
  width: "100%",
  height: "120px",
  borderRadius: "8px",
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "rgba(216, 219, 227, 1)",
  padding: "20px",
};

export const UserCard = () => {
  const bundlerClient = useBundlerClient();
  const signer = useSigner();
  const { client, isLoadingClient } = useSmartAccountClient({
    type: "MultiOwnerModularAccount",
  });
  const user = useUser();
  const [isValid, setIsValid] = useState<boolean | undefined>(undefined);

  const { signMessage, signedMessage } = useSignMessage({
    client,
    onSuccess: async (signature, msg) => {
      setIsValid(
        await bundlerClient
          .verifyMessage({
            address: client!.getAddress(),
            message: msg.message,
            signature,
          })
          .catch((e: any) => {
            console.log("error verifying signature, ", e);
            return false;
          })
      );
    },
  });

  const { ExportAccountComponent, exportAccount, isExporting, isExported } =
    useExportAccount({
      params: {
        iframeContainerId: TurnkeyExportWalletContainerId,
        iframeElementId: TurnkeyExportWalletElementId,
      },
    });

  const { addPasskey } = useAddPasskey({
    onSuccess: (data) => {
      console.log(data);
    },
  });

  const { logout } = useLogout();

  const form = useForm({
    defaultValues: {
      message: "",
    },
    validatorAdapter: zodValidator,
    onSubmit: ({ value }) =>
      signMessage({
        message: isHex(value.message) ? { raw: value.message } : value.message,
      }),
  });

  return (
    <div className="daisy-card bg-base-100 shadow-xl w-[500px] max-w-[500px]">
      <div className="daisy-card-body gap-5">
        <div className="flex flex-row justify-between">
          <h2 className="daisy-card-title">Welcome back!</h2>
          <button onClick={() => logout()}>Logout</button>
        </div>
        <div className="flex flex-col justify-left">
          <div className="flex flex-row gap-2">
            <strong>Email</strong>
            <button onClick={() => addPasskey()}>[Add Passkey]</button>
          </div>
          <div className="flex flex-row gap-2">
            <code className="break-words">{user!.email}</code>
          </div>
        </div>
        <div className="flex flex-col">
          <strong>Account Address</strong>
          <code className="break-words">{client?.account.address}</code>
        </div>
        <div className="flex flex-col">
          <strong>Signer Address</strong>
          <code className="break-words">{user!.address}</code>
        </div>
        <form.Provider>
          <form
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              width: "100%",
            }}
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              void form.handleSubmit();
            }}
          >
            <form.Field
              name="message"
              validators={{
                onBlur: z.string(),
              }}
            >
              {(field) => (
                <label className="daisy-form-control w-full flex flex-col gap-2">
                  <strong>Sign Message</strong>
                  <div className="flex flex-row gap-2">
                    <textarea
                      placeholder="Type here"
                      className="daisy-textarea daisy-textarea-bordered w-full"
                      name={field.name}
                      value={field.state.value ?? ""}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    ></textarea>
                  </div>
                </label>
              )}
            </form.Field>
            <form.Subscribe>
              {({ canSubmit, isSubmitting }) => (
                <button
                  className="daisy-btn"
                  disabled={!canSubmit || isSubmitting || isLoadingClient}
                  type="submit"
                >
                  Submit
                </button>
              )}
            </form.Subscribe>
          </form>
        </form.Provider>
        {signedMessage && (
          <>
            <div className="flex flex-col">
              <strong>Signature</strong>
              <code className="break-words">{signedMessage}</code>
            </div>
            <div className="flex flex-col">
              <strong>Is Valid?</strong>
              <code>{String(isValid)}</code>
            </div>
          </>
        )}
        <div className="flex flex-col gap-2">
          {!isExported ? (
            <button onClick={() => exportAccount()} disabled={isExporting}>
              Export Wallet
            </button>
          ) : (
            <strong>Seed Phrase</strong>
          )}
          <ExportAccountComponent
            iframeCss={iframeCss}
            className="w-full"
            isExported={isExported}
          />
        </div>
      </div>
    </div>
  );
};
