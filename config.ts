import { cookieStorage, createConfig } from "@alchemy/aa-alchemy/config";
import { AlchemyAccountsProviderProps } from "@alchemy/aa-alchemy/react";
import { sepolia } from "@alchemy/aa-core";
import { QueryClient } from "@tanstack/react-query";

export const config = createConfig({
  // required
  rpcUrl: "/api/rpc",
  chain: sepolia,
  ssr: true,
  storage: cookieStorage,
  sessionConfig: {
    expirationTimeMs: 1000 * 60 * 60 * 24 * 180, // 180 days
  },
});

export const uiConfig: AlchemyAccountsProviderProps["uiConfig"] = {
  auth: {
    sections: [
      [{ type: "email" }],
      [{ type: "passkey" }, { type: "injected" }],
    ],
    addPasskeyOnSignup: true,
  },
};

export const queryClient = new QueryClient();
