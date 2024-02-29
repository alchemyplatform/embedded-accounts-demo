"use client";
import { SignerContextProvider } from "@/context/SignerContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren, useState } from "react";

const TurnkeyIframeContainerId = "turnkey-iframe-container-id";
const TurnkeyIframeElementId = "turnkey-iframe-element-id";

export const Providers = (props: PropsWithChildren) => {
  const [queryClient] = useState(() => new QueryClient());
  const [clientConfig] = useState({
    connection: {
      rpcUrl: "/api/rpc",
    },
    iframeConfig: {
      iframeContainerId: TurnkeyIframeContainerId,
      iframeElementId: TurnkeyIframeElementId,
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <SignerContextProvider client={clientConfig}>
        {props.children}
      </SignerContextProvider>
    </QueryClientProvider>
  );
};
