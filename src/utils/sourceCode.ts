// Tofu added this file on 2026-10-24 (see TOFU.md). The "Source code" link in
// the footer and in the menu opens this address: VITE_SOURCE_URL when it is set,
// else Tofu's copy of this app on GitHub. Whoever changes this code and runs it
// for others should set VITE_SOURCE_URL to where their own changed source is.
const tofuGallerySource = 'https://github.com/tofu-gallery/mini-qr'

export const sourceCodeUrl = (import.meta.env.VITE_SOURCE_URL ?? '').trim() || tofuGallerySource
