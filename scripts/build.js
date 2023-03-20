import { build } from 'esbuild'

build({
    entryPoints: ['builds/cdn.ts'],
    bundle: true,
    outfile: 'dist/alpine-sortable.min.js',
    bundle: true,
    minify: true,
    sourcemap: false,
    platform: 'browser',
})

build({
    entryPoints: ['builds/module.ts'],
    bundle: true,
    outfile: 'dist/alpine-sortable.esm.js',
    bundle: true,
    platform: 'neutral',
    mainFields: ['module', 'main'],
})

build({
    entryPoints: ['builds/module.ts'],
    outfile: 'dist/alpine-sortable.cjs.js',
    bundle: true,
    platform: 'node',
})
