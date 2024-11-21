import { sha256 } from "js-sha256";

export interface FingerprintOptions {
    saveToCookie?: boolean; // Save the hashed fingerprint to a cookie (browser only)
    cookieExpiryDays?: number; // Cookie expiry in days (browser only)
    useUserAgent?: boolean; // Include user agent in the fingerprint
    useLanguage?: boolean; // Include browser/system language
    useScreenResolution?: boolean; // Include screen resolution (browser only)
    usePlatform?: boolean; // Include platform information
    useConcurrency?: boolean; // Include hardware concurrency (browser only)
    useIP?: boolean; // Include the user's IP address
    userIP?: string | null; // Directly provide the user's IP address
    headers?: Record<string, string | string[]>; // Server-side headers
    environment?: 'browser' | 'server'; // Specify the environment explicitly
    customData?: string | null; // Custom data to include in the fingerprint (e.g., UUID or user ID)
}

/**
 * Generate a hashed fingerprint based on available device or server data.
 * @param options - Options to customize the behavior.
 * @returns A promise that resolves with the hashed fingerprint.
 */
export async function generateHashedFingerprint(options: Partial<FingerprintOptions> = {}): Promise<string> {
    const {
        saveToCookie = true,
        cookieExpiryDays = 7,
        useUserAgent = false,
        useLanguage = false,
        useScreenResolution = true,
        usePlatform = true,
        useConcurrency = true,
        useIP = true,
        userIP = null,
        headers = {},
        environment = typeof window !== "undefined" ? "browser" : "server",
        customData = null,
    } = { ...defaultFingerprintOptions(), ...options };

    try {
        const deviceDataParts: string[] = [];

        if (environment === "browser") {
            // Browser-specific fingerprint data
            if (useUserAgent) deviceDataParts.push(navigator.userAgent);
            if (useLanguage) deviceDataParts.push(navigator.language);
            if (useScreenResolution) {
                deviceDataParts.push(`${screen.width}x${screen.height}`);
                deviceDataParts.push(`${screen.colorDepth}-bit`);
            }
            if (usePlatform) deviceDataParts.push(navigator.platform);
            if (useConcurrency) deviceDataParts.push(`${navigator.hardwareConcurrency} cores`);
            deviceDataParts.push(`${navigator.maxTouchPoints}`);

            if (useIP) {
                if (userIP) {
                    deviceDataParts.push(userIP);
                } else {
                    const ip = await fetchUserIP();
                    if (ip) deviceDataParts.push(ip);
                }
            }

            // Save to cookie if enabled
            if (saveToCookie) {
                const expiryDate = new Date();
                expiryDate.setTime(expiryDate.getTime() + cookieExpiryDays * 24 * 60 * 60 * 1000);
                document.cookie = `hashedFingerprint=${sha256(deviceDataParts.join('||'))}; expires=${expiryDate.toUTCString()}; path=/`;
            }
        } else if (environment === "server") {
            // Server-specific fingerprint data
            if (useUserAgent && headers["user-agent"]) {
                deviceDataParts.push(
                    Array.isArray(headers["user-agent"]) ? headers["user-agent"][0] : headers["user-agent"]
                );
            }
            if (useLanguage && headers["accept-language"]) {
                deviceDataParts.push(
                    Array.isArray(headers["accept-language"]) ? headers["accept-language"][0] : headers["accept-language"]
                );
            }
            if (usePlatform) {
                deviceDataParts.push(process.platform);
            }
            if (useIP) {
                if (userIP) {
                    deviceDataParts.push(userIP);
                } else if (headers["x-forwarded-for"]) {
                    deviceDataParts.push(
                        Array.isArray(headers["x-forwarded-for"]) ? headers["x-forwarded-for"][0] : headers["x-forwarded-for"]
                    );
                }
            }
        }

        // Add custom data if provided
        if (customData) {
            deviceDataParts.push(customData);
        }

        const deviceData = deviceDataParts.join("||");
        return sha256(deviceData);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to generate fingerprint: ${error.message}`);
        }
        throw new Error("An unknown error occurred during fingerprint generation.");
    }
}

/**
 * Fetch the user's public IP address using an external service.
 * This is only used in a browser environment.
 * @returns A promise that resolves with the IP address as a string.
 */
async function fetchUserIP(): Promise<string | null> {
    try {
        const response = await fetch("https://api64.ipify.org?format=json");
        if (!response.ok) throw new Error("Failed to fetch IP address");
        const data = await response.json();
        return data.ip || null;
    } catch (error) {
        console.error("Error fetching IP address:", error);
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
        useUserAgent: false,
        useLanguage: false,
        useScreenResolution: true,
        usePlatform: true,
        useConcurrency: true,
        useIP: true,
        userIP: null,
        headers: {},
        environment: "browser",
        customData: null,
    };
}