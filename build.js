const esbuild = require('esbuild');
const { execSync } = require('child_process');

// Build JavaScript bundle using esbuild
esbuild.build({
    entryPoints: ['./src/index.ts'],
    outfile: './dist/index.min.js',
    bundle: true,
    minify: true,
    sourcemap: false,
    target: ['esnext'],
    format: 'cjs',
    platform: 'browser',
    external: ['js-sha256']
})
    .then(() => console.log('JavaScript build succeeded!'))
    .catch(() => process.exit(1));

// Generate TypeScript type definitions using tsc
try {
    execSync('tsc', { stdio: 'inherit' });
    console.log('TypeScript declaration files generated!');
} catch (error) {
    console.error('Error generating TypeScript declarations:', error);
    process.exit(1);
}
