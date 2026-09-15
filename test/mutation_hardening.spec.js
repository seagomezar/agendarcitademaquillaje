// SwarmForge six-pack: hardener mutation & defensive tests
const assert = require('assert');
const {
  sanitizeInputText,
  isDatePresentOrFuture,
  validateBookingDetails,
  buildWhatsAppBookingUrl,
  buildWhatsAppProductUrl
} = require('../js/booking.js');

console.log('--- Running Hardender Mutation & Defensive Tests ---');

// Test 1: XSS / HTML Tag stripping
{
  const maliciousInput = '<script>alert("hacked")</script>Sofia Perez<b>VIP</b>';
  const clean = sanitizeInputText(maliciousInput);
  assert.strictEqual(clean, 'alert("hacked")Sofia PerezVIP', 'Must strip all HTML tags');
  assert.ok(!clean.includes('<script>'), 'Must not contain script tags');
  console.log('✓ XSS tag stripping passed');
}

// Test 2: Past dates must be rejected
{
  assert.strictEqual(isDatePresentOrFuture('2020-01-01'), false, 'Past date 2020 must be false');
  
  const future = new Date();
  future.setDate(future.getDate() + 30);
  const futureStr = future.toISOString().split('T')[0];
  assert.strictEqual(isDatePresentOrFuture(futureStr), true, 'Future date must be true');

  // Today must be valid
  const todayStr = new Date().toISOString().split('T')[0];
  assert.strictEqual(isDatePresentOrFuture(todayStr), true, 'Today must be true');
  console.log('✓ Date boundary checks passed');
}

// Test 3: Validation catches past dates
{
  const pastValidation = validateBookingDetails({
    clientName: 'Andrea Mejía',
    serviceName: 'Maquillaje Social & Eventos',
    bookingDate: '2021-05-10'
  });
  assert.strictEqual(pastValidation.isValid, false);
  assert.ok(pastValidation.errors.some(e => e.includes('pasado')), 'Should return error about past date');
  console.log('✓ Past date validation error passed');
}

// Test 4: Emojis and international accents preserved in WhatsApp message
{
  const url = buildWhatsAppBookingUrl({
    clientName: 'María Ángel Muñoz 💖',
    serviceName: 'Novias / Bridal Glam Luxury ✨',
    bookingDate: '2026-12-15'
  });
  const decoded = decodeURIComponent(url);
  assert.ok(decoded.includes('María Ángel Muñoz 💖'), 'Emojis & accents must be intact');
  assert.ok(decoded.includes('Novias / Bridal Glam Luxury ✨'), 'Service accents must be intact');
  console.log('✓ Emoji & unicode preservation passed');
}

// Test 5: Product URL defends against malicious inputs and preserves accents
{
  const prodUrl = buildWhatsAppProductUrl('<img src=x onerror=alert(1)>Polvo Traslúcido Suelto HD', '$58.000 COP');
  const decodedProd = decodeURIComponent(prodUrl);
  assert.ok(!decodedProd.includes('<img'), 'Must strip img tag from product message');
  assert.ok(decodedProd.includes('Polvo Traslúcido Suelto HD'), 'Must preserve accents');
  assert.ok(decodedProd.includes('Quiero este producto'), 'Must contain user required phrase');
  console.log('✓ Product URL defense & unicode preservation passed');
}

console.log('All Hardender tests passed successfully!\n');

