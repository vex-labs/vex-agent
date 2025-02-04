import { DEPLOYMENT_URL } from "vercel-url";

const ACCOUNT_ID = process.env.ACCOUNT_ID;
const BITTE_CONFIG = JSON.parse(process.env.BITTE_CONFIG || "{}");

// Plugin url set in BITTE_CONFIG by make-agent during development
const debugPluginUrl = BITTE_CONFIG.url;

// Set the plugin url in order of BITTE_CONFIG, env, DEPLOYMENT_URL (used for Vercel deployments)
const PLUGIN_URL = debugPluginUrl || DEPLOYMENT_URL;

if (!PLUGIN_URL) {
  console.error(
    "!!! Plugin URL not found in env, BITTE_CONFIG or DEPLOYMENT_URL !!!"
  );
  process.exit(1);
}

export { ACCOUNT_ID, PLUGIN_URL };
