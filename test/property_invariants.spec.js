const assert = require('assert');
const { buildWhatsAppBookingUrl, buildWhatsAppProductUrl, sanitizePhoneNumber, validateBookingDetails } = require('../js/booking.js');

console.log('--- Running Refactorer Property & Invariant Tests ---');

// Invariant 1: Any arbitrary phone input must sanitize to numeric digits only without crash
const samplePhones = [
  '',
  ' ',
  '+57 (314) 849-2143',
  '314-849-2143',
  'abc573148492143xyz',
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
  assert.ok(url.startsWith('https://api.whatsapp.com/send?phone='), `Combo ${idx} must start with api.whatsapp.com`);
  assert.ok(!url.includes(' '), `Combo ${idx} must not contain raw whitespace: ${url}`);
  assert.doesNotThrow(() => decodeURIComponent(url), `Combo ${idx} should be valid percent-encoded URI`);
});
console.log('✓ Invariant 2: WhatsApp URL encoding stability passed');

// Invariant 3: Validation handles extreme/malformed payloads gracefully
assert.strictEqual(validateBookingDetails(null).isValid, false);
assert.strictEqual(validateBookingDetails({}).isValid, false);
assert.strictEqual(validateBookingDetails({ clientName: '   ' }).isValid, false);
console.log('✓ Invariant 3: Extreme payload validation passed');

// Invariant 4: buildWhatsAppProductUrl stability & "Quiero este producto" invariant
const productCases = [
  ['', ''],
  ['Fijador de Maquillaje Blindado', '$65.000 COP'],
  ['<script>alert("xss")</script>Labial', 48000],
  ['Brochas & Pestañas ✨💖', null]
];

productCases.forEach(([name, price], idx) => {
  const url = buildWhatsAppProductUrl(name, price);
  assert.ok(url.startsWith('https://api.whatsapp.com/send?phone=573148492143&text='), `Product case ${idx} must target official phone on api.whatsapp.com`);
  assert.ok(url.includes('Quiero%20este%20producto'), `Product case ${idx} must include "Quiero este producto"`);
  assert.ok(!url.includes(' '), `Product case ${idx} must have no raw spaces`);
  assert.doesNotThrow(() => decodeURIComponent(url), `Product case ${idx} must decode cleanly`);
});
console.log('✓ Invariant 4: Product purchase URL encoding & invariant passed');

console.log('All Refactorer invariant tests passed successfully!\n');

