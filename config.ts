import { cookieStorage, createConfig } from "@account-kit/core";
import { sepolia } from "@account-kit/infra";
import { AlchemyAccountsProviderProps } from "@account-kit/react";
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
