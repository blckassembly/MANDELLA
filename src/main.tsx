import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

// Register Workbox service worker for static asset caching and critical API caching
// Enables full read-only resilience across remote African infrastructure
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    updateSW(true);
  },
  onOfflineReady() {
    console.info('[Workbox] Mandela Connect is offline-ready: static assets & critical APIs cached.');
  },
  onRegisterError(error) {
    console.warn('[Workbox] Service worker registration error:', error);
  },
});

createRoot(document.getElementById('root')!).render(<App />);
