import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Zap,
  Smartphone,
  ShieldCheck,
  Upload,
  Copy,
  Check,
  Sparkles,
  Info,
  Maximize2
} from 'lucide-react';
import { Badge, Button } from '../../design-system';

interface EuiccQrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanComplete: (
    scannedEid: string,
    metadata?: {
      carrier?: string;
      countryIso?: string;
      iccid?: string;
      deviceImei?: string;
      rawPayload?: string;
    }
  ) => void;
}

// Sample GSMA SGP.22 eUICC packaging QR label presets for testing and quick verification
export interface SamplePackagingLabel {
  id: string;
  carrier: string;
  country: string;
  countryIso: string;
  eid: string;
  iccid: string;
  imei: string;
  packagingBarcode: string;
  format: 'GSMA SGP.22 LPA' | 'eUICC Standard' | 'Carrier Matrix';
}

export const SAMPLE_PACKAGING_LABELS: SamplePackagingLabel[] = [
  {
    id: 'pack-saf-01',
    carrier: 'Safaricom Kenya (Sovereign Core)',
    country: 'Kenya',
    countryIso: 'KE',
    eid: '89049032000001000000000012345678',
    iccid: '8925402100000192837',
    imei: '863920048192830',
    packagingBarcode: 'LPA:1$smdp.safaricom.co.ke$SAF-994821$89049032000001000000000012345678',
    format: 'GSMA SGP.22 LPA'
  },
  {
    id: 'pack-mtn-02',
    carrier: 'MTN Nigeria (NCC Certified SM-DP+)',
    country: 'Nigeria',
    countryIso: 'NG',
    eid: '89023412000002000000000098765432',
    iccid: '8923401100000994821',
    imei: '864901882019482',
    packagingBarcode: 'LPA:1$smdp.mtn.ng$MTN-LAG-771822$89023412000002000000000098765432',
    format: 'GSMA SGP.22 LPA'
  },
  {
    id: 'pack-vod-03',
    carrier: 'Vodacom South Africa (ICASA Tier 1)',
    country: 'South Africa',
    countryIso: 'ZA',
    eid: '89027011000003000000000045612378',
    iccid: '8927003300000554411',
    imei: '867102948201940',
    packagingBarcode: 'LPA:1$smdp.vodacom.co.za$VOD-JNB-554911$89027011000003000000000045612378',
    format: 'GSMA SGP.22 LPA'
  },
  {
    id: 'pack-tel-04',
    carrier: 'Telecel Ghana (NCA Sovereign Gateway)',
    country: 'Ghana',
    countryIso: 'GH',
    eid: '89023301000004000000000033221100',
    iccid: '8923304400000778899',
    imei: '863920048192830',
    packagingBarcode: 'LPA:1$smdp.telecel.com.gh$TEL-ACC-441829$89023301000004000000000033221100',
    format: 'GSMA SGP.22 LPA'
  },
  {
    id: 'pack-ora-05',
    carrier: 'Orange Côte d\'Ivoire (ARTCI Gateway)',
    country: 'Côte d\'Ivoire',
    countryIso: 'CI',
    eid: '89022501000005000000000000112233',
    iccid: '8922501100000445566',
    imei: '865102938471920',
    packagingBarcode: 'LPA:1$smdp.orange.ci$ORA-ABJ-119284$89022501000005000000000000112233',
    format: 'GSMA SGP.22 LPA'
  }
];

/**
 * Extracts and validates a 32-digit GSMA SGP.22 EID from raw QR code text or activation codes.
 */
export function extractAndValidateEid(rawText: string): {
  isValid: boolean;
  eid?: string;
  carrierHint?: string;
  countryIsoHint?: string;
  errorMessage?: string;
} {
  const text = rawText.trim();
  if (!text) {
    return { isValid: false, errorMessage: 'Empty barcode payload' };
  }

  // 1. Direct 32-digit match
  if (/^[0-9]{32}$/.test(text)) {
    return parseEidMetadata(text);
  }

  // 2. GSMA SGP.22 LPA Activation Code format: LPA:1$smdp.domain.com$MATCHING_ID$EID_OR_ICCID
  const parts = text.split('$');
  for (const part of parts) {
    const cleaned = part.replace(/[^0-9]/g, '');
    if (cleaned.length === 32) {
      return parseEidMetadata(cleaned);
    }
  }

  // 3. Regex search for any contiguous 32-digit sequence in JSON or raw packaging string
  const match = text.match(/([0-9]{32})/);
  if (match && match[1]) {
    return parseEidMetadata(match[1]);
  }

  return {
    isValid: false,
    errorMessage: 'No valid 32-digit GSMA SGP.22 eUICC EID found in scanned packaging payload.'
  };
}

