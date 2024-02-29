import { createBundlerClient, sepolia } from "@alchemy/aa-core";
import { http } from "viem";

export const publicClient = createBundlerClient({
  chain: sepolia,
  transport: http("/api/rpc"),
});
