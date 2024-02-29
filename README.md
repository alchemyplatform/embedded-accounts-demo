This is an example of an Alchemy Embedded Account using an Alchemy Signer to enable secure auth and transaction flows using ERC-4337 smart accounts! Learn more in our [docs](https://accountkit.alchemy.com/signers/alchemy-signer.html).

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Setup

Create your own `.env` file by copying the `.sample.env` file.

To use the Alchemy Signer in this demo, you will need to:

1. Create an Alchemy App and get your API Key. Go to the [Alchemy Dashboard](https://dashboard.alchemy.com/signup/?a=aa-docs). Create a new app on Ethereum Sepolia. Access your credentials for this app then paste the API KEY and the RPC URL in to the `.env` file.

<img src="/images/alchemy-dashboard.png" width="auto" height="auto" alt="Account Kit Overview" style="display: block; margin: auto;">

2. Create a new account config in your [Alchemy Accounts Manager Dashbord](https://dashboard.alchemy.com/accounts). Make sure to set the redirect url to http://localhost:3000 for testing this demo and connect this to the app you made in step 1.

<img src="/images/alchemy-accounts-dashboard.png" width="auto" height="auto" alt="Create new embedded account config" style="display: block; margin: auto;">

The account config allows you to customize the signup and login authentication email that will be sent to users when logging in to your dapp. Apply the config to the app your created in the step above.

<img src="/images/create-account-config.png" width="auto" height="auto" alt="Account Kit Overview" style="display: block; margin: auto;">

## Getting Started

Make sure you are using Node.js version >= 18.17.0.

Install dependencies:

```bash
npm install
# or
yarn install
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
