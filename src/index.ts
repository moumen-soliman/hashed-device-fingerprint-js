import { sha256 } from "js-sha256";

export interface FingerprintOptions {
    saveToCookie?: boolean; // Save the hashed fingerprint to a cookie
    cookieExpiryDays?: number; // Cookie expiry in days
    useUserAgent?: boolean; // Include user agent in the fingerprint
    useLanguage?: boolean; // Include browser language
    useScreenResolution?: boolean; // Include screen resolution
    usePlatform?: boolean; // Include platform information
    useConcurrency?: boolean; // Include hardware concurrency
    useIP?: boolean; // Include the user's IP address
    userIP?: string | null; // Directly provide the user's IP address
}

/**
 * Generate a hashed fingerprint based on selected device data.
 * By default, all options are enabled unless explicitly set to false.
 * @param options - Options to customize the behavior.
 * @returns A promise that resolves with the hashed fingerprint.
 */
export async function generateHashedFingerprint(options: Partial<FingerprintOptions> = {}): Promise<string> {
    const {
        saveToCookie = true,
        cookieExpiryDays = 7,
        useUserAgent = true,
        useLanguage = true,
        useScreenResolution = true,
        usePlatform = true,
        useConcurrency = true,
        useIP = true,
        userIP = null,
    } = { ...defaultFingerprintOptions(), ...options };

    try {
        const deviceDataParts: string[] = [];

        if (useUserAgent) deviceDataParts.push(navigator.userAgent);
        if (useLanguage) deviceDataParts.push(navigator.language);
        if (useScreenResolution) {
            deviceDataParts.push(`${screen.width}x${screen.height}`);
            deviceDataParts.push(`${screen.colorDepth}-bit`);
        }
        if (usePlatform) deviceDataParts.push(navigator.platform);
        if (useConcurrency) deviceDataParts.push(`${navigator.hardwareConcurrency} cores`);

        // Handle IP address inclusion logic
        if (useIP) {
            if (userIP) {
                // Use the provided IP address
                deviceDataParts.push(userIP);
            } else {
                // Fetch IP address if not provided
                const ip = await fetchUserIP();
                if (ip) deviceDataParts.push(ip);
            }
        }

        const deviceData = deviceDataParts.join('||');

        // Perform SHA-256 hashing
        const hashedFingerprint = sha256(deviceData);

        // Save to cookie if enabled
        if (saveToCookie) {
            const expiryDate = new Date();
            expiryDate.setTime(
                expiryDate.getTime() + cookieExpiryDays * 24 * 60 * 60 * 1000
            );
            document.cookie = `hashedFingerprint=${hashedFingerprint}; expires=${expiryDate.toUTCString()}; path=/`;
        }

        return hashedFingerprint;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to generate fingerprint: ${error.message}`);
        }
        throw new Error('An unknown error occurred during fingerprint generation.');
    }
}

/**
 * Fetch the user's public IP address using an external service.
 * @returns A promise that resolves with the IP address as a string.
 */
async function fetchUserIP(): Promise<string | null> {
    try {
        const response = await fetch('https://api64.ipify.org?format=json');
        if (!response.ok) throw new Error('Failed to fetch IP address');
        const data = await response.json();
        return data.ip || null;
    } catch (error) {
        console.error('Error fetching IP address:', error);
        return null;
    }
}

/**
 * Default fingerprint options with all features enabled.
 */
function defaultFingerprintOptions(): FingerprintOptions {
    return {
        saveToCookie: true,
        cookieExpiryDays: 7,
        useUserAgent: true,
        useLanguage: true,
        useScreenResolution: true,
        usePlatform: true,
        useConcurrency: true,
        useIP: true,
        userIP: null,
    };
}