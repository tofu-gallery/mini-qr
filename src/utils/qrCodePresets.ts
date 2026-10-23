import { isValidFrameConfig } from './framePresets'
import PlainConfig from '@/assets/presets/plain.json'
import type { DrawType, Options as StyledQRCodeProps } from '@/lib/qr-code'

export interface CustomStyleProps {
  borderRadius?: string
  background?: string
}

export type PresetAttributes = {
  style: CustomStyleProps
  name: string
}

export type Preset = Omit<
  Required<StyledQRCodeProps>,
  'shape' | 'qrOptions' | 'nodeCanvas' | 'jsdom'
> &
  PresetAttributes

const defaultPresetOptions = {
  backgroundOptions: {
    color: 'transparent'
  },
  imageOptions: {
    margin: 0
  },
  width: 200,
  height: 200,
  margin: 0,
  type: 'svg' as DrawType
}

// Tofu changed this file: this copy ships without the upstream's brand and
// personal presets (and their logos in src/assets/presets and preview images
// in public/presets). Plain is the one built-in style; add your own preset to
// builtInPresets below, or pass a list through VITE_QR_CODE_PRESETS.

export const plainPreset = {
  ...defaultPresetOptions,
  name: 'Plain',
  ...PlainConfig.props,
  style: PlainConfig.style
} as Preset

export const builtInPresets: Preset[] = [plainPreset]

function parsePresetsFromEnv(envVal?: string): Preset[] | undefined {
  if (!envVal) return undefined
  try {
    return JSON.parse(envVal) as Preset[]
  } catch (err) {
    console.error('Failed to parse VITE_QR_CODE_PRESETS', err)
    return undefined
  }
}

const envPresets = parsePresetsFromEnv(import.meta.env.VITE_QR_CODE_PRESETS)
export const allQrCodePresets: Preset[] = envPresets ?? builtInPresets

export const defaultPreset: Preset = import.meta.env.VITE_DEFAULT_PRESET
  ? (allQrCodePresets.find((p) => p.name === import.meta.env.VITE_DEFAULT_PRESET) ??
    allQrCodePresets[0])
  : allQrCodePresets[0]

/**
 * Logo image URLs are looser than frame background images
 * (isValidFrameBackgroundImage): besides http(s) and data:image, built-in
 * presets use Vite asset paths (e.g. /assets/placeholder_image-<hash>.png),
 * so scheme-less same-origin paths must stay loadable. Only an explicit
 * non-http(s), non-image scheme (javascript:, file:, data:text/html, …) is
 * rejected — those have no business in an <image href>.
 */
export function isSafeImageUrl(value: string): boolean {
  if (value === '') return true
  if (/^data:/i.test(value)) return /^data:image\//i.test(value)
  const scheme = /^[a-z][a-z0-9+.-]*:/i.exec(value)
  if (scheme) return /^https?:$/i.test(scheme[0])
  return true // scheme-less: relative or root-relative same-origin path
}

export function isValidQRCodeConfig(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false
  const c = value as Record<string, unknown>
  if (!c.props || typeof c.props !== 'object') return false
  const props = c.props as Record<string, unknown>
  if (props.image != null && (typeof props.image !== 'string' || !isSafeImageUrl(props.image))) {
    return false
  }
  if (!c.style || typeof c.style !== 'object') return false
  const style = c.style as Record<string, unknown>
  if (typeof style.borderRadius !== 'string') return false
  if (c.frame != null && !isValidFrameConfig(c.frame)) return false
  return true
}
