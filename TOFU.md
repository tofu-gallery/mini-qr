# Tofu gallery copy

This repository is Tofu's copy of **lyqht/mini-qr** (licence: GPL-3.0), listed in Tofu's app gallery as **Mini QR**.

- `main` mirrors the upstream repository and is never committed to by Tofu.
- `tofu` carries Tofu's own changes; tags named `pin/<date>` mark the versions the gallery points to.
- A visitor who chooses this app gets a private snapshot of the pinned version in their own Tofu account. Their copy does not follow upstream updates.

How Tofu runs it: Vite app: Tofu builds it with npm from `package-lock.json` (`npm install`, then `vite build` into `dist/`). Tofu's shared static lane does not take this app (the root `Dockerfile` and the PWA setup in `vite.config.js` are outside the shape it builds), so it is built on Tofu's Vercel lane with the Vite preset.

## What Tofu changes

Changed on the `tofu` branch on 2026-10-23, on top of upstream commit `fe46504` of lyqht/mini-qr:

- **Brand presets removed.** `src/utils/qrCodePresets.ts` no longer ships the upstream's 15 brand and personal QR presets (Padlet, Vercel Light, Vercel Dark, Supabase Green, Supabase Purple, UIlicious, Vite Conf 2023, Vue I18n, VueJS, Default (lyqht), Pejuang Kode, GeeksHacking, SP Digital, GovTech - Stack Community, Hackomania 2025). Their configs `src/assets/presets/geekshacking.json`, `govtech_stack.json`, `hackomania2025.json` and `spdigital.json`, and the 11 preview images in `public/presets/`, are deleted. Why: they carry other organisations' names, logos and links (and the upstream author's own), which a copy in someone else's account should not ship. The preset picker and the code that applies presets are unchanged and work with the upstream's own **Plain** preset (`src/assets/presets/plain.json`), which is now the default. `VITE_QR_CODE_PRESETS` still replaces the built-in list.
- **Demo media removed.** `public/app_preview.gif`, `public/app_preview.png`, `public/MiniQR-demo.mp4` and `public/batch_data_export.mp4` (16.6 MiB together) are deleted. Why: no app code, PWA manifest, `index.html` or README line refers to them, and Vite copies everything in `public/` into every deployed site. The PWA precache's ignore pattern `**/app_preview.*` in `vite.config.js` now matches nothing and is left as it is.
- **README.md**: the row of preset QR images at the top pointed at the removed `public/presets/` files. It is replaced by a comment saying so.
- **npm lockfile added.** `package-lock.json` (lockfileVersion 3) was generated with `npm install --package-lock-only --ignore-scripts` (npm 10.9.8, Node 22) from the unchanged `package.json`, whose dependencies are all exact versions. Every entry resolves to registry.npmjs.org with an integrity hash, and the Linux builds of rollup, esbuild and sharp that a build machine needs are in it. `.gitignore` listed `package-lock.json`; that line is replaced by a note, because Tofu's upload from a folder follows `.gitignore` and would otherwise leave the lockfile out.
- **`pnpm-lock.yaml` removed.** Why: the build would have picked it up instead of the npm lockfile. Vercel chooses the package manager by lockfile and ranks `pnpm-lock.yaml` above `package-lock.json`, and Tofu's static build refuses any upload that carries one. **The build uses `package-lock.json`.**
- **Left as upstream wrote them:** `"packageManager": "pnpm@10.0.0"` in `package.json` (Vercel reads it only when `ENABLE_EXPERIMENTAL_COREPACK=1` is set, and would then stop on the mismatch with the npm lockfile, so do not set that variable); the pnpm-only `public-hoist-pattern[]=workbox-window` line in `.npmrc` (npm warns and ignores it; npm already puts `workbox-window` at the top of `node_modules`, which is what that line did for pnpm); and the pnpm commands in `CONTRIBUTING.md`, `lint-staged` and `.github/`, which a Tofu build never runs.
- **Analytics stay off.** Nothing needed changing: `src/main.js` loads Vercel Web Analytics only when `VITE_ENABLE_ANALYTICS` is `1` or `true`, and nothing in this copy sets it (`.env.example` keeps `VITE_ENABLE_ANALYTICS=false`). Leave it unset or `false`.

## Needs a real deploy to verify

Nothing here was installed, built, tested or served when this copy was made; the changes were checked by reading the code.

- The deploy lands on Tofu's Vercel lane (provider `vercel`), and on a Free account it is admitted as the account's one app.
- The build log shows `npm install` reading `package-lock.json` (not pnpm), the `postinstall` step (`husky install`) skipping without an error, and sharp's install check passing.
- `vite build` finishes and `dist/` holds `index.html`, `manifest.webmanifest` and the service worker from vite-plugin-pwa.
- The live app opens on the Plain preset (black dots on white, no logo), the preset picker lists Plain, and loading a saved JSON config still works.
- No request goes to `/_vercel/insights/` (analytics off).
- `vitest` and the Playwright e2e tests, which were not run. Two e2e comments still name the removed lyqht default preset; those tests set their own colours and logo.

## Licence

GPL-3.0. Licence files and copyright notices stay as they are; every file Tofu changes carries a note saying so (`src/utils/qrCodePresets.ts`, `README.md`, `.gitignore`), and the files Tofu added or deleted are listed above.

The modified source of the app Tofu hosts is this public repository, https://github.com/tofu-gallery/mini-qr, at the tag the gallery pins on the `tofu` branch: `pin/2026-10-23`.
