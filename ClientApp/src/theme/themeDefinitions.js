export const THEME_STORAGE_KEY = 'swta-react.appearance';

export const THEME_MODES = [
  { id: 'system', label: 'System', description: 'Follow the device preference.' },
  { id: 'light', label: 'Light', description: 'Use a bright workspace.' },
  { id: 'dark', label: 'Dark', description: 'Use a low-light workspace.' }
];

export const FONT_OPTIONS = [
  { id: 'aptos', label: 'Aptos', value: '"Aptos", "Segoe UI", sans-serif' },
  { id: 'system', label: 'System sans', value: '"Segoe UI", system-ui, sans-serif' },
  { id: 'trebuchet', label: 'Trebuchet', value: '"Trebuchet MS", sans-serif' },
  { id: 'georgia', label: 'Georgia', value: 'Georgia, "Times New Roman", serif' },
  { id: 'mono', label: 'Monospace', value: 'Consolas, "Courier New", monospace' }
];

const COLOR_PATTERN = /^#[0-9a-f]{6}$/i;

function createVariant(overrides) {
  return {
    '--color-page': '#edf2f5',
    '--color-page-end': '#e2e9ee',
    '--color-page-glow': 'rgba(255, 255, 255, 0.95)',
    '--color-text': '#172536',
    '--color-text-strong': '#17324d',
    '--color-muted': '#607384',
    '--color-subtle': '#6a7f91',
    '--color-header': '#17324d',
    '--color-header-text': '#f5f8fb',
    '--color-header-border': 'rgba(255, 255, 255, 0.24)',
    '--color-banner': '#7b2e2e',
    '--color-banner-text': '#fff8f0',
    '--color-surface': 'rgba(255, 255, 255, 0.91)',
    '--color-surface-solid': '#ffffff',
    '--color-surface-soft': '#f8fafb',
    '--color-surface-subtle': '#f2f6f8',
    '--color-input': '#fbfcfd',
    '--color-input-text': '#17324d',
    '--color-border': '#d3dde4',
    '--color-border-soft': '#dce5eb',
    '--color-border-strong': '#cbd7df',
    '--color-accent': '#2f6f9f',
    '--color-accent-dark': '#245a82',
    '--color-accent-deep': '#1b4d70',
    '--color-accent-soft': '#eef6fb',
    '--color-focus': 'rgba(116, 181, 215, 0.85)',
    '--color-editor': '#ffffe4',
    '--color-editor-border': '#ddd8bc',
    '--color-editor-text': '#2e2a27',
    '--color-danger-surface': '#fff4f4',
    '--color-danger-border': '#e6b9b9',
    '--color-danger-text': '#8b2e2e',
    '--color-disabled': '#d9e0e5',
    '--color-disabled-text': '#81909a',
    '--color-overlay': 'rgba(12, 29, 44, 0.66)',
    '--color-selection': 'rgba(47, 111, 159, 0.16)',
    '--shadow-card': '0 12px 28px rgba(28, 54, 75, 0.08)',
    '--shadow-header': '0 12px 30px rgba(16, 43, 68, 0.18)',
    '--shadow-modal': '0 24px 70px rgba(8, 25, 40, 0.36)',
    '--shadow-button': '0 5px 12px rgba(47, 111, 159, 0.2)',
    ...overrides
  };
}

