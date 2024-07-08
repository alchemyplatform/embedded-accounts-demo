import { cookieStorage } from "@account-kit/core";
import { sepolia } from "@account-kit/infra";
import { createConfig } from "@account-kit/react";
import { QueryClient } from "@tanstack/react-query";

export const config = createConfig(
  {
    // required
    rpcUrl: "/api/rpc",
    chain: sepolia,
    ssr: true,
    storage: cookieStorage,
    sessionConfig: {
      expirationTimeMs: 1000 * 60 * 60 * 24 * 180, // 180 days
    },
  },
  {
    auth: {
      sections: [
        [{ type: "email" }],
        [{ type: "passkey" }, { type: "injected" }],
      ],
      addPasskeyOnSignup: true,
    },
  }
);

export const queryClient = new QueryClient();
