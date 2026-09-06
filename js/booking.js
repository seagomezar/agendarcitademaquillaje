/**
 * Core Booking Domain Logic - Vane Pérez Makeup Artist
 * Pure business logic decoupled from DOM / UI delivery
 * Clean Architecture & SwarmForge CRAP <= 10 compliant
 */

/**
 * Sanitizes phone number to standard WhatsApp international format.
 * Default prefix is 57 (Colombia).
 * @param {string} rawPhone
 * @returns {string} Clean numeric phone string
 */
function sanitizePhoneNumber(rawPhone) {
  if (!rawPhone || typeof rawPhone !== 'string') {
    return '573001234567'; // Fallback default
  }
  const digits = rawPhone.replace(/\D/g, '');
  if (digits.startsWith('57')) {
    return digits;
  }
  if (digits.length === 10) {
    return '57' + digits;
  }
  return digits || '573001234567';
}

/**
 * Validates booking options.
 * @param {Object} details
 * @returns {{isValid: boolean, errors: string[]}}
 */
function validateBookingDetails(details) {
  const errors = [];
  if (!details || typeof details !== 'object') {
    return { isValid: false, errors: ['Detalles de reserva requeridos'] };
  }

  if (!details.clientName || details.clientName.trim().length < 2) {
    errors.push('Por favor ingresa tu nombre');
  }
  if (!details.serviceName || details.serviceName.trim().length === 0) {
    errors.push('Por favor selecciona un servicio de maquillaje');
  }
  if (!details.bookingDate || details.bookingDate.trim().length === 0) {
    errors.push('Por favor selecciona la fecha deseada');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Builds the WhatsApp appointment booking URL with formatted text.
 * @param {Object} options
 * @returns {string} WhatsApp direct URL
 */
function buildWhatsAppBookingUrl(options) {
  const opts = options || {};
  const phone = sanitizePhoneNumber(opts.phone || '573001234567');
  const name = (opts.clientName || '').trim() || 'Cliente';
  const service = (opts.serviceName || 'Maquillaje Profesional').trim();
  const date = (opts.bookingDate || 'Por coordinar').trim();
  const venue = (opts.venueType || 'Estudio Privado (Medellín)').trim();
  const notes = (opts.notes || '').trim();

  let message = `¡Hola Vane! ✨ Mi nombre es *${name}* y me encantaría agendar una cita de maquillaje contigo en Medellín.\n\n`;
  message += `💄 *Servicio de interés:* ${service}\n`;
  message += `📅 *Fecha deseada:* ${date}\n`;
  message += `📍 *Modalidad:* ${venue}\n`;

  if (notes) {
    message += `📝 *Detalles adicionales:* ${notes}\n`;
  }

  message += `\n¿Tienes disponibilidad para esta fecha? ¡Quedo muy atenta, gracias! 💖`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

// Module export for Node.js test runners & Browser global attachment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    sanitizePhoneNumber,
    validateBookingDetails,
    buildWhatsAppBookingUrl
  };
}
if (typeof window !== 'undefined') {
  window.BookingLogic = {
    sanitizePhoneNumber,
    validateBookingDetails,
    buildWhatsAppBookingUrl
  };
}
