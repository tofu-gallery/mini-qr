# Tofu gallery copy

This repository is Tofu's copy of **lyqht/mini-qr** (licence: GPL-3.0), listed in Tofu's app gallery as **Mini QR**: a QR code maker and scanner that runs entirely in the browser.

- `main` mirrors the upstream repository and is never committed to by Tofu.
- `tofu` carries Tofu's own changes; tags named `pin/<date>` mark the versions the gallery points to.
- A visitor who chooses this app gets a private snapshot of the pinned version in their own Tofu account. Their copy does not follow upstream updates.

## How Tofu runs it

- **Framework preset:** `vite`, built on Tofu's Vercel lane (provider `vercel`). Tofu's shared static lane does not take this app: its root `Dockerfile`, the `"packageManager": "pnpm@10.0.0"` field, the `.env.development` file and the PWA setup in `vite.config.js` are all outside the shape that lane builds.
- **Root folder:** the repository root.
- **Install:** `npm install`, from `package-lock.json`.
- **Build:** `npm run build` (that is `vite build`). **Output directory:** `dist/`.
- **Environment variables:** none are needed. Leave `VITE_ENABLE_ANALYTICS` unset or `false` (see below). The other `VITE_*` names in `.env.example` are optional upstream settings (credits, default preset and text, preset and frame lists, local storage, simple mode). Do not copy its `BASE_PATH=/mini-qr` line: the app is served from the root of its address, which the default (`./`) already handles.
- **Database:** none. The app keeps its settings in the visitor's own browser storage.

## What Tofu changes

Changed on the `tofu` branch on 2026-10-23, on top of upstream commit `fe46504` of lyqht/mini-qr:

