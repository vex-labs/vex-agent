const { JsonRpcProvider } = require("@near-js/providers");
import { nearConnection, RELAYER_ACCOUNT_ID } from '@/app/config';

const VEX_DECIMALS = 18;
const USDC_DECIMALS = 6;

function cleanupAmount(amount: string): string {
    return amount.replace(/,/g, '').trim();
}

function trimLeadingZeroes(value: string): string {
    return value.replace(/^0+/, '') || '0';
}

function formatWithCommas(value: string): string {
    const pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(value)) {
        value = value.replace(pattern, '$1,$2');
    }
    return value;
}

function trimTrailingZeroes(value: string): string {
    return value.replace(/\.?0+$/, '');
}

export function parseVexAmount(amount: string): string | null {
    try {
        const cleanAmount = cleanupAmount(amount);
        const parsedAmount = (parseFloat(cleanAmount) * Math.pow(10, VEX_DECIMALS)).toString();
        return parsedAmount;
    } catch {
        return null;
    }
}

export function parseUsdcAmount(amt?: string): string | null {
    if (!amt) {
        return null;
    }
    
    amt = cleanupAmount(amt);
    const split = amt.split('.');
    const wholePart = split[0];
    const fracPart = split[1] || '';
    
    if (split.length > 2 || fracPart.length > USDC_DECIMALS) {
        throw new Error(`Cannot parse '${amt}' as USDC amount`);
    }
    
    return trimLeadingZeroes(
        wholePart + fracPart.padEnd(USDC_DECIMALS, '0')
    );
}

export async function fetchNearView(
    accountId: string,
    methodName: string,
    args?: Record<string, any>,
): Promise<any> {
    const provider = new JsonRpcProvider({
        url: "https://test.rpc.fastnear.com",
    });
    const argsBase64 = args
        ? Buffer.from(JSON.stringify(args)).toString("base64")
        : "";
    const viewCallResult = await provider.query({
        request_type: "call_function",
        account_id: accountId,
        args_base64: argsBase64,
        method_name: methodName,
        finality: "optimistic",
    });
    const resultBytes = viewCallResult.result;
    const resultString = String.fromCharCode(...resultBytes);
    return JSON.parse(resultString);
}

export function formatUsdcAmount(balance: string, fracDigits: number = USDC_DECIMALS): string {
    // Convert to number for rounding
    const amount = Number(balance) / Math.pow(10, USDC_DECIMALS);
    
    // Round to specified decimal places
    const rounded = Number(amount.toFixed(fracDigits));
    
    // Convert to string and add commas
    const [wholeStr, fractionStr = ''] = rounded.toString().split('.');
    
    // Ensure fraction has exact number of decimal places
    const paddedFraction = fractionStr.padEnd(fracDigits, '0');
    
    return trimTrailingZeroes(`${formatWithCommas(wholeStr)}.${paddedFraction}`);
}

export function formatVexAmount(balance: string, fracDigits: number = VEX_DECIMALS): string {
    // Convert to number for rounding
    const amount = Number(balance) / Math.pow(10, VEX_DECIMALS);
    
    // Round to specified decimal places
    const rounded = Number(amount.toFixed(fracDigits));
    
    // Convert to string and add commas
    const [wholeStr, fractionStr = ''] = rounded.toString().split('.');
    
    // Ensure fraction has exact number of decimal places
    const paddedFraction = fractionStr.padEnd(fracDigits, '0');
    
    return trimTrailingZeroes(`${formatWithCommas(wholeStr)}.${paddedFraction}`);
}

export function formatUsdcWithDollarSign(balance: string, fracDigits: number = USDC_DECIMALS): string {
    const formatted = formatUsdcAmount(balance, fracDigits);
    return `$${formatted}`;
}

/**
 * Checks if user is registered with token contract and registers them if not
 * @param tokenContract The token contract to check/register with
 * @param accountId The account to check/register
 * @returns Promise<boolean> True if registration was successful or user was already registered
 */
export async function registerUserIfNeeded(
  tokenContract: string,
  accountId: string
): Promise<boolean> {
  try {
    // First check if user is already registered
    const storageBalance = await fetchNearView(
      tokenContract,
      'storage_balance_of',
      { account_id: accountId }
    );

    // If balance meets minimum, user is already registered
    if (storageBalance !== null && 
        BigInt(storageBalance.total) >= BigInt('1250000000000000000000')) {
      return true;
    }

    // User needs registration - use relayer account
    if (!RELAYER_ACCOUNT_ID) {
      throw new Error('Relayer account not configured');
    }

    const relayerAccount = await nearConnection.account(RELAYER_ACCOUNT_ID);
    
    await relayerAccount.functionCall({
      contractId: tokenContract,
      methodName: 'storage_deposit',
      args: {
        account_id: accountId,
      },
      gas: BigInt('30000000000000'),
      attachedDeposit: BigInt('1250000000000000000000')
    });

    return true;
  } catch (error) {
    console.error('Error in registerUserIfNeeded:', error);
    return false;
  }
}
  