export const THEME_PRESETS = [
  {
    id: 'clay-county',
    label: 'Clay County',
    description: 'The default blue county workspace.',
    light: createVariant({}),
    dark: createVariant({
      '--color-page': '#101c28',
      '--color-page-end': '#162b3d',
      '--color-page-glow': 'rgba(57, 99, 129, 0.28)',
      '--color-text': '#e6eef4',
      '--color-text-strong': '#f4f8fb',
      '--color-muted': '#afc0ce',
      '--color-subtle': '#9eb4c5',
      '--color-header': '#0b1723',
      '--color-header-text': '#f3f7fa',
      '--color-header-border': 'rgba(255, 255, 255, 0.2)',
      '--color-surface': 'rgba(27, 44, 59, 0.94)',
      '--color-surface-solid': '#1b2c3b',
      '--color-surface-soft': '#172735',
      '--color-surface-subtle': '#203646',
      '--color-input': '#132330',
      '--color-input-text': '#edf5fa',
      '--color-border': '#314b5e',
      '--color-border-soft': '#2a4356',
      '--color-border-strong': '#456277',
      '--color-accent': '#5fa8d3',
      '--color-accent-dark': '#438cb9',
      '--color-accent-deep': '#8cc7e7',
      '--color-accent-soft': '#193b52',
      '--color-focus': 'rgba(140, 199, 231, 0.9)',
      '--color-editor': '#2e3320',
      '--color-editor-border': '#5e603a',
      '--color-editor-text': '#f0f2d7',
      '--color-danger-surface': '#40272b',
      '--color-danger-border': '#86525a',
      '--color-danger-text': '#ffb9c1',
      '--color-disabled': '#40515d',
      '--color-disabled-text': '#9aaab5',
      '--color-overlay': 'rgba(2, 9, 15, 0.75)',
      '--color-selection': 'rgba(95, 168, 211, 0.2)',
      '--shadow-card': '0 16px 34px rgba(0, 0, 0, 0.24)',
      '--shadow-header': '0 12px 30px rgba(0, 0, 0, 0.28)',
      '--shadow-modal': '0 24px 70px rgba(0, 0, 0, 0.45)',
      '--shadow-button': '0 5px 12px rgba(0, 0, 0, 0.24)'
    })
  },
  {
    id: 'codex',
    label: 'Codex',
    description: 'A focused charcoal and blue theme.',
    light: createVariant({
      '--color-page': '#f3f6f8',
      '--color-page-end': '#e7edf2',
      '--color-text-strong': '#152233',
      '--color-header': '#142131',
      '--color-accent': '#326fe0',
      '--color-accent-dark': '#2759b8',
      '--color-accent-deep': '#244f9d',
      '--color-accent-soft': '#eaf0ff',
      '--color-focus': 'rgba(50, 111, 224, 0.55)'
    }),
    dark: createVariant({
      '--color-page': '#101114',
      '--color-page-end': '#17191d',
      '--color-page-glow': 'rgba(255, 255, 255, 0.06)',
      '--color-text': '#e7e9ed',
      '--color-text-strong': '#f7f8fa',
      '--color-muted': '#a5aab4',
      '--color-subtle': '#9babc2',
      '--color-header': '#0b0c0e',
      '--color-header-text': '#f7f8fa',
      '--color-surface': 'rgba(28, 30, 35, 0.96)',
      '--color-surface-solid': '#1c1e23',
      '--color-surface-soft': '#181a1e',
      '--color-surface-subtle': '#25282e',
      '--color-input': '#15171b',
      '--color-input-text': '#f2f3f5',
      '--color-border': '#343840',
      '--color-border-soft': '#2b2e35',
      '--color-border-strong': '#4d525d',
      '--color-accent': '#79a7ff',
      '--color-accent-dark': '#5b8fee',
      '--color-accent-deep': '#a7c3ff',
      '--color-accent-soft': '#202c45',
      '--color-focus': 'rgba(121, 167, 255, 0.85)',
      '--color-editor': '#30321f',
      '--color-editor-border': '#5d5f3c',
      '--color-editor-text': '#f1f1d3',
      '--color-danger-surface': '#392226',
      '--color-danger-border': '#73444d',
      '--color-danger-text': '#ffb3be',
      '--color-disabled': '#3d4149',
      '--color-disabled-text': '#9ca2ad',
      '--color-overlay': 'rgba(0, 0, 0, 0.76)',
      '--color-selection': 'rgba(121, 167, 255, 0.2)',
      '--shadow-card': '0 16px 34px rgba(0, 0, 0, 0.28)',
      '--shadow-header': '0 12px 30px rgba(0, 0, 0, 0.34)',
      '--shadow-modal': '0 24px 70px rgba(0, 0, 0, 0.52)',
      '--shadow-button': '0 5px 12px rgba(0, 0, 0, 0.3)'
    })
  },
  {
    id: 'linear',
    label: 'Linear',
    description: 'A quiet slate theme with indigo accents.',
    light: createVariant({
      '--color-page': '#f7f8fb',
      '--color-page-end': '#edf0f6',
      '--color-header': '#24263a',
      '--color-accent': '#6558d3',
      '--color-accent-dark': '#5146b7',
      '--color-accent-deep': '#433a9f',
      '--color-accent-soft': '#f0efff',
      '--color-focus': 'rgba(101, 88, 211, 0.5)'
    }),
    dark: createVariant({
      '--color-page': '#141519',
      '--color-page-end': '#1d1f25',
      '--color-page-glow': 'rgba(255, 255, 255, 0.05)',
      '--color-text': '#e8e9ee',
      '--color-text-strong': '#fafafd',
      '--color-muted': '#a6a9b4',
      '--color-subtle': '#a5a8bb',
      '--color-header': '#101116',
      '--color-header-text': '#fafafd',
      '--color-surface': 'rgba(31, 33, 40, 0.96)',
      '--color-surface-solid': '#1f2128',
      '--color-surface-soft': '#1a1c22',
      '--color-surface-subtle': '#292c35',
      '--color-input': '#181a20',
      '--color-input-text': '#f3f4f8',
      '--color-border': '#373a45',
      '--color-border-soft': '#2d3039',
      '--color-border-strong': '#505461',
      '--color-accent': '#a99cff',
      '--color-accent-dark': '#8c7cf0',
      '--color-accent-deep': '#c9c1ff',
      '--color-accent-soft': '#302d4e',
      '--color-focus': 'rgba(169, 156, 255, 0.8)',
      '--color-editor': '#303221',
      '--color-editor-border': '#5d603d',
      '--color-editor-text': '#f3f3d6',
      '--color-danger-surface': '#3a252b',
      '--color-danger-border': '#704650',
      '--color-danger-text': '#ffb7c4',
      '--color-disabled': '#41434c',
      '--color-disabled-text': '#a1a5af',
      '--color-overlay': 'rgba(0, 0, 0, 0.76)',
      '--color-selection': 'rgba(169, 156, 255, 0.2)',
      '--shadow-card': '0 16px 34px rgba(0, 0, 0, 0.28)',
      '--shadow-header': '0 12px 30px rgba(0, 0, 0, 0.35)',
      '--shadow-modal': '0 24px 70px rgba(0, 0, 0, 0.5)',
      '--shadow-button': '0 5px 12px rgba(0, 0, 0, 0.28)'
    })
  },
  {
    id: 'github',
    label: 'GitHub',
    description: 'A clean neutral theme with blue links.',
    light: createVariant({
      '--color-page': '#f6f8fa',
      '--color-page-end': '#eef1f4',
      '--color-header': '#24292f',
      '--color-accent': '#0969da',
      '--color-accent-dark': '#0554ae',
      '--color-accent-deep': '#034da1',
      '--color-accent-soft': '#ddf4ff',
      '--color-focus': 'rgba(9, 105, 218, 0.45)',
      '--color-border': '#d0d7de',
      '--color-border-soft': '#d8dee4'
    }),
    dark: createVariant({
      '--color-page': '#0d1117',
      '--color-page-end': '#161b22',
      '--color-page-glow': 'rgba(255, 255, 255, 0.04)',
      '--color-text': '#e6edf3',
      '--color-text-strong': '#f0f6fc',
      '--color-muted': '#8b949e',
      '--color-subtle': '#8b949e',
      '--color-header': '#010409',
      '--color-header-text': '#f0f6fc',
      '--color-surface': 'rgba(22, 27, 34, 0.96)',
      '--color-surface-solid': '#161b22',
      '--color-surface-soft': '#0d1117',
      '--color-surface-subtle': '#21262d',
      '--color-input': '#0d1117',
      '--color-input-text': '#e6edf3',
      '--color-border': '#30363d',
      '--color-border-soft': '#21262d',
      '--color-border-strong': '#484f58',
      '--color-accent': '#58a6ff',
      '--color-accent-dark': '#388bfd',
      '--color-accent-deep': '#79c0ff',
      '--color-accent-soft': '#12233a',
      '--color-focus': 'rgba(88, 166, 255, 0.8)',
      '--color-editor': '#30321f',
      '--color-editor-border': '#5d603d',
      '--color-editor-text': '#f3f3d6',
      '--color-danger-surface': '#3a1f24',
      '--color-danger-border': '#6e4047',
      '--color-danger-text': '#ff7b72',
      '--color-disabled': '#30363d',
      '--color-disabled-text': '#8b949e',
      '--color-overlay': 'rgba(1, 4, 9, 0.78)',
      '--color-selection': 'rgba(88, 166, 255, 0.2)',
      '--shadow-card': '0 16px 34px rgba(1, 4, 9, 0.35)',
      '--shadow-header': '0 12px 30px rgba(1, 4, 9, 0.4)',
      '--shadow-modal': '0 24px 70px rgba(1, 4, 9, 0.6)',
      '--shadow-button': '0 5px 12px rgba(1, 4, 9, 0.35)'
    })
  },
  {
    id: 'dracula',
    label: 'Dracula',
    description: 'A high-color dark theme with purple accents.',
    light: createVariant({
      '--color-page': '#f8f7fb',
      '--color-page-end': '#efedf5',
      '--color-header': '#44475a',
      '--color-accent': '#7c5cc4',
      '--color-accent-dark': '#6547a8',
      '--color-accent-deep': '#523b8e',
      '--color-accent-soft': '#f0ebff',
      '--color-focus': 'rgba(124, 92, 196, 0.5)'
    }),
    dark: createVariant({
      '--color-page': '#282a36',
      '--color-page-end': '#343746',
      '--color-page-glow': 'rgba(255, 255, 255, 0.06)',
      '--color-text': '#f8f8f2',
      '--color-text-strong': '#ffffff',
      '--color-muted': '#bdc0cd',
      '--color-subtle': '#b7b9c7',
      '--color-header': '#191a21',
      '--color-header-text': '#f8f8f2',
      '--color-surface': 'rgba(68, 71, 90, 0.96)',
      '--color-surface-solid': '#44475a',
      '--color-surface-soft': '#343746',
      '--color-surface-subtle': '#505368',
      '--color-input': '#282a36',
      '--color-input-text': '#f8f8f2',
      '--color-border': '#62657b',
      '--color-border-soft': '#505368',
      '--color-border-strong': '#7b7f99',
      '--color-accent': '#bd93f9',
      '--color-accent-dark': '#a873ed',
      '--color-accent-deep': '#d6b7ff',
      '--color-accent-soft': '#4a3d63',
      '--color-focus': 'rgba(189, 147, 249, 0.85)',
      '--color-editor': '#46452b',
      '--color-editor-border': '#77724a',
      '--color-editor-text': '#fff9c9',
      '--color-danger-surface': '#512b3c',
      '--color-danger-border': '#a85a75',
      '--color-danger-text': '#ff92b6',
      '--color-disabled': '#55586c',
      '--color-disabled-text': '#b7b9c7',
      '--color-overlay': 'rgba(17, 18, 24, 0.78)',
      '--color-selection': 'rgba(189, 147, 249, 0.2)',
      '--shadow-card': '0 16px 34px rgba(17, 18, 24, 0.3)',
      '--shadow-header': '0 12px 30px rgba(17, 18, 24, 0.4)',
      '--shadow-modal': '0 24px 70px rgba(17, 18, 24, 0.58)',
      '--shadow-button': '0 5px 12px rgba(17, 18, 24, 0.3)'
    })
  },
  {
    id: 'gruvbox',
    label: 'Gruvbox',
    description: 'A warm, earthy theme with amber accents.',
    light: createVariant({
      '--color-page': '#f7f2e8',
      '--color-page-end': '#eee6d4',
      '--color-header': '#3c3836',
      '--color-accent': '#b57614',
      '--color-accent-dark': '#95600d',
      '--color-accent-deep': '#754908',
      '--color-accent-soft': '#fff0c9',
      '--color-focus': 'rgba(181, 118, 20, 0.5)',
      '--color-surface': 'rgba(255, 252, 244, 0.94)',
      '--color-surface-subtle': '#f3ead7',
      '--color-input': '#fffaf0'
    }),
    dark: createVariant({
      '--color-page': '#282828',
      '--color-page-end': '#3c3836',
      '--color-page-glow': 'rgba(255, 255, 255, 0.04)',
      '--color-text': '#ebdbb2',
      '--color-text-strong': '#fbf1c7',
      '--color-muted': '#bdae93',
      '--color-subtle': '#bdae93',
      '--color-header': '#1d2021',
      '--color-header-text': '#fbf1c7',
      '--color-surface': 'rgba(60, 56, 54, 0.96)',
      '--color-surface-solid': '#3c3836',
      '--color-surface-soft': '#32302f',
      '--color-surface-subtle': '#504945',
      '--color-input': '#282828',
      '--color-input-text': '#ebdbb2',
      '--color-border': '#665c54',
      '--color-border-soft': '#504945',
      '--color-border-strong': '#7c6f64',
      '--color-accent': '#fabd2f',
      '--color-accent-dark': '#d79921',
      '--color-accent-deep': '#ffd75f',
      '--color-accent-soft': '#544719',
      '--color-focus': 'rgba(250, 189, 47, 0.8)',
      '--color-editor': '#4b4223',
      '--color-editor-border': '#806f31',
      '--color-editor-text': '#fff1b8',
      '--color-danger-surface': '#542d2d',
      '--color-danger-border': '#9d4d3d',
      '--color-danger-text': '#fb4934',
      '--color-disabled': '#504945',
      '--color-disabled-text': '#bdae93',
      '--color-overlay': 'rgba(20, 19, 18, 0.8)',
      '--color-selection': 'rgba(250, 189, 47, 0.2)',
      '--shadow-card': '0 16px 34px rgba(20, 19, 18, 0.3)',
      '--shadow-header': '0 12px 30px rgba(20, 19, 18, 0.4)',
      '--shadow-modal': '0 24px 70px rgba(20, 19, 18, 0.58)',
      '--shadow-button': '0 5px 12px rgba(20, 19, 18, 0.3)'
    })
  },
  {
    id: 'everforest',
    label: 'Everforest',
    description: 'A calm green theme for long sessions.',
    light: createVariant({
      '--color-page': '#f3f5ed',
      '--color-page-end': '#e7ecdf',
      '--color-header': '#3a4b40',
      '--color-accent': '#5a9367',
      '--color-accent-dark': '#477b54',
      '--color-accent-deep': '#376843',
      '--color-accent-soft': '#e5f2e2',
      '--color-focus': 'rgba(90, 147, 103, 0.5)'
    }),
    dark: createVariant({
      '--color-page': '#2d353b',
      '--color-page-end': '#3d484d',
      '--color-page-glow': 'rgba(255, 255, 255, 0.04)',
      '--color-text': '#d3c6aa',
      '--color-text-strong': '#f2efdf',
      '--color-muted': '#a7b0a0',
      '--color-subtle': '#a7b0a0',
      '--color-header': '#232b2d',
      '--color-header-text': '#f2efdf',
      '--color-surface': 'rgba(61, 72, 77, 0.96)',
      '--color-surface-solid': '#3d484d',
      '--color-surface-soft': '#343f44',
      '--color-surface-subtle': '#4b575c',
      '--color-input': '#2d353b',
      '--color-input-text': '#d3c6aa',
      '--color-border': '#5a686d',
      '--color-border-soft': '#4b575c',
      '--color-border-strong': '#718083',
      '--color-accent': '#a7c080',
      '--color-accent-dark': '#83a765',
      '--color-accent-deep': '#c3d99a',
      '--color-accent-soft': '#3c4d3f',
      '--color-focus': 'rgba(167, 192, 128, 0.8)',
      '--color-editor': '#48482c',
      '--color-editor-border': '#707047',
      '--color-editor-text': '#f2f0bd',
      '--color-danger-surface': '#513936',
      '--color-danger-border': '#8e5d54',
      '--color-danger-text': '#e67e80',
      '--color-disabled': '#4b575c',
      '--color-disabled-text': '#a7b0a0',
      '--color-overlay': 'rgba(24, 29, 30, 0.8)',
      '--color-selection': 'rgba(167, 192, 128, 0.2)',
      '--shadow-card': '0 16px 34px rgba(24, 29, 30, 0.3)',
      '--shadow-header': '0 12px 30px rgba(24, 29, 30, 0.4)',
      '--shadow-modal': '0 24px 70px rgba(24, 29, 30, 0.58)',
      '--shadow-button': '0 5px 12px rgba(24, 29, 30, 0.3)'
    })
  }
];

