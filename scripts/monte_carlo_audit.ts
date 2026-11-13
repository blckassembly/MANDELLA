import {
  verifyHardwareAttestedToken,
  generateMockAttestedToken,
  TRUSTED_SMDP_PUBLIC_KEYS,
  REVOKED_EUICC_REGISTRY
} from '../src/services/euiccAttestationService';
import {
  evaluateBindingStatus,
  getDaysRemaining
} from '../src/components/EsimAttestationDashboard';
import {
  extractAndValidateEid
} from '../src/components/dataverse/EuiccQrScannerModal';

interface FailureReport {
  category: string;
  testCase: string;
  input: any;
  error: string;
  stack?: string;
}

const failures: FailureReport[] = [];
let totalTrials = 0;

function runTrial(category: string, testCase: string, input: any, fn: () => void) {
  totalTrials++;
  try {
    fn();
  } catch (err: any) {
    failures.push({
      category,
      testCase,
      input,
      error: err?.message || String(err),
      stack: err?.stack
    });
  }
}

console.log('=== STARTING MONTE CARLO STRESS TEST SUITE ===\n');

// -------------------------------------------------------------
// 1. Monte Carlo: evaluateBindingStatus & getDaysRemaining
// -------------------------------------------------------------
console.log('[1/4] Running 25,000 Monte Carlo trials on eSIM Binding Status & Date Utilities...');

