/**
 * Core Booking Domain Logic - Vane Pérez Makeup Artist (Medellín)
 * Pure business logic decoupled from DOM / UI delivery
 * Clean Architecture & SwarmForge CRAP <= 10 compliant
 * Hardened by SwarmForge hardender role
 */

const DEFAULT_COUNTRY_CODE = '57';
const DEFAULT_PHONE_NUMBER = '573148492143';

const AVAILABLE_SERVICES = Object.freeze([
  { id: 'bridal', name: 'Novias / Bridal Glam Luxury', priceEstimate: 'Desde $350.000 COP' },
  { id: 'social', name: 'Maquillaje Social & Eventos', priceEstimate: 'Desde $160.000 COP' },
  { id: 'quince', name: 'Quinceañeras & Sweet 15', priceEstimate: 'Desde $220.000 COP' },
  { id: 'editorial', name: 'Editorial & Sesiones de Fotos', priceEstimate: 'Cotización personalizada' },
  { id: 'classes', name: 'Clase VIP de Automaquillaje', priceEstimate: 'Desde $250.000 COP' }
]);

const AVAILABLE_PRODUCTS = Object.freeze([
  {
    id: 'prod-1',
    name: 'Fijador de Maquillaje Blindado (120ml)',
    category: 'Fijación & Acabado',
    price: 65000,
    priceFormatted: '$65.000 COP',
    description: 'Bruma microfina ultra resistente al agua, sudor y transferencias por más de 18 horas.',
    badge: 'Bestseller'
  },
  {
    id: 'prod-2',
    name: 'Sérum Facial Hidratante & Primer Glow (30ml)',
    category: 'Preparación de Piel',
    price: 85000,
    priceFormatted: '$85.000 COP',
    description: 'Con ácido hialurónico y niacinamida para alisar la textura y aportar luminosidad natural.',
    badge: 'Favorito'
  },
  {
    id: 'prod-3',
    name: 'Paleta de Sombras "Medellín Golden Hour"',
    category: 'Ojos',
    price: 110000,
    priceFormatted: '$110.000 COP',
    description: '12 sombras ultra pigmentadas en acabados mate, satinado y metalizado de tonos cálidos.',
    badge: 'Nuevo'
  },
  {
    id: 'prod-4',
    name: 'Labial Líquido Velvet Matte "Rosa Nude"',
    category: 'Labios',
    price: 48000,
    priceFormatted: '$48.000 COP',
    description: 'Textura aterciopelada de larga duración que no reseca ni cuartea los labios.',
    badge: 'Esencial'
  },
  {
    id: 'prod-5',
    name: 'Delineador Líquido Waterproof Ultra Preciso',
    category: 'Ojos',
    price: 42000,
    priceFormatted: '$42.000 COP',
    description: 'Punta pincel de 0.1 mm con negro intenso de secado ultra rápido sin manchas.',
    badge: 'Top Ventas'
  },
  {
    id: 'prod-6',
    name: 'Polvo Traslúcido Suelto Microfino HD',
    category: 'Fijación & Rostro',
    price: 58000,
    priceFormatted: '$58.000 COP',
    description: 'Efecto filtro aterciopelado que sella el maquillaje sin dejar flashback fotográfico.',
    badge: 'Recomendado'
  },
  {
    id: 'prod-7',
    name: 'Iluminador Líquido "Champagne Glow" (15ml)',
    category: 'Rostro & Glow',
    price: 52000,
    priceFormatted: '$52.000 COP',
    description: 'Gotas de luz perlada modulables para pómulos, arco de cupido y clavículas.',
    badge: 'Edición Especial'
  },
  {
    id: 'prod-8',
    name: 'Set de Brochas Profesionales (10 Piezas)',
    category: 'Herramientas',
    price: 135000,
    priceFormatted: '$135.000 COP',
    description: 'Cerdas sintéticas ultrasuaves de calidad premium con estuche organizador de lujo.',
    badge: 'Kit Completo'
  },
  {
    id: 'prod-9',
    name: 'Pestañas Postizas 3D Faux-Mink (Trío)',
    category: 'Ojos & Mirada',
    price: 45000,
    priceFormatted: '$45.000 COP',
    description: 'Banda flexible y fibras ligeras de efecto dimensión natural, reusables hasta 15 veces.',
    badge: 'Must-Have'
  },
  {
    id: 'prod-10',
    name: 'Aceite Limpiador Botánico Desmaquillante (100ml)',
    category: 'Cuidado Facial',
    price: 55000,
    priceFormatted: '$55.000 COP',
    description: 'Disuelve todo rastro de maquillaje a prueba de agua respetando la hidratación de la piel.',
    badge: 'Dermo-Cuidado'
  }
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

  message += `\n¿Tienes disponibilidad para esta fecha? ¡Quedo muy atenta, muchas gracias! 💖`;

  return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
}

/**
 * Formats beauty product purchase request and creates the direct WhatsApp URL.
 * Uses api.whatsapp.com to preserve emojis (✨, 💖) without wa.me redirect corruption.
 * @param {string} productName
 * @param {string|number} [productPrice]
 * @param {string} [phone]
 * @returns {string} WhatsApp direct link
 */
function buildWhatsAppProductUrl(productName, productPrice, phone = DEFAULT_PHONE_NUMBER) {
  const targetPhone = sanitizePhoneNumber(phone);
  const cleanName = sanitizeInputText(productName) || 'Producto de Belleza';
  const priceInfo = productPrice ? ` (${sanitizeInputText(String(productPrice))})` : '';

  const message = `¡Hola Vane! ✨ Quiero este producto: *${cleanName}*${priceInfo}.\n\n¿Tienes disponibilidad para entrega o envío en Medellín? ¡Quedo atenta para coordinar el pago! 💖`;

  return `https://api.whatsapp.com/send?phone=${targetPhone}&text=${encodeURIComponent(message)}`;
}

// Module export for Node.js test runners & Browser global attachment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    DEFAULT_PHONE_NUMBER,
    AVAILABLE_SERVICES,
    AVAILABLE_PRODUCTS,
    sanitizeInputText,
    sanitizePhoneNumber,
    isDatePresentOrFuture,
    validateBookingDetails,
    buildWhatsAppBookingUrl,
    buildWhatsAppProductUrl
  };
}
if (typeof window !== 'undefined') {
  window.BookingLogic = {
    DEFAULT_PHONE_NUMBER,
    AVAILABLE_SERVICES,
    AVAILABLE_PRODUCTS,
    sanitizeInputText,
    sanitizePhoneNumber,
    isDatePresentOrFuture,
    validateBookingDetails,
    buildWhatsAppBookingUrl,
    buildWhatsAppProductUrl
  };
}