const presetMap = new Map(THEME_PRESETS.map((preset) => [preset.id, preset]));
const fontMap = new Map(FONT_OPTIONS.map((font) => [font.id, font]));

export const DEFAULT_APPEARANCE = Object.freeze({
  mode: 'system',
  preset: 'clay-county',
  accent: '',
  background: '',
  foreground: '',
  font: 'aptos',
  translucentPanels: false,
  contrast: 'standard',
  reduceMotion: 'system',
  fontSize: 16
});

function isValidColor(value) {
  return typeof value === 'string' && COLOR_PATTERN.test(value);
}

export function normalizeAppearance(value) {
  const candidate = value && typeof value === 'object' ? value : {};
  const fontSize = Number(candidate.fontSize);

  return {
    ...DEFAULT_APPEARANCE,
    ...candidate,
    mode: THEME_MODES.some((option) => option.id === candidate.mode)
      ? candidate.mode
      : DEFAULT_APPEARANCE.mode,
    preset: presetMap.has(candidate.preset) ? candidate.preset : DEFAULT_APPEARANCE.preset,
    accent: isValidColor(candidate.accent) ? candidate.accent : '',
    background: isValidColor(candidate.background) ? candidate.background : '',
    foreground: isValidColor(candidate.foreground) ? candidate.foreground : '',
    font: fontMap.has(candidate.font) ? candidate.font : DEFAULT_APPEARANCE.font,
    translucentPanels: candidate.translucentPanels === true,
    contrast: candidate.contrast === 'high' ? 'high' : 'standard',
    reduceMotion: ['system', 'on', 'off'].includes(candidate.reduceMotion)
      ? candidate.reduceMotion
      : DEFAULT_APPEARANCE.reduceMotion,
    fontSize: Number.isFinite(fontSize) ? Math.min(20, Math.max(12, fontSize)) : DEFAULT_APPEARANCE.fontSize
  };
}