- **Brand presets removed.** `src/utils/qrCodePresets.ts` no longer ships the upstream's 15 brand and personal QR presets (Padlet, Vercel Light, Vercel Dark, Supabase Green, Supabase Purple, UIlicious, Vite Conf 2023, Vue I18n, VueJS, Default (lyqht), Pejuang Kode, GeeksHacking, SP Digital, GovTech - Stack Community, Hackomania 2025). Their configs `src/assets/presets/geekshacking.json`, `govtech_stack.json`, `hackomania2025.json` and `spdigital.json`, and the 11 preview images in `public/presets/`, are deleted. Why: they carry other organisations' names, logos and links (and the upstream author's own), which a copy in someone else's account should not ship. The preset picker and the code that applies presets are unchanged and work with the upstream's own **Plain** preset (`src/assets/presets/plain.json`), which is now the default. `VITE_QR_CODE_PRESETS` still replaces the built-in list.
- **Demo media removed.** `public/app_preview.gif`, `public/app_preview.png`, `public/MiniQR-demo.mp4` and `public/batch_data_export.mp4` (16.6 MiB together) are deleted. Why: no app code, PWA manifest, `index.html` or README line refers to them, and Vite copies everything in `public/` into every deployed site. The PWA precache's ignore pattern `**/app_preview.*` in `vite.config.js` now matches nothing and is left as it is.
- **README.md**: the row of preset QR images at the top pointed at the removed `public/presets/` files. It is replaced by a comment saying so.
- **npm lockfile added.** `package-lock.json` (lockfileVersion 3) was generated with `npm install --package-lock-only --ignore-scripts` (npm 10.9.8, Node 22) from the unchanged `package.json`, whose dependencies are all exact versions. Every entry resolves to registry.npmjs.org with an integrity hash, and the Linux builds of rollup, esbuild and sharp that a build machine needs are in it. `.gitignore` listed `package-lock.json`; that line is replaced by a note, because Tofu's upload from a folder follows `.gitignore` and would otherwise leave the lockfile out.
- **`pnpm-lock.yaml` removed.** Why: the build would have picked it up instead of the npm lockfile. Vercel chooses the package manager by lockfile and ranks `pnpm-lock.yaml` above `package-lock.json`, and Tofu's static build refuses any upload that carries one. **The build uses `package-lock.json`.**
- **Dated notices.** The notes in the three files above that say Tofu changed them also give the date, 2026-10-23, as GPL-3.0 section 5(a) asks.
- **Left as upstream wrote them:** `"packageManager": "pnpm@10.0.0"` in `package.json` (Vercel reads it only when `ENABLE_EXPERIMENTAL_COREPACK=1` is set, and would then stop on the mismatch with the npm lockfile, so do not set that variable); `.npmrc`, whose one line (`public-hoist-pattern[]=workbox-window`) is a pnpm setting that a Tofu build never sees, because Tofu's import leaves files named `.npmrc` out, and npm does not need it (it already installs `workbox-window` at the top of `node_modules`, as that line made pnpm do); the social-preview tags in `index.html` (`og:url`, `og:image`, `twitter:image`), which still point at the upstream's own site and GitHub images; and the pnpm commands in `CONTRIBUTING.md`, `lint-staged` and `.github/`, which a Tofu build never runs.
- **Analytics stay off.** Nothing needed changing: `src/main.js` loads Vercel Web Analytics only when `VITE_ENABLE_ANALYTICS` is `1` or `true`, and nothing in this copy sets it (`.env.example` keeps `VITE_ENABLE_ANALYTICS=false`). Leave it unset or `false`.

## Verification

Run on 2026-10-23 on macOS (Apple silicon) with Node 22.22.3 and npm 10.9.8, on the files Tofu's import delivers: the `tofu` branch at `pin/2026-10-23` (`ba438aa`), exported with `git archive` into a folder with no `.git`, without `.npmrc`. Nothing was deployed and no Docker image was built.

1. **Install:** `npm ci` passed: 884 packages from `package-lock.json`. The `postinstall` step (`husky install`) printed `husky - git command not found, skipping install` and the install went on; sharp 0.33.5 loaded its prebuilt binary. The only warnings were deprecation notices (vue-i18n 9, uuid 9, glob 11, eslint 9).
2. **Build:** `npm run build` passed in about 4 seconds. `dist/` holds `index.html`, `manifest.webmanifest`, `sw.js` and its workbox file (the PWA precaches 76 files, 3.5 MiB); 83 files, about 4 MB in all. The one warning is the upstream's own: a JavaScript file larger than 500 kB.
3. **Serve:** `python3 -I -m http.server <port> --bind 127.0.0.1 --directory dist`, then `curl`: the entry page answered 200 (`text/html`, 2,230 bytes), and so did the script, the stylesheet, the manifest, `sw.js`, the favicon and an app icon.
4. **Browser** (Chromium, its own tab, 127.0.0.1 only):
   - The app opens on the Plain preset (black on white, no logo), the preset picker shows **Plain**, and the starting text is drawn as a 200 by 200 pixel QR code.
   - Typing `https://example.com/tofu-check` into **Data to encode** redraws the code.
   - The PNG, JPG, SVG and TXT export buttons are offered and enabled. **PNG** gave `qr-code.png` (4,394 bytes) and **SVG** gave `qr-code.svg` (31,602 bytes); both read back as `https://example.com/tofu-check` with Chromium's QR code reader. The files were caught in the page rather than saved.
   - **Save QR Code configuration** gave `qr-code-config.json`. After the text was changed, **Load QR Code configuration** with that file put the saved text back, the picker showed **Loaded from file**, and the exported PNG read back as the saved address.
   - The service worker registered at the site root and became active.
   - No console errors and no failed requests: the server logged 157 requests, 149 answered 200 and 8 answered 304. Every request went to 127.0.0.1, none to `/_vercel/insights/`.
5. **Dated notices:** they are comments, committed after steps 1 to 4. The same install and build on the files of that later commit gave a `dist/` identical to the one checked above (`diff -r`). This file is not read by the build.
6. **Import:** `python3 -I simulate_import.py --one tofu-gallery/mini-qr tofu '' no` (Tofu's import filter, read from GitHub): 329 of 330 files kept; the one left out is `.npmrc`. Nothing the build needs is dropped.

Not run: `vitest`, the Playwright e2e tests, `vue-tsc` and ESLint. Two e2e comments still name the removed lyqht default preset; those tests set their own colours and logo.

## Still needs a real deploy

- The deploy lands on Tofu's Vercel lane (provider `vercel`) with the Vite preset, and on a Free account it is admitted as the account's one app.
- Vercel's Linux build runs `npm install` from `package-lock.json` (not pnpm) and gets the Linux builds the lockfile carries (`@rollup/rollup-linux-x64-gnu`, `@esbuild/linux-x64`, `@img/sharp-linux-x64`); the check above ran on macOS.
- Installing the app from the browser, and scanning with the camera, on the live HTTPS address. Scanning was not tried here.

## Licence

GPL-3.0. Licence files and copyright notices stay as they are; every file Tofu changes carries a dated note saying so (`src/utils/qrCodePresets.ts`, `README.md`, `.gitignore`), and the files Tofu added or deleted are listed above.

The modified source of the app Tofu hosts is this public repository, https://github.com/tofu-gallery/mini-qr, at the tag the gallery pins on the `tofu` branch: `pin/2026-10-23.1`. Copies made from the earlier pin, `pin/2026-10-23`, have their source at that tag, which stays in place.
