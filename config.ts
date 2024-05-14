import { createConfig } from "@alchemy/aa-alchemy/config";
import { AlchemyAccountsProviderProps } from "@alchemy/aa-alchemy/react";
import { sepolia } from "@alchemy/aa-core";
import { QueryClient } from "@tanstack/react-query";

export const config = createConfig({
  // required
  rpcUrl: "/api/rpc",
  chain: sepolia,
  ssr: true,
});

export const uiConfig: AlchemyAccountsProviderProps["uiConfig"] = {
  auth: {
    sections: [[{ type: "email" }], [{ type: "passkey" }]],
    addPasskeyOnSignup: true,
  },
};

export const queryClient = new QueryClient();
