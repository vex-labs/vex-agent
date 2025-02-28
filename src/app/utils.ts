const { JsonRpcProvider } = require("@near-js/providers");

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
        url: "https://free.rpc.fastnear.com/",
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
    const balanceBN = BigInt(balance);
    const wholeStr = 
        balance.substring(0, balance.length - USDC_DECIMALS) || "0";
    const fractionStr = balance
        .substring(balance.length - USDC_DECIMALS)
        .padStart(USDC_DECIMALS, "0")
        .substring(0, fracDigits);

    return trimTrailingZeroes(`${formatWithCommas(wholeStr)}.${fractionStr}`);
}

export function formatVexAmount(balance: string, fracDigits: number = VEX_DECIMALS): string {
    const balanceBN = BigInt(balance);
    const wholeStr = 
        balance.substring(0, balance.length - VEX_DECIMALS) || "0";
    const fractionStr = balance
        .substring(balance.length - VEX_DECIMALS)
        .padStart(VEX_DECIMALS, "0")
        .substring(0, fracDigits);

    return trimTrailingZeroes(`${formatWithCommas(wholeStr)}.${fractionStr}`);
}
  