export function readAppearancePreference() {
  if (typeof window === 'undefined') {
    return { ...DEFAULT_APPEARANCE };
  }

  try {
    const storedValue = window.localStorage.getItem(THEME_STORAGE_KEY);
    return storedValue ? normalizeAppearance(JSON.parse(storedValue)) : { ...DEFAULT_APPEARANCE };
  } catch (error) {
    return { ...DEFAULT_APPEARANCE };
  }
}

export function saveAppearancePreference(appearance) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(normalizeAppearance(appearance)));
  } catch (error) {
    // The theme still applies for the current session if browser storage is unavailable.
  }
}

export function getSystemMode() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'light';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function getEffectiveMode(appearance) {
  return appearance.mode === 'system' ? getSystemMode() : appearance.mode;
}

export function getThemePreset(presetId) {
  return presetMap.get(presetId) ?? presetMap.get(DEFAULT_APPEARANCE.preset);
}

function hexToRgb(color) {
  if (!isValidColor(color)) {
    return null;
  }

  return {
    red: Number.parseInt(color.slice(1, 3), 16),
    green: Number.parseInt(color.slice(3, 5), 16),
    blue: Number.parseInt(color.slice(5, 7), 16)
  };
}

function rgbToHex(red, green, blue) {
  return `#${[red, green, blue]
    .map((channel) => Math.max(0, Math.min(255, Math.round(channel))).toString(16).padStart(2, '0'))
    .join('')}`;
}

