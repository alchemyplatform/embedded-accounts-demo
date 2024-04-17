"use client";
import {
  useAddPasskey,
  useBundlerClient,
  useExportAccount,
  useLogout,
  useSignMessage,
  useSmartAccountClient,
  useUser,
} from "@alchemy/aa-alchemy/react";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { useCallback, useState } from "react";
import { z } from "zod";

export const UserCard = () => {
  const bundlerClient = useBundlerClient();
  const { client, isLoadingClient } = useSmartAccountClient({
    type: "MultiOwnerModularAccount",
  });
  const user = useUser();

  const { signMessageAsync, signedMessage } = useSignMessage({ client });
  const [isValid, setIsValid] = useState<boolean>(false);
  const signMessageAndVerify = useCallback(
    async ({ message }: { message: string }) => {
      if (!client) {
        return;
      }

      const signature = await signMessageAsync({ message });
      const isValid = await bundlerClient.verifyMessage({
        message,
        signature,
        address: client.getAddress(),
      });

      setIsValid(isValid);

      return { signature, isValid };
    },
    [bundlerClient, client, signMessageAsync]
  );

  const { exportAccount, isExporting, isExported, ExportAccountComponent } =
    useExportAccount();

  const { addPasskey } = useAddPasskey();

  const { logout } = useLogout({ onSuccess: window.location.reload });

  const form = useForm({
    defaultValues: {
      message: "",
    },
    validatorAdapter: zodValidator,
    onSubmit: ({ value }) => signMessageAndVerify({ message: value.message }),
  });

  return (
    <div className="card bg-base-100 shadow-xl w-[500px] max-w-[500px]">
      <div className="card-body gap-5">
        <div className="flex flex-row justify-between">
          <h2 className="card-title">Welcome back!</h2>
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
                <label className="form-control w-full flex flex-col gap-2">
                  <strong>Sign Message</strong>
                  <div className="flex flex-row gap-2">
                    <textarea
                      placeholder="Type here"
                      className="textarea textarea-bordered w-full"
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
                  className="btn"
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
            className="w-full"
            iframeCss={{
              boxSizing: "border-box",
              width: "100%",
              height: "120px",
              borderRadius: "8px",
              borderWidth: "1px",
              borderStyle: "solid",
              borderColor: "rgba(216, 219, 227, 1)",
              padding: "20px",
            }}
            isExported={isExported}
          />
        </div>
      </div>
    </div>
  );
};
