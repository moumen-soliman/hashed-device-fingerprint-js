const esbuild = require('esbuild');

esbuild.build({
    entryPoints: ['./src/index.ts'], // Path to your main TypeScript file
    outfile: './dist/index.min.js', // Path to the output minified file
    bundle: true,                  // Bundle all dependencies into one file
    minify: true,                  // Minify the output
    sourcemap: false,              // Disable source maps for production
    target: ['esnext'],            // Target modern JavaScript environments
    format: 'cjs',                 // Output format (CommonJS for Node.js packages)
    platform: 'browser',           // Set to 'browser' for frontend compatibility
    external: ['js-sha256'],       // Mark external dependencies not to be bundled
})
    .then(() => console.log('Build succeeded! Minified file created at ./dist/index.min.js'))
    .catch(() => process.exit(1));