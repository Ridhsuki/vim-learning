import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import App from './app/App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Register service worker only in production
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Use the base URL provided by Vite (e.g. /vim-learning/)
    const swUrl = import.meta.env.BASE_URL + 'sw.js';
    navigator.serviceWorker.register(swUrl).catch((err) => {
      console.warn('Service worker registration failed:', err);
    });
  });
}
