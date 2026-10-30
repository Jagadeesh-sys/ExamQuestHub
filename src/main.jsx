import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import './index.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
} else if (typeof window !== 'undefined' && typeof window.__EQH_BOOT_FAIL === 'function') {
  window.__EQH_BOOT_FAIL('The application root element is missing. Please reload the page.');
}
