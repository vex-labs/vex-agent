const VEX_DECIMALS = 18;
const USDC_DECIMALS = 6;

function cleanupAmount(amount: string): string {
    return amount.replace(/,/g, '').trim();
}

function trimLeadingZeroes(value: string): string {
    return value.replace(/^0+/, '') || '0';
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