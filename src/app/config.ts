import { DEPLOYMENT_URL } from "vercel-url";

const ACCOUNT_ID = process.env.ACCOUNT_ID;
const USDC_CONTRACT = "usdc.betvex.testnet";
const VEX_TOKEN_CONTRACT = "token.betvex.testnet";
const VEX_CONTRACT = "vex-contract-12.testnet";

// Set the plugin url in order of BITTE_CONFIG, env, DEPLOYMENT_URL (used for Vercel deployments)
const PLUGIN_URL = DEPLOYMENT_URL || `${process.env.NEXT_PUBLIC_HOST || 'localhost'}:${process.env.PORT || 3000}`;

if (!PLUGIN_URL) {
  console.error(
    "!!! Plugin URL not found in env, BITTE_CONFIG or DEPLOYMENT_URL !!!"
  );
  process.exit(1);
}

export { ACCOUNT_ID, PLUGIN_URL, USDC_CONTRACT, VEX_TOKEN_CONTRACT, VEX_CONTRACT };
