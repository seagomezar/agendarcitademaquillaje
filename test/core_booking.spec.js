// Test suite for WhatsApp Booking Logic (TDD)
// SwarmForge: coder role unit tests
const assert = require('assert');
const { buildWhatsAppBookingUrl, validateBookingDetails, sanitizePhoneNumber } = require('../js/booking.js');

console.log('--- Running Coder Unit Tests (TDD) ---');

// Test 1: Sanitize phone number (remove spaces, symbols, ensure Colombia prefix)
{
  const phone1 = '300 123 4567';
  const sanitized1 = sanitizePhoneNumber(phone1);
  assert.strictEqual(sanitized1, '573001234567', 'Should add 57 prefix if missing');

  const phone2 = '+57 312 987 6543';
  const sanitized2 = sanitizePhoneNumber(phone2);
  assert.strictEqual(sanitized2, '573129876543', 'Should strip + and whitespace');
  console.log('✓ sanitizePhoneNumber passed');
}

// Test 2: Validate booking details
{
  const valid = validateBookingDetails({
    clientName: 'Camila Rodriguez',
    serviceName: 'Novias / Bridal Glam',
    bookingDate: '2026-10-15',
    venueType: 'Estudio Privado (Medellín)'
  });
  assert.strictEqual(valid.isValid, true);
  assert.strictEqual(valid.errors.length, 0);

  const invalid = validateBookingDetails({
    clientName: '',
    serviceName: '',
    bookingDate: ''
  });
  assert.strictEqual(invalid.isValid, false);
  assert.strictEqual(invalid.errors.length > 0, true);
  console.log('✓ validateBookingDetails passed');
}

// Test 3: Generate WhatsApp URL with encoded message
{
  const url = buildWhatsAppBookingUrl({
    phone: '573001234567',
    clientName: 'Valentina Soto',
    serviceName: 'Maquillaje Social & Eventos',
    bookingDate: '2026-11-20',
    venueType: 'Servicio a Domicilio',
    notes: 'Maquillaje para una boda de noche en Medellín'
  });

  assert.ok(url.startsWith('https://wa.me/573001234567?text='), 'URL should use wa.me schema');
  assert.ok(url.includes('Valentina%20Soto') || url.includes('Valentina+Soto'), 'URL must encode client name');
  assert.ok(url.includes('Maquillaje'), 'URL must include selected service');
  assert.ok(url.includes('2026-11-20'), 'URL must include appointment date');
  console.log('✓ buildWhatsAppBookingUrl passed');
}

console.log('All Coder unit tests passed successfully!\n');
