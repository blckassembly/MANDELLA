import { AFRICAN_COUNTRIES, INITIAL_NUMBERS, INITIAL_PORTING_REQUESTS, SOVEREIGN_LICENSES } from '../src/data/mockData';
import { verifyHardwareAttestedToken } from '../src/services/euiccAttestationService';

console.log('=== RUNNING DEEP COMPONENT STRESS TESTS ===\n');

const issues: string[] = [];

// Test 1: claims.exp invalid date throwing RangeError
console.log('[Test 1] Testing verifyHardwareAttestedToken with malformed claims.exp...');
try {
  const badExpHeader = Buffer.from(JSON.stringify({ alg: 'EdDSA', kid: 'smdp_root_ke_safaricom_2026_01' })).toString('base64url');
  // An exp value that when multiplied by 1000 exceeds Date max bounds (e.g. 1e20)
  const badExpPayload = Buffer.from(JSON.stringify({
    exp: 1e25,
    sgp22_profile_state: 'ENABLED'
  })).toString('base64url');
  const dummySig = 'A'.repeat(86); // 64 bytes base64url

  const result = verifyHardwareAttestedToken(`${badExpHeader}.${badExpPayload}.${dummySig}`);
  console.log('Result with 1e25 exp:', result.isValid, result.errorCode);
} catch (err: any) {
  console.error('💥 CRASH in verifyHardwareAttestedToken with extreme exp:', err.message);
  issues.push(`verifyHardwareAttestedToken crashes on extreme exp: ${err.message}`);
}

// Test 2: claims.exp = NaN
try {
  const badExpHeader = Buffer.from(JSON.stringify({ alg: 'EdDSA', kid: 'smdp_root_ke_safaricom_2026_01' })).toString('base64url');
  const badExpPayload = Buffer.from(JSON.stringify({
    exp: "not_a_number",
    sgp22_profile_state: 'ENABLED'
  })).toString('base64url');
  const dummySig = 'A'.repeat(86);

  const result = verifyHardwareAttestedToken(`${badExpHeader}.${badExpPayload}.${dummySig}`);
  console.log('Result with NaN exp:', result.isValid, result.errorCode);
} catch (err: any) {
  console.error('💥 CRASH in verifyHardwareAttestedToken with NaN exp:', err.message);
  issues.push(`verifyHardwareAttestedToken crashes on NaN exp: ${err.message}`);
}

// Test 3: Currency exchange rate division by zero or NaN
console.log('\n[Test 2] Testing Currency Exchange and Number Pricing calculations...');
for (const country of AFRICAN_COUNTRIES) {
  const zeroRate = 0;
  const nanRate = NaN;
  const priceUsd = 1.5;
  const localPriceZero = priceUsd * zeroRate;
  const localPriceNan = priceUsd * nanRate;
  const convertedBackZero = localPriceZero / (zeroRate || 1);
  if (isNaN(localPriceNan)) {
    // Normal for NaN input, but check if any country has 0 or undefined exchange rate
  }
  if (!country.exchangeRateToUsd || country.exchangeRateToUsd <= 0) {
    issues.push(`Country ${country.code} has invalid exchangeRateToUsd: ${country.exchangeRateToUsd}`);
  }
}

// Test 4: Inventory pricing and search matching
console.log('\n[Test 3] Testing Inventory filter with boundary conditions...');
for (const num of INITIAL_NUMBERS) {
  if (!num.e164 || !num.countryCode || num.monthlyFeeUsd < 0) {
    issues.push(`Number ${num.id} has invalid properties: monthlyFeeUsd=${num.monthlyFeeUsd}`);
  }
}

// Test 5: Date formatting across all mock data
console.log('\n[Test 4] Testing Date parsing across mock records...');
for (const p of INITIAL_PORTING_REQUESTS) {
  const createdMs = new Date(p.submittedAt).getTime();
  const estMs = p.estimatedCompletionAt ? new Date(p.estimatedCompletionAt).getTime() : 0;
  if (isNaN(createdMs)) {
    issues.push(`Porting request ${p.id} has invalid submittedAt: ${p.submittedAt}`);
  }
}

for (const lic of SOVEREIGN_LICENSES) {
  const expMs = new Date(lic.expiresAt).getTime();
  if (isNaN(expMs)) {
    issues.push(`License ${lic.licenseNumber} has invalid expiresAt: ${lic.expiresAt}`);
  }
}

console.log('\n=== SUMMARY OF STRESS TEST ISSUES ===');
if (issues.length === 0) {
  console.log('No additional issues found.');
} else {
  issues.forEach((iss, idx) => console.log(`${idx + 1}. ${iss}`));
}