function shadeColor(color, amount) {
  const rgb = hexToRgb(color);
  if (!rgb) {
    return color;
  }

  return rgbToHex(
    rgb.red + (amount < 0 ? rgb.red * amount : (255 - rgb.red) * amount),
    rgb.green + (amount < 0 ? rgb.green * amount : (255 - rgb.green) * amount),
    rgb.blue + (amount < 0 ? rgb.blue * amount : (255 - rgb.blue) * amount)
  );
}

function withCustomColors(tokens, appearance) {
  if (!appearance.accent && !appearance.background && !appearance.foreground) {
    return tokens;
  }

  const nextTokens = { ...tokens };

  if (appearance.accent) {
    nextTokens['--color-accent'] = appearance.accent;
    nextTokens['--color-accent-dark'] = shadeColor(appearance.accent, -0.18);
    nextTokens['--color-accent-deep'] = shadeColor(appearance.accent, 0.18);
    nextTokens['--color-accent-soft'] = `${appearance.accent}22`;
    nextTokens['--color-focus'] = `${appearance.accent}99`;
  }

  if (appearance.background) {
    nextTokens['--color-page'] = appearance.background;
    nextTokens['--color-page-end'] = shadeColor(appearance.background, 0.08);
    nextTokens['--color-page-glow'] = `${appearance.background}cc`;
  }

  if (appearance.foreground) {
    nextTokens['--color-text'] = appearance.foreground;
    nextTokens['--color-text-strong'] = appearance.foreground;
    nextTokens['--color-header-text'] = appearance.foreground;
  }

  return nextTokens;
}

