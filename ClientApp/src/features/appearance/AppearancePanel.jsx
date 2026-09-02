import { useRef, useState } from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import {
  FONT_OPTIONS,
  getCurrentThemeColor,
  getThemePreset,
  THEME_MODES,
  THEME_PRESETS,
  normalizeAppearance
} from '../../theme/themeDefinitions';

function ThemeModePreview({ mode }) {
  return (
    <span className={`theme-mode-preview theme-mode-preview--${mode}`} aria-hidden="true">
      <span className="theme-mode-preview__bar" />
      <span className="theme-mode-preview__card">
        <span />
        <span />
        <span />
      </span>
    </span>
  );
}

function ColorControl({ label, value, inheritedValue, onChange, onReset }) {
  const hasOverride = value !== '';
  const displayedValue = value || inheritedValue;

  return (
    <div className="appearance-control appearance-control--color">
      <div>
        <span className="appearance-control__label">{label}</span>
        <small>{hasOverride ? 'Custom color' : 'Theme color'}</small>
      </div>
      <div className="appearance-control__color-actions">
        <input
          type="color"
          value={displayedValue}
          onChange={(event) => onChange(event.target.value)}
          aria-label={`${label} color`}
        />
        <code>{displayedValue}</code>
        {hasOverride ? (
          <button type="button" className="appearance-reset-control" onClick={onReset}>
            Reset
          </button>
        ) : null}
      </div>
    </div>
  );
}

