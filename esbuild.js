const esbuild = require('esbuild');

const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

/** @type {import('esbuild').BuildOptions} */
const sharedOptions = {
	entryPoints: ['src/extension.ts'],
	bundle: true,
	format: 'cjs',
	minify: production,
	sourcemap: !production,
	sourcesContent: false,
	external: ['vscode'],
	logLevel: 'info',
};

/** @type {import('esbuild').BuildOptions} */
const nodeOptions = {
	...sharedOptions,
	platform: 'node',
	outfile: 'dist/extension.js',
};

/** @type {import('esbuild').BuildOptions} */
const webOptions = {
	...sharedOptions,
	platform: 'browser',
	outfile: 'dist/web/extension.js',
};

async function main() {
	if (watch) {
		const [nodeCtx, webCtx] = await Promise.all([
			esbuild.context(nodeOptions),
			esbuild.context(webOptions),
		]);
		await Promise.all([nodeCtx.watch(), webCtx.watch()]);
	} else {
		await Promise.all([
			esbuild.build(nodeOptions),
			esbuild.build(webOptions),
		]);
	}
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
