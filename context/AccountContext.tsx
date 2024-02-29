"use client";

import { publicClient } from "@/client";
import type { MultiOwnerModularAccount } from "@alchemy/aa-accounts";
import {
  AlchemySigner,
  createAlchemySmartAccountClient,
} from "@alchemy/aa-alchemy";
import { PropsWithChildren, createContext, useContext, useState } from "react";
import type { Chain, Transport } from "viem";

type AccountContextType = {
  provider: ReturnType<
    typeof createAlchemySmartAccountClient<
      Transport,
      Chain,
      MultiOwnerModularAccount<AlchemySigner>
    >
  >;
};

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const useAccountContext = () => {
  const context = useContext(AccountContext);

  if (context === undefined) {
    throw new Error("useAccountContext must be used within a AccountProvider");
  }

  return context;
};

type CreateContextProviderProps = {
  account: MultiOwnerModularAccount<AlchemySigner>;
};

export const AccountContextProvider = ({
  children,
  account,
}: PropsWithChildren<CreateContextProviderProps>) => {
  const [provider] = useState(() => {
    if (typeof document === "undefined") return undefined;

    return createAlchemySmartAccountClient({
      chain: publicClient.chain,
      rpcUrl: "/api/rpc",
      account,
    });
  });

  return (
    <AccountContext.Provider value={{ provider: provider! }}>
      {children}
    </AccountContext.Provider>
  );
};
