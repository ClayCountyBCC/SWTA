import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/app.css';
import { applyAppearanceToDocument, readAppearancePreference } from './theme/themeDefinitions';

const rootElement = document.getElementById('root');

if (rootElement) {
  const bootstrap = window.__SOLID_WASTE_REACT_BOOTSTRAP__ ?? {};
  const initialAppearance = readAppearancePreference();
  applyAppearanceToDocument(initialAppearance);
  createRoot(rootElement).render(<App bootstrap={bootstrap} initialAppearance={initialAppearance} />);
}
