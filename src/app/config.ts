import { DEPLOYMENT_URL } from "vercel-url";
import { keyStores, KeyPair, connect } from "near-api-js";
import { KeyPairString } from "near-api-js/lib/utils";

const ACCOUNT_ID = process.env.ACCOUNT_ID;
const USDC_CONTRACT = "usdc.betvex.testnet";
const VEX_TOKEN_CONTRACT = "token.betvex.testnet";
const BETVEX_CONTRACT = "vex-contract-12.testnet";
const REF_FINANCE_CONTRACT = "ref-finance-101.testnet";
const VEX_USDC_POOL_ID = 2197;
const RPC_URL = "https://test.rpc.fastnear.com";
const RELAYER_ACCOUNT_ID = process.env.RELAYER_ACCOUNT_ID;
const RELAYER_PRIVATE_KEY = process.env.RELAYER_PRIVATE_KEY;

// Initialize NEAR connection
const myKeyStore = new keyStores.InMemoryKeyStore();
if (RELAYER_ACCOUNT_ID && RELAYER_PRIVATE_KEY) {
  const keyPair = KeyPair.fromString(RELAYER_PRIVATE_KEY as KeyPairString);
  await myKeyStore.setKey("testnet", RELAYER_ACCOUNT_ID, keyPair);
}

const connectionConfig = {
  networkId: "testnet",
  keyStore: myKeyStore,
  nodeUrl: RPC_URL,
};

const nearConnection = await connect(connectionConfig);

// Set the plugin url in order of BITTE_CONFIG, env, DEPLOYMENT_URL (used for Vercel deployments)
const PLUGIN_URL = DEPLOYMENT_URL || `${process.env.NEXT_PUBLIC_HOST || 'localhost'}:${process.env.PORT || 3000}`;

if (!PLUGIN_URL) {
  console.error(
    "!!! Plugin URL not found in env, BITTE_CONFIG or DEPLOYMENT_URL !!!"
  );
  process.exit(1);
}

export { 
  ACCOUNT_ID, 
  PLUGIN_URL, 
  USDC_CONTRACT, 
  VEX_TOKEN_CONTRACT, 
  BETVEX_CONTRACT,
  REF_FINANCE_CONTRACT,
  VEX_USDC_POOL_ID,
  RPC_URL,
  nearConnection,
  RELAYER_ACCOUNT_ID
};