export function getThemeTokens(appearance, effectiveMode = getEffectiveMode(appearance)) {
  const preset = getThemePreset(appearance.preset);
  return withCustomColors(preset[effectiveMode], appearance);
}

export function getFontFamily(fontId) {
  return fontMap.get(fontId)?.value ?? fontMap.get(DEFAULT_APPEARANCE.font).value;
}

export function getCurrentThemeColor(appearance, tokenName) {
  const tokens = getThemeTokens(appearance);
  return tokens[tokenName];
}

export function applyAppearanceToDocument(appearance, effectiveMode = getEffectiveMode(appearance)) {
  if (typeof document === 'undefined') {
    return;
  }

  const root = document.documentElement;
  const normalizedAppearance = normalizeAppearance(appearance);
  const tokens = getThemeTokens(normalizedAppearance, effectiveMode);
  const reduceMotion = normalizedAppearance.reduceMotion === 'on'
    || (normalizedAppearance.reduceMotion === 'system'
      && typeof window !== 'undefined'
      && typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  root.dataset.themeMode = effectiveMode;
  root.dataset.themePreset = normalizedAppearance.preset;
  root.dataset.contrast = normalizedAppearance.contrast;
  root.dataset.translucentPanels = normalizedAppearance.translucentPanels ? 'true' : 'false';
  root.dataset.reduceMotion = reduceMotion ? 'true' : 'false';
  root.style.setProperty('--ui-font-family', getFontFamily(normalizedAppearance.font));
  root.style.setProperty('--ui-font-size', `${normalizedAppearance.fontSize}px`);
  root.style.setProperty('--color-scheme', effectiveMode);

  Object.entries(tokens).forEach(([name, value]) => {
    root.style.setProperty(name, value);
  });
}