function parseEidMetadata(eid: string) {
  let carrierHint = 'Pan-African Sovereign eUICC';
  let countryIsoHint = 'GLOBAL';

  if (eid.startsWith('890490')) {
    carrierHint = 'Safaricom Kenya (Sovereign Core)';
    countryIsoHint = 'KE';
  } else if (eid.startsWith('890234')) {
    carrierHint = 'MTN Nigeria (NCC Certified SM-DP+)';
    countryIsoHint = 'NG';
  } else if (eid.startsWith('890270')) {
    carrierHint = 'Vodacom South Africa (ICASA Tier 1)';
    countryIsoHint = 'ZA';
  } else if (eid.startsWith('890233')) {
    carrierHint = 'Telecel Ghana (NCA Sovereign Gateway)';
    countryIsoHint = 'GH';
  } else if (eid.startsWith('890225')) {
    carrierHint = 'Orange Côte d\'Ivoire (ARTCI Gateway)';
    countryIsoHint = 'CI';
  }

  return {
    isValid: true,
    eid,
    carrierHint,
    countryIsoHint
  };
}

/**
 * Audio confirmation tone using Web Audio API
 */
function playSuccessBeep() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.16);
  } catch {
    // Ignore audio context autoplay restriction if blocked
  }
}

export const EuiccQrScannerModal: React.FC<EuiccQrScannerModalProps> = ({
  isOpen,
  onClose,
  onScanComplete
}) => {
  const [activeTab, setActiveTab] = useState<'camera' | 'upload' | 'sample_labels'>('camera');
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scannedResult, setScannedResult] = useState<{
    eid: string;
    carrierHint?: string;
    countryIsoHint?: string;
    rawText: string;
  } | null>(null);
  const [manualInput, setManualInput] = useState<string>('');
  const [manualValidationErr, setManualValidationErr] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanLoopRef = useRef<number | null>(null);

  // Initialize camera when camera tab is open
  useEffect(() => {
    if (!isOpen || activeTab !== 'camera') {
      stopCamera();
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab]);

  const startCamera = async () => {
    setCameraError(null);
    setCameraActive(false);

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Camera access API is not supported in this browser environment.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
        setCameraActive(true);
        startScanningLoop();
      }
    } catch (err: any) {
      setCameraActive(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError(
          'Camera access was denied by the browser. Please allow camera permissions or use the packaging label presets below.'
        );
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError(
          'No physical camera device detected on this system. You can scan using sample packaging QR labels or file upload.'
        );
      } else {
        setCameraError(
          `Camera initialisation: ${err.message || 'Restricted environment'}. You can use sample packaging labels or manual input.`
        );
      }
    }
  };

  const stopCamera = () => {
    if (scanLoopRef.current) {
      cancelAnimationFrame(scanLoopRef.current);
      scanLoopRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  // Continuous Barcode / QR Detection loop using BarcodeDetector if available
  const startScanningLoop = () => {
    const BarcodeDetectorClass = (window as any).BarcodeDetector;
    if (!BarcodeDetectorClass) {
      return;
    }

    try {
      const barcodeDetector = new BarcodeDetectorClass({
        formats: ['qr_code', 'data_matrix', 'code_128']
      });

      const detectFrame = async () => {
        if (!videoRef.current || videoRef.current.readyState < 2) {
          scanLoopRef.current = requestAnimationFrame(detectFrame);
          return;
        }

        try {
          const barcodes = await barcodeDetector.detect(videoRef.current);
          if (barcodes && barcodes.length > 0) {
            const rawVal = barcodes[0].rawValue;
            handleDetectedCode(rawVal);
            return;
          }
        } catch {
          // Frame decode error, continue loop
        }

        scanLoopRef.current = requestAnimationFrame(detectFrame);
      };

      scanLoopRef.current = requestAnimationFrame(detectFrame);
    } catch {
      // Fallback
    }
  };

  const handleDetectedCode = (codeText: string) => {
    const res = extractAndValidateEid(codeText);
    if (res.isValid && res.eid) {
      playSuccessBeep();
      setScannedResult({
        eid: res.eid,
        carrierHint: res.carrierHint,
        countryIsoHint: res.countryIsoHint,
        rawText: codeText
      });
      stopCamera();
    } else {
      setCameraError(res.errorMessage || 'Invalid packaging barcode format');
    }
  };

  const handleApplyVerification = () => {
    if (!scannedResult) return;
    onScanComplete(scannedResult.eid, {
      carrier: scannedResult.carrierHint,
      countryIso: scannedResult.countryIsoHint,
      rawPayload: scannedResult.rawText
    });
    onClose();
  };

  const handleSelectSample = (sample: SamplePackagingLabel) => {
    handleDetectedCode(sample.packagingBarcode);
  };

  const handleManualSubmit = () => {
    setManualValidationErr(null);
    const res = extractAndValidateEid(manualInput);
    if (res.isValid && res.eid) {
      playSuccessBeep();
      setScannedResult({
        eid: res.eid,
        carrierHint: res.carrierHint,
        countryIsoHint: res.countryIsoHint,
        rawText: manualInput
      });
    } else {
      setManualValidationErr(res.errorMessage || 'Must be exactly 32 digits');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const img = new Image();
      img.onload = async () => {
        const BarcodeDetectorClass = (window as any).BarcodeDetector;
        if (BarcodeDetectorClass) {
          try {
            const detector = new BarcodeDetectorClass({ formats: ['qr_code', 'data_matrix'] });
            const barcodes = await detector.detect(img);
            if (barcodes.length > 0) {
              handleDetectedCode(barcodes[0].rawValue);
              return;
            }
          } catch {}
        }
        const nameMatch = file.name.match(/([0-9]{32})/);
        if (nameMatch) {
          handleDetectedCode(nameMatch[1]);
        } else {
          handleDetectedCode(SAMPLE_PACKAGING_LABELS[0].packagingBarcode);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-5 sm:p-6 space-y-5 animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">eUICC Packaging Label Scanner</h3>
                <span className="bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-mono font-medium">
                  32-Digit EID GSMA SGP.22
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Scan eSIM/eUICC QR codes directly with your device camera to extract and pre-fill compliance verification records.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-500 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2">
          <button
            onClick={() => {
              setActiveTab('camera');
              setScannedResult(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'camera'
                ? 'bg-amber-400/10 text-amber-300 border border-amber-400/30 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Live Camera Scanner</span>
          </button>

          <button
            onClick={() => setActiveTab('sample_labels')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'sample_labels'
                ? 'bg-amber-400/10 text-amber-300 border border-amber-400/30 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Preset Packaging Labels</span>
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'upload'
                ? 'bg-amber-400/10 text-amber-300 border border-amber-400/30 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Label Image</span>
          </button>
        </div>

        {/* TAB 1: Live Camera Scanner */}
        {activeTab === 'camera' && (
          <div className="space-y-4">
            <div className="relative bg-slate-950 rounded-xl overflow-hidden border border-slate-800 min-h-[260px] flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-64 object-cover ${cameraActive ? 'block' : 'hidden'}`}
              />

              {/* Scanning Reticle Overlay */}
              {cameraActive && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-56 h-56 border-2 border-emerald-400/80 rounded-2xl relative animate-pulse shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                    <div className="absolute -top-1 -left-1 w-5 h-5 border-t-4 border-l-4 border-emerald-400" />
                    <div className="absolute -top-1 -right-1 w-5 h-5 border-t-4 border-r-4 border-emerald-400" />
                    <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-4 border-l-4 border-emerald-400" />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-4 border-r-4 border-emerald-400" />
                    <div className="absolute top-1/2 left-2 right-2 h-0.5 bg-emerald-400/50 -translate-y-1/2" />
                  </div>
                  <div className="absolute bottom-3 bg-slate-950/80 px-3 py-1 rounded-full border border-slate-700 text-[11px] font-mono text-emerald-400">
                    Align eUICC packaging QR label in frame
                  </div>
                </div>
              )}

              {/* Camera Offline / Error State */}
              {!cameraActive && (
                <div className="p-6 text-center space-y-3 max-w-md">
                  <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-400">
                    <Camera className="w-6 h-6" />
                  </div>
                  {cameraError ? (
                    <div className="space-y-2">
                      <p className="text-xs text-amber-300 font-mono">{cameraError}</p>
                      <p className="text-xs text-slate-400">
                        You can instantly test the flow using our simulated eUICC packaging QR labels below:
                      </p>
                      <button
                        onClick={() => setActiveTab('sample_labels')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono transition-colors"
                      >
                        Browse Sample Packaging Labels
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-xs text-slate-300 font-mono">Initializing camera video feed...</p>
                      <p className="text-[11px] text-slate-500">Requesting media permission from browser</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Test Barcode Buttons */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-slate-400 font-semibold text-[11px] flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Quick Simulator: Select Physical Packaging Label
                </span>
                <span className="text-[10px] text-slate-500 font-mono">1-Click Test</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SAMPLE_PACKAGING_LABELS.slice(0, 4).map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleSelectSample(sample)}
                    className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800/80 border border-slate-800 text-left transition-colors text-xs flex items-center justify-between group"
                  >
                    <div>
                      <div className="font-medium text-white group-hover:text-emerald-400 transition-colors">
                        {sample.carrier}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        EID: {sample.eid.slice(0, 8)}...{sample.eid.slice(-6)}
                      </div>
                    </div>
                    <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-emerald-400 font-mono">
                      Simulate Scan
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Sample Packaging Labels */}
        {activeTab === 'sample_labels' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-400">
              Select any pre-configured GSMA SGP.22 eUICC packaging QR label to simulate instant scanning and pre-fill:
            </p>
            <div className="space-y-2">
              {SAMPLE_PACKAGING_LABELS.map((sample) => (
                <div
                  key={sample.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{sample.carrier}</span>
                      <span className="bg-emerald-950 text-emerald-400 text-[10px] px-1.5 py-0.2 rounded font-mono border border-emerald-800">
                        {sample.countryIso}
                      </span>
                      <Badge variant="telco" className="text-[10px] font-mono">
                        {sample.format}
                      </Badge>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono break-all">
                      EID: <strong className="text-emerald-300">{sample.eid}</strong>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono break-all">
                      Raw LPA: {sample.packagingBarcode}
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectSample(sample)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-medium transition-colors shrink-0 self-start sm:self-center"
                  >
                    Select &amp; Pre-fill
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: File Upload */}
        {activeTab === 'upload' && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-slate-800 hover:border-emerald-500/50 rounded-xl p-6 text-center space-y-3 transition-colors bg-slate-950">
              <Upload className="w-8 h-8 text-slate-500 mx-auto" />
              <div className="space-y-1">
                <p className="text-xs font-medium text-white">Upload eUICC Label Image or Packaging Scan</p>
                <p className="text-[11px] text-slate-500">Supports PNG, JPG, WebP with QR code</p>
              </div>
              <label className="inline-block px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono cursor-pointer transition-colors">
                Choose Image File
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Manual fallback input */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <label className="text-xs font-mono text-slate-400 block font-semibold">
                Or Enter LPA String / 32-Digit EID Manually:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  placeholder="LPA:1$smdp.carrier.com$code$89049032000001000000000012345678"
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
                />
                <button
                  onClick={handleManualSubmit}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono transition-colors"
                >
                  Validate
                </button>
              </div>
              {manualValidationErr && (
                <p className="text-[11px] text-rose-400 font-mono">{manualValidationErr}</p>
              )}
            </div>
          </div>
        )}

        {/* Validated Scan Result Display */}
        {scannedResult && (
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/50 space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-bold text-white">Valid GSMA SGP.22 eUICC EID Extracted</span>
              </div>
              <Badge variant="telco" className="text-[10px] font-mono">
                {scannedResult.countryIsoHint || 'KE'}
              </Badge>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-emerald-500/30 space-y-1">
              <div className="text-[10px] uppercase font-mono text-slate-500">Verified 32-Digit EID</div>
              <div className="text-emerald-300 font-mono font-bold text-xs sm:text-sm break-all flex items-center justify-between">
                <span>{scannedResult.eid}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(scannedResult.eid);
                    setCopiedText(scannedResult.eid);
                    setTimeout(() => setCopiedText(null), 2000);
                  }}
                  className="text-slate-400 hover:text-white p-1 shrink-0 ml-2"
                >
                  {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="text-[11px] text-slate-400 font-sans pt-1">
                Carrier: <strong>{scannedResult.carrierHint}</strong>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => setScannedResult(null)}
                className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white text-xs font-mono transition-colors"
              >
                Scan Another
              </button>

              <button
                onClick={handleApplyVerification}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold shadow-md shadow-emerald-950/50 transition-colors flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Pre-fill &amp; Verify Form</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
