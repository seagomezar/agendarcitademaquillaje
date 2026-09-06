/**
 * Core Booking Domain Logic - Vane Pérez Makeup Artist (Medellín)
 * Pure business logic decoupled from DOM / UI delivery
 * Clean Architecture & SwarmForge CRAP <= 10 compliant
 * Hardened by SwarmForge hardender role
 */

const DEFAULT_COUNTRY_CODE = '57';
const DEFAULT_PHONE_NUMBER = '573002345678';

const AVAILABLE_SERVICES = Object.freeze([
  { id: 'bridal', name: 'Novias / Bridal Glam Luxury', priceEstimate: 'Desde $350.000 COP' },
  { id: 'social', name: 'Maquillaje Social & Eventos', priceEstimate: 'Desde $160.000 COP' },
  { id: 'quince', name: 'Quinceañeras & Sweet 15', priceEstimate: 'Desde $220.000 COP' },
  { id: 'editorial', name: 'Editorial & Sesiones de Fotos', priceEstimate: 'Cotización personalizada' },
  { id: 'classes', name: 'Clase VIP de Automaquillaje', priceEstimate: 'Desde $250.000 COP' }
]);

/**
 * Strips HTML tags and dangerous characters to ensure clean text output.
 * @param {string} str
 * @returns {string} Clean string
 */
function sanitizeInputText(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/<[^>]*>/g, '') // Strip HTML tags
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Strip control characters
    .trim();
}

/**
 * Sanitizes phone number to standard WhatsApp international format.
 * Defaults to Colombia prefix (57).
 * @param {string} rawPhone
 * @returns {string} Clean numeric phone string
 */
function sanitizePhoneNumber(rawPhone) {
  if (!rawPhone || typeof rawPhone !== 'string') {
    return DEFAULT_PHONE_NUMBER;
  }
  const digits = rawPhone.replace(/\D/g, '');
  if (digits.startsWith(DEFAULT_COUNTRY_CODE)) {
    return digits;
  }
  if (digits.length === 10) {
    return DEFAULT_COUNTRY_CODE + digits;
  }
  return digits || DEFAULT_PHONE_NUMBER;
}

/**
 * Checks if a YYYY-MM-DD date string represents today or a future date.
 * @param {string} dateStr
 * @returns {boolean}
 */
function isDatePresentOrFuture(dateStr) {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return false;
  }
  const targetDate = new Date(dateStr + 'T00:00:00');
  if (isNaN(targetDate.getTime())) {
    return false;
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return targetDate.getTime() >= today.getTime();
}

/**
 * Validates booking details provided by the user.
 * @param {Object} details
 * @returns {{isValid: boolean, errors: string[]}}
 */
function validateBookingDetails(details) {
  const errors = [];
  if (!details || typeof details !== 'object') {
    return { isValid: false, errors: ['Detalles de reserva requeridos'] };
  }

  const name = sanitizeInputText(details.clientName);
  const service = sanitizeInputText(details.serviceName);
  const date = sanitizeInputText(details.bookingDate);

  if (name.length < 2) {
    errors.push('Por favor ingresa tu nombre completo');
  }
  if (!service) {
    errors.push('Por favor selecciona un servicio de maquillaje');
  }
  if (!date) {
    errors.push('Por favor selecciona la fecha deseada');
  } else if (!isDatePresentOrFuture(date)) {
    errors.push('La fecha de la cita no puede ser en el pasado');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Formats appointment request text and creates the direct WhatsApp URL.
 * @param {Object} options
 * @returns {string} WhatsApp direct link
 */
function buildWhatsAppBookingUrl(options) {
  const opts = options || {};
  const phone = sanitizePhoneNumber(opts.phone || DEFAULT_PHONE_NUMBER);
  const name = sanitizeInputText(opts.clientName) || 'Cliente';
  const service = sanitizeInputText(opts.serviceName) || 'Maquillaje Profesional';
  const date = sanitizeInputText(opts.bookingDate) || 'Por coordinar';
  const venue = sanitizeInputText(opts.venueType) || 'Estudio Privado (Medellín)';
  const notes = sanitizeInputText(opts.notes);

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
    DEFAULT_PHONE_NUMBER,
    AVAILABLE_SERVICES,
    sanitizeInputText,
    sanitizePhoneNumber,
    isDatePresentOrFuture,
    validateBookingDetails,
    buildWhatsAppBookingUrl
  };
}
if (typeof window !== 'undefined') {
  window.BookingLogic = {
    DEFAULT_PHONE_NUMBER,
    AVAILABLE_SERVICES,
    sanitizeInputText,
    sanitizePhoneNumber,
    isDatePresentOrFuture,
    validateBookingDetails,
    buildWhatsAppBookingUrl
  };
}
