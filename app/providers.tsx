"use client";
import { SignerContextProvider } from "@/context/SignerContext";
import { env } from "@/env.mjs";
import { AlchemySignerClient, AlchemySignerParams } from "@alchemy/aa-alchemy";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren, Suspense, useState } from "react";

const TurnkeyIframeContainerId = "turnkey-iframe-container-id";
const TurnkeyIframeElementId = "turnkey-iframe-element-id";

export const Providers = (props: PropsWithChildren) => {
  const [queryClient] = useState(() => new QueryClient());
  const [clientConfig] = useState<
    Exclude<AlchemySignerParams["client"], AlchemySignerClient>
  >({
    connection: {
      rpcUrl: "/api/rpc",
    },
    iframeConfig: {
      iframeContainerId: TurnkeyIframeContainerId,
      iframeElementId: TurnkeyIframeElementId,
    },
    rootOrgId:
      typeof window !== "undefined" ? env.NEXT_PUBLIC_ROOT_ORG_ID : undefined,
  });

  return (
    <Suspense>
      <QueryClientProvider client={queryClient}>
        <SignerContextProvider client={clientConfig}>
          {props.children}
        </SignerContextProvider>
      </QueryClientProvider>
    </Suspense>
  );
};
