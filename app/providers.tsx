"use client";
import { config, queryClient, uiConfig } from "@/config";
import { AlchemyAccountProvider } from "@alchemy/aa-alchemy/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren, Suspense } from "react";

export const Providers = (props: PropsWithChildren<{}>) => {
  return (
    <Suspense>
      <QueryClientProvider client={queryClient}>
        <AlchemyAccountProvider
          config={config}
          queryClient={queryClient}
          uiConfig={uiConfig}
        >
          {props.children}
        </AlchemyAccountProvider>
      </QueryClientProvider>
    </Suspense>
  );
};
