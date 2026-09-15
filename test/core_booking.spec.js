const assert = require('assert');
const { 
  buildWhatsAppBookingUrl, 
  buildWhatsAppProductUrl, 
  validateBookingDetails, 
  sanitizePhoneNumber,
  DEFAULT_PHONE_NUMBER,
  AVAILABLE_PRODUCTS 
} = require('../js/booking.js');

console.log('--- Running Coder Unit Tests (TDD) ---');

// Test 1: Sanitize phone number (remove spaces, symbols, ensure Colombia prefix)
{
  assert.strictEqual(DEFAULT_PHONE_NUMBER, '573148492143', 'DEFAULT_PHONE_NUMBER must be official 573148492143');

  const phone1 = '314 849 2143';
  const sanitized1 = sanitizePhoneNumber(phone1);
  assert.strictEqual(sanitized1, '573148492143', 'Should add 57 prefix if missing');

  const phone2 = '+57 314 849 2143';
  const sanitized2 = sanitizePhoneNumber(phone2);
  assert.strictEqual(sanitized2, '573148492143', 'Should strip + and whitespace');
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
    phone: '573148492143',
    clientName: 'Valentina Soto',
    serviceName: 'Maquillaje Social & Eventos',
    bookingDate: '2026-11-20',
    venueType: 'Servicio a Domicilio',
    notes: 'Maquillaje para una boda de noche en Medellín'
  });

  assert.ok(url.startsWith('https://wa.me/573148492143?text='), 'URL should use wa.me schema with new phone');
  assert.ok(url.includes('Valentina%20Soto') || url.includes('Valentina+Soto'), 'URL must encode client name');
  assert.ok(url.includes('Maquillaje'), 'URL must include selected service');
  assert.ok(url.includes('2026-11-20'), 'URL must include appointment date');
  console.log('✓ buildWhatsAppBookingUrl passed');
}

// Test 4: Product Purchase WhatsApp URL & Catalog placeholders
{
  assert.strictEqual(AVAILABLE_PRODUCTS.length, 10, 'Must have exactly 10 placeholder products');

  const prodUrl = buildWhatsAppProductUrl('Fijador de Maquillaje Blindado (120ml)', '$65.000 COP');
  assert.ok(prodUrl.startsWith('https://wa.me/573148492143?text='), 'Product URL must target 573148492143');
  assert.ok(prodUrl.includes('Quiero%20este%20producto'), 'Product URL must include "Quiero este producto" message');
  assert.ok(prodUrl.includes('Fijador'), 'Product URL must include product name');
  assert.ok(prodUrl.includes('65.000'), 'Product URL must include product price');
  console.log('✓ buildWhatsAppProductUrl and AVAILABLE_PRODUCTS passed');
}

console.log('All Coder unit tests passed successfully!\n');

