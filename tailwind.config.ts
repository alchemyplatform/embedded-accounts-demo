import { withAccountKitUi } from "@alchemy/aa-alchemy/tailwind";

const config = withAccountKitUi({
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-1": "linear-gradient(125deg, #ff9c27 0%, #fd48ce 51.7%)",
        "gradient-2":
          "linear-gradient(120deg, #5498ff 26.44%, #a131f9 109.11%)",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    prefix: "daisy-",
  },
});

export default config;
