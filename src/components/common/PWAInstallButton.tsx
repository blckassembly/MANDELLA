import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Smartphone, X } from 'lucide-react';

export const PWAInstallButton: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-medium transition cursor-pointer shadow-xs ${className}`}
        title="Install Mandela Connect as a native desktop or mobile PWA application with offline capabilities"
      >
        <Download className="w-3.5 h-3.5 shrink-0" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow (beforeinstallprompt is not supported by WebKit)
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] border border-black/20 text-black hover:bg-zinc-100 text-xs font-mono font-medium transition cursor-pointer ${className}`}
          title="Install Mandela Connect on iOS Home Screen"
        >
          <Smartphone className="w-3.5 h-3.5 shrink-0" />
          <span>Install iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-sm rounded-[3px] bg-white p-5 shadow-2xl border border-black/20 text-black font-sans">
              <div className="flex items-center justify-between border-b border-black/10 pb-3">
                <h3 className="text-sm font-bold text-black flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  Install on iPhone / iPad
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded hover:bg-zinc-100 text-black/50 hover:text-black cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-3 text-xs text-black/75 space-y-2.5 leading-relaxed">
                <p>To enable <strong>Offline Read-Only Mode</strong> in remote areas:</p>
                <div className="bg-zinc-50 border border-black/10 p-2.5 rounded-[2px] space-y-1.5 font-mono text-[11px]">
                  <div>1. Tap the <strong>Share</strong> button in Safari toolbar.</div>
                  <div>2. Scroll down and tap <strong>Add to Home Screen</strong>.</div>
                  <div>3. Launch <strong>MandelaCore</strong> from home screen.</div>
                </div>
                <p className="text-[11px] text-black/50">
                  Static assets and API caches will be pre-cached by Workbox for offline field operations.
                </p>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-[2px] bg-black text-white py-2 text-xs font-mono font-semibold hover:bg-zinc-800 cursor-pointer"
              >
                Close Guide
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback for general desktop browsers that don't emit prompt yet
  return (
    <button
      onClick={() => {
        alert("To install Mandela Connect: In Chrome/Edge, click the install icon in the URL bar, or choose 'Install Mandela Connect' from the browser menu.");
      }}
      className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] border border-black/20 text-black/70 hover:text-black hover:bg-zinc-100 text-xs font-mono font-medium transition cursor-pointer ${className}`}
      title="PWA Installable App"
    >
      <Download className="w-3.5 h-3.5 shrink-0" />
      <span>Install PWA</span>
    </button>
  );
};
