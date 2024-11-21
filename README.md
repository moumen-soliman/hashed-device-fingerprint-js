# hashed-device-fingerprint-js
[![npm version](https://img.shields.io/npm/v/hashed-device-fingerprint-js)](https://www.npmjs.com/package/hashed-device-fingerprint-js)

```
+-------------------+------------------------+
|          https://yoursite.com              |
+-------------------+------------------------+
         |                |                |
+-----------------+-----------------+-----------------+
| (DEVICE A)      | (DEVICE B)      | (DEVICE C)      |
| device-specific | device-specific | device-specific |
| fingerprint     | fingerprint     | fingerprint     |
+-----------------+-----------------+-----------------+
```

A lightweight JavaScript/TypeScript package that generates device-specific hashed fingerprints for devices in both browser and server environments. The library allows customization of what data is included in the fingerprint, with options for saving the hash in cookies, passing headers for server-side use, and providing the user's IP directly.

[**NPM**](https://www.npmjs.com/package/hashed-device-fingerprint-js)

## Important
`hashed-device-fingerprint-js` generates fingerprints using device data like `[screenResolution, platform, concurrency, userIP]` by default, with `userAgent` and `language` disabled. You can add `customData (e.g., userID)` to make the array `[screenResolution, platform, concurrency, userIP, customData]` (e.g. `[1920x1080, Windows, 4 cores, 203.0.113.45, user-12345]`), ensures a consistent generated same hash across browsers on the same device.

- A real-world example: Limiting sharing by detecting multiple devices accessing a single account.
- A real-world example: preventing fraud by tracking devices creating fake accounts.
and more...

## Features
- Generate a device-specific fingerprint hash based on:
  - User Agent (disabled by default)
  - Browser/System Language (disabled by default)
  - Screen Resolution (Browser-only)
  - Platform (e.g., `Win32` or `Linux`)
  - Hardware Concurrency (Browser-only)
  - IP Address (with options to pass it manually or fetch automatically)
- Support for browser and server environments:
  - **Browser**: Uses `navigator` and `screen` properties.
  - **Server**: Relies on HTTP headers and server-side properties.
- Save the hashed fingerprint in a cookie (browser only) with a customizable expiration time.
- Fully customizable: enable or disable specific data points.
- Compatible with both `require` (CommonJS) and `import` (ES Modules).

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
### Default Behavior (Browser)

By default, all options are enabled (`userAgent` and `language` disabled). The library generates a fingerprint hash using all available device data and automatically fetches the user's IP address.

```typescript
import { generateHashedFingerprint } from 'hashed-device-fingerprint-js';

generateHashedFingerprint()
    .then(hash => console.log('Fingerprint Hash:', hash))
    .catch(error => console.error('Error:', error));
```

### Server-Side Usage

In a Server environment, pass HTTP headers to generate a fingerprint. Use the environment option to specify the server-side environment.

```typescript
const { generateHashedFingerprint } = require('hashed-device-fingerprint-js');
// import { generateHashedFingerprint } from 'hashed-device-fingerprint-js';

// Example HTTP headers
const headers = {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    'accept-language': 'en-US,en;q=0.9',
    'x-forwarded-for': '203.0.113.45',
};

generateHashedFingerprint({
    environment: 'server',
    headers,
})
    .then(hash => console.log('Fingerprint Hash:', hash))
    .catch(error => console.error('Error:', error));
```

## Custom Options
Customize the behavior by passing an options object:

```typescript
generateHashedFingerprint({
    useUserAgent: false,        // Exclude the user agent (default: true)
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

### IP Address Handling
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

### Server API
```javascript
const { generateHashedFingerprint } = require('hashed-device-fingerprint-js');

// Basic route
app.get('/hash', async (req, res) => {
    // Define headers for fingerprint generation
    const headers = {
        'user-agent': req.headers['user-agent'] || 'Unknown',
        'accept-language': req.headers['accept-language'] || 'Unknown',
        'x-forwarded-for': req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'Unknown',
    };

    try {
        // Generate the fingerprint hash
        const hash = await generateHashedFingerprint({
            environment: 'server',
            headers,
        });

        // Log the hash
        console.log('Generated Hash:', hash);

        // Send the hash as the response
        res.send({ hash });
    } catch (error) {
        // Handle errors
        console.error('Error generating fingerprint:', error);
        res.status(500).send({ error: 'Failed to generate fingerprint' });
    }
});
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
  - Default: `false`
  - Description: Include the browser's user agent string in the fingerprint.

- `useLanguage`
  - Type: `boolean`
  - Default: `false`
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

- `headers`
  - Type: `Record<string, string[]>`
  - Default: `{}`
  - Description: HTTP headers for server-side fingerprinting.

- `environment`
  - Type: `'browser' | 'server'`
  - Default: `Auto-detected`
  - Description: Specify the environment explicitly (e.g., `'browser'` or `'server'`).

- `customData`
  - Type: `string`
  - Default: `null`
  - Description: Custom data to include in the fingerprint (e.g., `UUID` or `user ID`).

## License
This package is licensed under the [MIT License](https://opensource.org/license/mit/).

## Contributing
- Fork the repository.
- Create a new branch: `git checkout -b feature-name`.
- Commit your changes: `git commit -m 'Add feature'`.
- Push to the branch: `git push origin feature-name`.
- Submit a pull request.

## Support
If you encounter any issues or have questions, feel free to open an issue on [**Repo Issues**](https://github.com/moumen-soliman/hashed-device-fingerprint-js/issues).

Happy coding! 🚀
