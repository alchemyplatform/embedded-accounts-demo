import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    API_KEY: z.string(),
    ALCHEMY_API_URL: z.string().url(),
    ALCHEMY_RPC_URL: z.string().url(),
    ROOT_ORG_ID: z.string().default("3121a8a0-c548-4d14-a313-630c3b739858"),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_ROOT_ORG_ID: z
      .string()
      .default("3121a8a0-c548-4d14-a313-630c3b739858"),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    API_KEY: process.env.API_KEY,
    ALCHEMY_API_URL: process.env.ALCHEMY_API_URL,
    ALCHEMY_RPC_URL: process.env.ALCHEMY_RPC_URL,
    ROOT_ORG_ID: process.env.ROOT_ORG_ID,
    NEXT_PUBLIC_ROOT_ORG_ID: process.env.ROOT_ORG_ID,
  },
});
