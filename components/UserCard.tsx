"use client";
import {
  useBundlerClient,
  useSigner,
  useSmartAccountClient,
  useUser,
} from "@alchemy/aa-alchemy/react";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";

const TurnkeyExportWalletContainerId = "turnkey-export-wallet-container-id";
const TurnkeyExportWalletElementId = "turnkey-export-wallet-element-id";

const iframeCss = `
iframe {
    box-sizing: border-box;
    width: 100%;
    height: 120px;
    border-radius: 8px;
    border-width: 1px;
    border-style: solid;
    border-color: rgba(216, 219, 227, 1);
    padding: 20px;
}
`;

export const UserCard = () => {
  const bundlerClient = useBundlerClient();
  const signer = useSigner();
  const { client, isLoadingClient } = useSmartAccountClient({
    type: "MultiOwnerModularAccount",
  });
  const user = useUser();

  const { mutate: signMessage, data: { signature, isValid } = {} } =
    useMutation({
      mutationFn: async (msg: string) => {
        if (!client) throw new Error("Provider not found");

        return client
          .signMessageWith6492({ message: msg })
          .then(async (signature) => {
            return {
              signature,
              isValid: await bundlerClient
                .verifyMessage({
                  address: client.getAddress(),
                  message: msg,
                  signature,
                })
                .catch((e: any) => {
                  console.log("error verifying signature, ", e);
                  return false;
                }),
            };
          });
      },
    });

  // TODO: we need to add this as a hook
  const { mutate, isPending, data } = useMutation({
    mutationFn: async () =>
      signer?.exportWallet({
        iframeContainerId: TurnkeyExportWalletContainerId,
        iframeElementId: TurnkeyExportWalletElementId,
      }),
  });

  // TODO: we need to add this as a hook
  const { mutate: addPasskey } = useMutation({
    mutationFn: async () => signer?.addPasskey({}),
    onSuccess: (data) => {
      console.log(data);
    },
  });

  // TODO: we need to add this as a hook
  const { mutate: logout } = useMutation({
    mutationFn: async () => signer?.disconnect(),
  });

  const form = useForm({
    defaultValues: {
      message: "",
    },
    validatorAdapter: zodValidator,
    onSubmit: ({ value }) => signMessage(value.message),
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
        {signature && (
          <>
            <div className="flex flex-col">
              <strong>Signature</strong>
              <code className="break-words">{signature}</code>
            </div>
            <div className="flex flex-col">
              <strong>Is Valid?</strong>
              <code>{String(isValid)}</code>
            </div>
          </>
        )}
        <div className="flex flex-col gap-2">
          {!data ? (
            <button onClick={() => mutate()} disabled={isPending}>
              Export Wallet
            </button>
          ) : (
            <strong>Seed Phrase</strong>
          )}
          <div
            className="w-full"
            style={{ display: !data ? "none" : "block" }}
            id={TurnkeyExportWalletContainerId}
          >
            <style>{iframeCss}</style>
          </div>
        </div>
      </div>
    </div>
  );
};
