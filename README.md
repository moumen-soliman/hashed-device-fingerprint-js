# hashed-device-fingerprint-js

```
+-------------------+------------------------+
|          https://yoursite.com              |
+-------------------+------------------------+
         |                |                |
+-----------------+-----------------+-----------------+
| (DEVICE A)      | (DEVICE B)      | (DEVICE C)      |
| unique device   | unique device   | unique device   |
| fingerprint     | fingerprint     | fingerprint     |
+-----------------+-----------------+-----------------+
```

A lightweight JavaScript/TypeScript package for generating hashed fingerprints based on device data. Includes options for customizable device information, IP address integration, and cookie management.

[**NPM**](https://www.npmjs.com/package/hashed-device-fingerprint-js)

## Features
- Device Data Fingerprinting: Collects user agent, screen resolution, platform, and more.
- SHA-256 Hashing: Uses [js-sha256](https://www.npmjs.com/package/js-sha256) for secure hashing.
- IP Address Integration: Fetch IP automatically, pass it manually, or disable it entirely.
- Cookie Management: Optionally save hashed fingerprints in cookies.
- Fully Configurable: Enable or disable specific device data fields as needed.
- TypeScript Support: Fully typed for better integration with modern frameworks like Next.js.

## Installation
Install the package using npm:

```
npm install hashed-device-fingerprint-js
```

Install the package using yarn:

```
yarn add hashed-device-fingerprint-js
```

## Usage
### Basic Usage

Generate a hashed fingerprint with all options enabled (default behavior):

```typescript
import { generateHashedFingerprint } from 'hashed-device-fingerprint-js';

generateHashedFingerprint()
    .then(hash => console.log('Fingerprint Hash:', hash))
    .catch(error => console.error('Error:', error));
```

## Custom Options
Customize the behavior by passing an options object:

```typescript
generateHashedFingerprint({
    useUserAgent: true,         // Include the user agent (default: true)
    useLanguage: false,         // Exclude the browser language
    useScreenResolution: true,  // Include screen resolution (default: true)
    usePlatform: true,          // Include platform information (default: true)
    useConcurrency: true,       // Include logical processors (default: true)
    useIP: true,                // Fetch and include the user's IP (default: true)
    userIP: '203.0.113.45',     // Provide IP manually (overrides API fetch)
    saveToCookie: false,        // Do not save the hash in a cookie (default: true)
    cookieExpiryDays: 10        // Cookie expiry in days (default: 7)
})
    .then(hash => console.log('Custom Fingerprint Hash:', hash))
    .catch(error => console.error('Error:', error));
```

## Options

- `saveToCookie`
  - Type: `boolean`
  - Default: `true`
  - Description: Save the generated hash in a cookie.

- `cookieExpiryDays`
  - Type: `number`
  - Default: `7`
  - Description: Number of days before the cookie expires.

- `useUserAgent`
  - Type: `boolean`
  - Default: `true`
  - Description: Include the browser's user agent string in the fingerprint.

- `useLanguage`
  - Type: `boolean`
  - Default: `true`
  - Description: Include the browser's language setting in the fingerprint.

- `useScreenResolution`
  - Type: `boolean`
  - Default: `true`
  - Description: Include the screen's resolution and color depth in the fingerprint.

- `usePlatform`
  - Type: `boolean`
  - Default: `true`
  - Description: Include platform information (e.g., "Win32", "MacIntel").

- `useConcurrency`
  - Type: `boolean`
  - Default: `true`
  - Description: Include the number of logical processors.

- `useIP`
  - Type: `boolean`
  - Default: `true`
  - Description: Fetch and include the user's IP address.

- `userIP`
  - Type: `string`
  - Default: `null`
  - Description: Provide an IP address manually (overrides API fetch).


## IP Address Handling
The IP address is included in the fingerprint based on these rules:

- If `userIP` is provided, it is used directly.
- If `userIP` is null and useIP is true, the IP is fetched using an external API (https://api64.ipify.org).
- If useIP is false, the IP is excluded entirely.

## Example Scenarios
### Save Fingerprint in a Cookie

```typescript
generateHashedFingerprint({ saveToCookie: true })
    .then(hash => console.log('Fingerprint saved in cookie:', hash))
    .catch(error => console.error('Error:', error));
```

### Disable IP Fetching

```typescript
generateHashedFingerprint({ useIP: false })
    .then(hash => console.log('Fingerprint without IP:', hash))
    .catch(error => console.error('Error:', error));
```

### Provide Manual IP
```typescript
generateHashedFingerprint({ userIP: '203.0.113.45' })
    .then(hash => console.log('Fingerprint with manual IP:', hash))
    .catch(error => console.error('Error:', error));
```

## TypeScript Support
The package includes TypeScript type definitions for all options and methods. Here’s a quick example:

```typescript
import { generateHashedFingerprint, FingerprintOptions } from 'hashed-device-fingerprint-js';

const options: Partial<FingerprintOptions> = {
    saveToCookie: false,
    useUserAgent: true,
    useIP: true
};

generateHashedFingerprint(options)
    .then(hash => console.log('Typed Fingerprint Hash:', hash))
    .catch(error => console.error('Error:', error));
```

## Error Handling
Errors are thrown as JavaScript Error objects. Use a try-catch block or .catch() to handle them safely:

```typescript
generateHashedFingerprint()
    .then(hash => console.log('Fingerprint Hash:', hash))
    .catch(error => {
        if (error instanceof Error) {
            console.error('Error:', error.message);
        } else {
            console.error('Unknown Error:', error);
        }
    });
```

## License
This package is licensed under the [MIT License](https://opensource.org/license/mit/).

## Contributing
Contributions are welcome! Feel free to submit issues or pull requests.
