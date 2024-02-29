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
  User,
} from "@alchemy/aa-alchemy";
import { sepolia } from "@alchemy/aa-core";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { PropsWithChildren, createContext, useContext, useState } from "react";
import { custom } from "viem";

type SignerContextType = {
  signer: AlchemySigner;
  account?: MultiOwnerModularAccount<AlchemySigner> | null;
  user?: User | null;
  isLoadingUser: boolean;
  refetchUserDetails: () => void;
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
  const [signer] = useState<AlchemySigner | undefined>(() => {
    if (typeof window === "undefined") return undefined;

    const iframeContainer = document.createElement("div");
    iframeContainer.id = signerConfig.client.iframeConfig.iframeContainerId;
    iframeContainer.style.display = "none";
    document.body.appendChild(iframeContainer);

    return new AlchemySigner(signerConfig);
  });

  const params = useSearchParams();

  // TODO: the refetch logic should be moved into the context here
  const {
    data = { user: null, account: null },
    isLoading: isLoadingUser,
    refetch: refetchUserDetails,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      if (params.get("bundle") != null) {
        await signer!.authenticate({
          type: "email",
          bundle: params.get("bundle")!,
        });
      }

      // this only ever runs on the client, so we can assume the signer is defined
      const user = await signer!.getAuthDetails().catch(() => {
        return null;
      });

      const account = user
        ? await createMultiOwnerModularAccount({
            transport: custom(publicClient),
            chain: sepolia,
            signer: signer!,
          })
        : null;

      return {
        account,
        user,
      };
    },
  });

  return (
    <SignerContext.Provider
      value={{
        signer: signer!,
        user: data.user,
        account: data.account,
        isLoadingUser,
        refetchUserDetails,
      }}
    >
      {children}
    </SignerContext.Provider>
  );
};