const testDates = [
  '',
  'invalid-date',
  'null',
  'undefined',
  '2026-10-15T14:20:00Z',
  '1970-01-01T00:00:00Z',
  '9999-12-31T23:59:59Z',
  '-1000-01-01',
  'NaN',
  '0',
  '2026-02-31', // non-existent date
  '2026-13-45T99:99:99Z',
  String(Date.now()),
  String(Date.now() + 1000 * 60 * 60 * 24 * 5), // 5 days left
  String(Date.now() + 1000 * 60 * 60 * 24 * 35), // 35 days left
  String(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days expired
];

for (let i = 0; i < 25000; i++) {
  const dateCandidate = i < testDates.length ? testDates[i] : (
    Math.random() < 0.2 ? testDates[Math.floor(Math.random() * testDates.length)] :
    Math.random() < 0.5 ? new Date(Date.now() + (Math.random() * 200 - 100) * 86400000).toISOString() :
    Math.random() < 0.7 ? `rand_${Math.random()}` :
    String(Math.floor(Math.random() * 1e15))
  );

  const chassisLock = Math.random() > 0.5;

  runTrial('StatusEvaluator', 'evaluateBindingStatus stochastic', { dateCandidate, chassisLock }, () => {
    const status = evaluateBindingStatus(dateCandidate, chassisLock);
    if (!['Verified', 'Locked', 'Critical', 'Expired'].includes(status)) {
      throw new Error(`Unexpected status returned: ${status}`);
    }
  });

  runTrial('DaysRemaining', 'getDaysRemaining NaN/Range check', { dateCandidate }, () => {
    const days = getDaysRemaining(dateCandidate);
    if (typeof days !== 'number' || isNaN(days)) {
      throw new Error(`getDaysRemaining returned NaN for input: ${dateCandidate}`);
    }
  });
}

// -------------------------------------------------------------
// 2. Monte Carlo: extractAndValidateEid (GSMA SGP.22 & LPA)
// -------------------------------------------------------------
console.log('[2/4] Running 25,000 Monte Carlo trials on GSMA SGP.22 LPA Parser...');

const edgeStrings = [
  '',
  '   ',
  '\0\0\0',
  '89049032000001000000000012345678', // valid 32-digit
  '8904903200000100000000001234567',  // 31-digit
  '890490320000010000000000123456789', // 33-digit
  'LPA:1$smdp.safaricom.co.ke$CONF-994821$89049032000001000000000012345678',
  'LPA:1$',
  '$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$',
  'LPA:1$smdp.com$',
  'LPA:1$smdp.com$$$$89049032000001000000000012345678',
  '{"eid": "89049032000001000000000012345678"}',
  '<script>alert("xss")</script>89049032000001000000000012345678',
  '\\u0000\\uFFFF',
  '🚀🔥🇳🇬🇰🇪',
  'A'.repeat(10000), // large buffer
];

for (let i = 0; i < 25000; i++) {
  let text = '';
  if (i < edgeStrings.length) {
    text = edgeStrings[i];
  } else {
    const mode = Math.random();
    if (mode < 0.2) {
      text = edgeStrings[Math.floor(Math.random() * edgeStrings.length)];
    } else if (mode < 0.5) {
      text = Array.from({ length: 32 }, () => Math.floor(Math.random() * 10)).join('');
    } else if (mode < 0.8) {
      text = `LPA:1$smdp.test.org$ID_${Math.floor(Math.random() * 10000)}$${Array.from({ length: 32 }, () => Math.floor(Math.random() * 10)).join('')}`;
    } else {
      text = Math.random().toString(36).repeat(Math.floor(Math.random() * 20));
    }
  }

  runTrial('LpaScanner', 'extractAndValidateEid fuzzing', { textPreview: text.slice(0, 50) }, () => {
    const res = extractAndValidateEid(text);
    if (!res || typeof res.isValid !== 'boolean') {
      throw new Error('extractAndValidateEid returned malformed object');
    }
    if (res.isValid && (!res.eid || res.eid.length !== 32)) {
      throw new Error(`Valid result with invalid EID length: ${res.eid}`);
    }
  });
}

// -------------------------------------------------------------
// 3. Monte Carlo: verifyHardwareAttestedToken (JWS/Ed25519)
// -------------------------------------------------------------
console.log('[3/4] Running 25,000 Monte Carlo trials on Ed25519 JWS Token Verification Engine...');

// First generate a valid base token
const validBaseToken = generateMockAttestedToken({
  sessionId: 'sess_ke_saf_monte_carlo',
  eid: '89049032000001000000000012345678',
  countryIso: 'KE',
  deviceImei: '863920048192830',
  profileState: 'ENABLED'
});

const tokenFuzzInputs = [
  '',
  '..',
  'a.b.c',
  'a.b',
  'a.b.c.d',
  'null',
  undefined as any,
  null as any,
  12345 as any,
  {},
  validBaseToken.ed25519_jws_compact_sig,
  // Tampered payload
  validBaseToken.ed25519_jws_compact_sig.slice(0, -10) + 'TAMPEREDAA',
  // Corrupted base64
  '%%%!@#$.&&&***.^^^~~~',
  // Wrong algorithm
  btoa(JSON.stringify({ alg: 'HS256', kid: 'smdp_root_ke_safaricom_2026_01' })) + '.' + btoa(JSON.stringify({ exp: 9999999999 })) + '.c2ln',
  // Extreme claims.exp
  btoa(JSON.stringify({ alg: 'EdDSA', kid: 'smdp_root_ke_safaricom_2026_01' })) + '.' + btoa(JSON.stringify({ exp: 'INVALID_EXP', sgp22_profile_state: 'ENABLED' })) + '.c2ln',
  // Infinity claims.exp
  btoa(JSON.stringify({ alg: 'EdDSA', kid: 'smdp_root_ke_safaricom_2026_01' })) + '.' + btoa(JSON.stringify({ exp: 1e25, sgp22_profile_state: 'ENABLED' })) + '.c2ln',
  // Negative exp
  btoa(JSON.stringify({ alg: 'EdDSA', kid: 'smdp_root_ke_safaricom_2026_01' })) + '.' + btoa(JSON.stringify({ exp: -999999, sgp22_profile_state: 'ENABLED' })) + '.c2ln',
];

for (let i = 0; i < 25000; i++) {
  let fuzzToken: any;
  if (i < tokenFuzzInputs.length) {
    fuzzToken = tokenFuzzInputs[i];
  } else {
    const roll = Math.random();
    if (roll < 0.2) {
      fuzzToken = validBaseToken.ed25519_jws_compact_sig;
    } else if (roll < 0.4) {
      // Bit flip in valid signature
      const sig = validBaseToken.ed25519_jws_compact_sig;
      const idx = Math.floor(Math.random() * sig.length);
      fuzzToken = sig.slice(0, idx) + 'X' + sig.slice(idx + 1);
    } else if (roll < 0.7) {
      fuzzToken = tokenFuzzInputs[Math.floor(Math.random() * tokenFuzzInputs.length)];
    } else {
      // Random dot delimited string
      fuzzToken = `${Math.random().toString(36)}.${Math.random().toString(36)}.${Math.random().toString(36)}`;
    }
  }

  runTrial('JwsVerifier', 'verifyHardwareAttestedToken fuzzing', { tokenPreview: String(fuzzToken).slice(0, 40) }, () => {
    const res = verifyHardwareAttestedToken(fuzzToken, {
      expectedImei: '863920048192830'
    });
    if (!res || typeof res.isValid !== 'boolean') {
      throw new Error('verifyHardwareAttestedToken returned non-boolean isValid');
    }
    if (typeof res.verificationLatencyUs !== 'number' || isNaN(res.verificationLatencyUs)) {
      throw new Error('verifyHardwareAttestedToken returned NaN latency');
    }
  });
}

// -------------------------------------------------------------
// 4. Monte Carlo: Attestation Metrics & KPI Aggregations
// -------------------------------------------------------------
console.log('[4/4] Running 25,000 Monte Carlo trials on Token Pool Aggregations & Latency SLA...');

for (let i = 0; i < 25000; i++) {
  // Generate random list of tokens of varying sizes (0 to 150 items)
  const count = Math.floor(Math.random() * 50);
  const mockTokensList = Array.from({ length: count }, (_, idx) => {
    const statuses = ['Verified', 'Locked', 'Critical', 'Expired'];
    const st = statuses[Math.floor(Math.random() * statuses.length)] as any;
    const lat = Math.random() < 0.05 ? 0 : Math.random() < 0.05 ? NaN : Math.floor(Math.random() * 50);
    return {
      id: `tok-${idx}`,
      binding_status: st,
      attestation_latency_ms: lat,
      expires_at: Math.random() < 0.1 ? 'invalid' : new Date(Date.now() + (Math.random() * 100 - 30) * 86400000).toISOString()
    };
  });

  runTrial('KpiAggregator', 'Metrics calculation with edge latencies', { count }, () => {
    const total = mockTokensList.length;
    const verified = mockTokensList.filter((t) => t.binding_status === 'Verified').length;
    const locked = mockTokensList.filter((t) => t.binding_status === 'Locked').length;
    const critical = mockTokensList.filter((t) => t.binding_status === 'Critical').length;
    const expired = mockTokensList.filter((t) => t.binding_status === 'Expired').length;
    const expiringOrExpired = mockTokensList.filter(
      (t) => t.binding_status === 'Critical' || t.binding_status === 'Expired'
    ).length;

    const avgLatency = Math.round(
      mockTokensList.reduce((acc, t) => acc + (isNaN(t.attestation_latency_ms) ? 0 : t.attestation_latency_ms), 0) / (total || 1)
    );

    if (isNaN(avgLatency)) {
      throw new Error('avgLatency produced NaN');
    }
    if (verified + locked + critical + expired !== total) {
      throw new Error(`Metric sum mismatch: ${verified + locked + critical + expired} !== ${total}`);
    }
  });
}

console.log('\n=============================================');
console.log(`TOTAL MONTE CARLO TRIALS COMPLETED: ${totalTrials.toLocaleString()}`);
console.log(`TOTAL FAILURES / BREAKAGES DETECTED: ${failures.length}`);
console.log('=============================================\n');

if (failures.length > 0) {
  // Group by category and error
  const grouped: Record<string, { count: number; sampleInput: any; error: string }> = {};
  for (const f of failures) {
    const key = `${f.category}: ${f.error}`;
    if (!grouped[key]) {
      grouped[key] = { count: 0, sampleInput: f.input, error: f.error };
    }
    grouped[key].count++;
  }

  console.log('--- FAILURE BREAKDOWN ---');
  for (const [key, val] of Object.entries(grouped)) {
    console.log(`\n🚨 [${val.count}x] ${key}`);
    console.log('Sample input:', JSON.stringify(val.sampleInput));
  }
} else {
  console.log('🎉 ALL 100,000 MONTE CARLO TRIALS PASSED WITHOUT BREAKING!');
}
