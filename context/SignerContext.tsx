"use client";

import { publicClient } from "@/client";
import {
  MultiOwnerModularAccount,
  createMultiOwnerModularAccount,
} from "@alchemy/aa-accounts";
import {
  AlchemySigner,
  AlchemySignerClient,
  AlchemySignerParams,
  AlchemySignerStatus,
  User,
} from "@alchemy/aa-alchemy";
import { sepolia } from "@alchemy/aa-core";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { custom } from "viem";

type SignerContextType = {
  signer: AlchemySigner;
  account?: MultiOwnerModularAccount<AlchemySigner> | null;
  user?: User | null;
  isLoadingUser: boolean;
};

const SignerContext = createContext<SignerContextType | undefined>(undefined);

export const useSignerContext = (): SignerContextType => {
  const context = useContext(SignerContext);

  if (context === undefined) {
    throw new Error("useSignerContext must be used within a SignerContext");
  }

  return context;
};

export const SignerContextProvider = ({
  children,
  ...signerConfig
}: PropsWithChildren<{
  client: Exclude<AlchemySignerParams["client"], AlchemySignerClient>;
  sessionConfig?: AlchemySignerParams["sessionConfig"];
}>) => {
  const [userState, setUserState] = useState<{
    user: User;
    account: MultiOwnerModularAccount<AlchemySigner>;
  } | null>(null);
  const [status, setStatus] = useState<AlchemySignerStatus>(
    AlchemySignerStatus.INITIALIZING
  );

  const [signer] = useState<AlchemySigner | undefined>(() => {
    if (typeof window === "undefined") return undefined;

    const iframeContainer = document.createElement("div");
    iframeContainer.id = signerConfig.client.iframeConfig.iframeContainerId;
    iframeContainer.style.display = "none";
    document.body.appendChild(iframeContainer);

    return new AlchemySigner(signerConfig);
  });

  const params = useSearchParams();

  // we use this mutation so we can get the loading state of the account creation
  // the signer state only gives us the state of the user fetching
  const { mutateAsync: createAccount, isPending } = useMutation({
    mutationFn: async () => {
      return createMultiOwnerModularAccount({
        transport: custom(publicClient),
        chain: sepolia,
        signer: signer!,
      });
    },
  });

  // register state change listeners for the signer
  useEffect(() => {
    if (!signer) return;

    const removeConnectedListener = signer.on("connected", async (user) => {
      setUserState({
        user,
        account: await createAccount(),
      });
    });

    const removeDisconnectListener = signer.on("disconnected", () => {
      setUserState(null);
    });

    // this is mainly used for loading states
    const removeStatusChangedListener = signer.on("statusChanged", (status) => {
      setStatus(status);
    });

    return () => {
      removeConnectedListener();
      removeDisconnectListener();
      removeStatusChangedListener();
    };
  }, [createAccount, signer]);

  // Look for the bundle in the URL and authenticate the user if it exists
  useEffect(() => {
    if (params.get("bundle") != null && !userState) {
      signer!.authenticate({
        type: "email",
        bundle: params.get("bundle")!,
      });
    }
  }, [params, signer, userState]);

  return (
    <SignerContext.Provider
      value={{
        signer: signer!,
        user: userState?.user ?? null,
        account: userState?.account ?? null,
        isLoadingUser:
          isPending ||
          status === AlchemySignerStatus.INITIALIZING ||
          status === AlchemySignerStatus.AUTHENTICATING,
      }}
    >
      {children}
    </SignerContext.Provider>
  );
};
