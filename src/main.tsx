// Ensure window.fetch is writable and has a setter to prevent "Cannot set property fetch of #<Window> which has only a getter"
try {
  if (typeof window !== 'undefined') {
    const origFetch = window.fetch;
    let currentFetch = origFetch ? origFetch.bind(window) : origFetch;
    Object.defineProperty(window, 'fetch', {
      get() {
        return currentFetch;
      },
      set(fn) {
        currentFetch = fn;
      },
      configurable: true,
      enumerable: true
    });
  }
} catch {
  // Ignored if already patched or protected
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