function AppearancePanel({ onClose }) {
  const { appearance, effectiveMode, updateAppearance, resetAppearance } = useTheme();
  const fileInputRef = useRef(null);
  const [status, setStatus] = useState('');
  const activePreset = getThemePreset(appearance.preset);

  function updatePreset(event) {
    updateAppearance({
      preset: event.target.value,
      accent: '',
      background: '',
      foreground: ''
    });
    setStatus('');
  }

  async function copyTheme() {
    const exportValue = JSON.stringify({
      application: 'SWTA-react',
      version: 1,
      appearance
    }, null, 2);

    try {
      await navigator.clipboard.writeText(exportValue);
      setStatus('Theme copied to the clipboard.');
    } catch (error) {
      setStatus('The theme could not be copied from this browser.');
    }
  }

  function importTheme(event) {
    const [file] = event.target.files ?? [];
    event.target.value = '';

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(String(reader.result));
        const importedAppearance = imported.appearance ?? imported;
        updateAppearance(normalizeAppearance(importedAppearance));
        setStatus('Theme imported.');
      } catch (error) {
        setStatus('The selected theme file is not valid.');
      }
    };
    reader.onerror = () => setStatus('The selected theme file could not be read.');
    reader.readAsText(file);
  }

  function resetAll() {
    resetAppearance();
    setStatus('Appearance reset to the default.');
  }

  const accentValue = appearance.accent || getCurrentThemeColor(appearance, '--color-accent');
  const backgroundValue = appearance.background || getCurrentThemeColor(appearance, '--color-page');
  const foregroundValue = appearance.foreground || getCurrentThemeColor(appearance, '--color-text');

  return (
    <aside id="appearance-panel" className="appearance-panel" aria-label="Appearance settings">
      <div className="appearance-panel__heading">
        <div>
          <p className="section-kicker">Appearance</p>
          <h2>Theme</h2>
        </div>
        <button type="button" className="icon-button" onClick={onClose} aria-label="Close appearance settings">
          x
        </button>
      </div>

      <div className="theme-mode-grid" role="group" aria-label="Color mode">
        {THEME_MODES.map((mode) => (
          <button
            key={mode.id}
            type="button"
            className={`theme-mode-card ${appearance.mode === mode.id ? 'theme-mode-card--active' : ''}`}
            onClick={() => updateAppearance({ mode: mode.id })}
            aria-pressed={appearance.mode === mode.id}
          >
            <ThemeModePreview mode={mode.id} />
            <strong>{mode.label}</strong>
            <span>{mode.description}</span>
          </button>
        ))}
      </div>

      <section className="appearance-section">
        <div className="appearance-section__heading">
          <div>
            <h3>{effectiveMode === 'dark' ? 'Dark' : 'Light'} theme</h3>
            <p>Choose a preset or tune its design tokens.</p>
          </div>
          <div className="appearance-section__actions">
            <button type="button" className="appearance-text-button" onClick={() => fileInputRef.current?.click()}>
              Import
            </button>
            <button type="button" className="appearance-text-button" onClick={copyTheme}>
              Copy theme
            </button>
            <button type="button" className="appearance-text-button" onClick={resetAll}>
              Reset
            </button>
            <input ref={fileInputRef} type="file" accept="application/json,.json" onChange={importTheme} hidden />
          </div>
        </div>

        <label className="appearance-control appearance-control--select">
          <span className="appearance-control__label">Theme preset</span>
          <select value={appearance.preset} onChange={updatePreset}>
            {THEME_PRESETS.map((preset) => (
              <option key={preset.id} value={preset.id}>{preset.label}</option>
            ))}
          </select>
        </label>
        <p className="appearance-preset-description">{activePreset.description}</p>

        <ColorControl
          label="Accent"
          value={appearance.accent}
          inheritedValue={accentValue}
          onChange={(accent) => updateAppearance({ accent })}
          onReset={() => updateAppearance({ accent: '' })}
        />
        <ColorControl
          label="Background"
          value={appearance.background}
          inheritedValue={backgroundValue}
          onChange={(background) => updateAppearance({ background })}
          onReset={() => updateAppearance({ background: '' })}
        />
        <ColorControl
          label="Foreground"
          value={appearance.foreground}
          inheritedValue={foregroundValue}
          onChange={(foreground) => updateAppearance({ foreground })}
          onReset={() => updateAppearance({ foreground: '' })}
        />

        <label className="appearance-control appearance-control--select">
          <span className="appearance-control__label">UI font</span>
          <select value={appearance.font} onChange={(event) => updateAppearance({ font: event.target.value })}>
            {FONT_OPTIONS.map((font) => (
              <option key={font.id} value={font.id}>{font.label}</option>
            ))}
          </select>
        </label>

        <div className="appearance-control">
          <div>
            <span className="appearance-control__label">Translucent panels</span>
            <small>Allow the page background to show through panels.</small>
          </div>
          <button
            type="button"
            className={`appearance-toggle ${appearance.translucentPanels ? 'appearance-toggle--on' : ''}`}
            onClick={() => updateAppearance({ translucentPanels: !appearance.translucentPanels })}
            aria-pressed={appearance.translucentPanels}
          >
            <span aria-hidden="true" />
            {appearance.translucentPanels ? 'On' : 'Off'}
          </button>
        </div>

        <label className="appearance-control appearance-control--select">
          <span className="appearance-control__label">Contrast</span>
          <select value={appearance.contrast} onChange={(event) => updateAppearance({ contrast: event.target.value })}>
            <option value="standard">Standard</option>
            <option value="high">High</option>
          </select>
        </label>
      </section>

      <section className="appearance-section appearance-section--preferences">
        <div className="appearance-section__heading">
          <div>
            <h3>Preferences</h3>
            <p>Adjust the interface for comfort and accessibility.</p>
          </div>
        </div>

        <div className="appearance-control appearance-control--stacked">
          <div>
            <span className="appearance-control__label">Reduce motion</span>
            <small>Reduce animations or follow the system preference.</small>
          </div>
          <div className="appearance-choice-group" role="group" aria-label="Reduce motion">
            {['system', 'on', 'off'].map((option) => (
              <button
                key={option}
                type="button"
                className={appearance.reduceMotion === option ? 'appearance-choice--active' : ''}
                onClick={() => updateAppearance({ reduceMotion: option })}
                aria-pressed={appearance.reduceMotion === option}
              >
                {option[0].toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <label className="appearance-control appearance-control--range">
          <div>
            <span className="appearance-control__label">UI font size</span>
            <small>Adjust the base size used by the application.</small>
          </div>
          <div className="appearance-range-value">
            <input
              type="range"
              min="12"
              max="20"
              step="1"
              value={appearance.fontSize}
              onChange={(event) => updateAppearance({ fontSize: Number(event.target.value) })}
              aria-label="UI font size"
            />
            <output>{appearance.fontSize}px</output>
          </div>
        </label>
      </section>

      {status ? <p className="appearance-status" role="status">{status}</p> : null}
    </aside>
  );
}

export default AppearancePanel;
