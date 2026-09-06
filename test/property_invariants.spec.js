// SwarmForge four-pack: refactorer property & invariant tests
const assert = require('assert');
const { buildWhatsAppBookingUrl, sanitizePhoneNumber, validateBookingDetails } = require('../js/booking.js');

console.log('--- Running Refactorer Property & Invariant Tests ---');

// Invariant 1: Any arbitrary phone input must sanitize to numeric digits only without crash
const samplePhones = [
  '',
  ' ',
  '+57 (300) 123-4567',
  '312-987-6543',
  'abc573009998888xyz',
  '0000000000',
  null,
  undefined,
  123456
];

samplePhones.forEach((phone, idx) => {
  const result = sanitizePhoneNumber(phone);
  assert.ok(typeof result === 'string', `Phone index ${idx} should return string`);
  assert.ok(/^\d+$/.test(result), `Phone index ${idx} should contain digits only, got: ${result}`);
});
console.log('✓ Invariant 1: Phone sanitization robustness passed');

// Invariant 2: buildWhatsAppBookingUrl must ALWAYS return a URI-encoded URL starting with wa.me
const testCombinations = [
  {},
  { clientName: 'María José & Compañía!', serviceName: 'Novias / Bridal Glam <Luxury>' },
  { clientName: '   Spaces Everywhere   ', bookingDate: '2026-12-31' },
  { notes: 'Special characters: #$%^&*()_+ñáéíóú¿?' }
];

testCombinations.forEach((opts, idx) => {
  const url = buildWhatsAppBookingUrl(opts);
  assert.ok(url.startsWith('https://wa.me/'), `Combo ${idx} must start with https://wa.me/`);
  assert.ok(!url.includes(' '), `Combo ${idx} must not contain raw whitespace: ${url}`);
  assert.doesNotThrow(() => decodeURIComponent(url), `Combo ${idx} should be valid percent-encoded URI`);
});
console.log('✓ Invariant 2: WhatsApp URL encoding stability passed');

// Invariant 3: Validation handles extreme/malformed payloads gracefully
assert.strictEqual(validateBookingDetails(null).isValid, false);
assert.strictEqual(validateBookingDetails({}).isValid, false);
assert.strictEqual(validateBookingDetails({ clientName: '   ' }).isValid, false);
console.log('✓ Invariant 3: Extreme payload validation passed');

console.log('All Refactorer invariant tests passed successfully!\n');
