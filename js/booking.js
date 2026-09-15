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
    name: 'Atenea 1st Scene Serum Tinted Foundation (30ml)',
    category: 'Rostro / Piel',
    price: 57000,
    priceFormatted: '$57.000 COP',
    image: 'assets/images/products/prod-1-serum-foundation.jpg',
    description: 'Base en sérum con color que hidrata profundamente, unifica el tono y brinda luminosidad natural.',
    badge: 'Serum Glow'
  },
  {
    id: 'prod-2',
    name: 'Atenea 1st Scene Liquid Foundation (30ml)',
    category: 'Rostro / Piel',
    price: 43000,
    priceFormatted: '$43.000 COP',
    image: 'assets/images/products/prod-2-liquid-foundation.jpg',
    description: 'Base líquida de cobertura modulable con acabado satinado profesional de larga duración.',
    badge: 'Bestseller'
  },
  {
    id: 'prod-3',
    name: 'Atenea 1st Scene Corrector & Concealer (10ml)',
    category: 'Rostro / Ojos',
    price: 37000,
    priceFormatted: '$37.000 COP',
    image: 'assets/images/products/prod-3-concealer.jpg',
    description: 'Corrector líquido de alta cobertura con cafeína y ácido hialurónico para disimular ojeras e imperfecciones.',
    badge: 'Alta Cobertura'
  },
  {
    id: 'prod-4',
    name: 'Atenea Stick Blush en Barra (Nude / Rose)',
    category: 'Mejillas / Rostro',
    price: 34000,
    priceFormatted: '$34.000 COP',
    image: 'assets/images/products/prod-4-stick-blush-nude.jpg',
    description: 'Rubor cremoso en barra multiescena para mejillas y labios con acabado natural difuminable.',
    badge: 'Multiuso'
  },
  {
    id: 'prod-5',
    name: 'Atenea Stick Shimmer / Iluminador en Barra (Pink Shimmer)',
    category: 'Iluminación / Rostro',
    price: 34000,
    priceFormatted: '$34.000 COP',
    image: 'assets/images/products/prod-5-stick-shimmer-pink.jpg',
    description: 'Barra iluminadora cremosa con microperlas rosadas para resaltar puntos de luz en el rostro.',
    badge: 'Glow Radiante'
  },
  {
    id: 'prod-6',
    name: 'Atenea Stick Contour & Bronzer en Barra',
    category: 'Contorno / Rostro',
    price: 34000,
    priceFormatted: '$34.000 COP',
    image: 'assets/images/products/prod-6-stick-bronzer-contour.jpg',
    description: 'Barra cremosa de contorno y bronceado para esculpir facciones con acabado sedoso mate.',
    badge: 'Esculpido Fácil'
  },
  {
    id: 'prod-7',
    name: 'Atenea Mini Peptide Lip Balm (Set x 3)',
    category: 'Labios / Cuidado',
    price: 45000,
    priceFormatted: '$45.000 COP (Kit x 3)',
    image: 'assets/images/products/prod-7-peptide-lip-balm-trio.jpg',
    description: 'Tratamiento labial reparador con péptidos en trío de sabores: Cherry Spark, Pink Sugar y Hot Chocolate.',
    badge: 'Trío Especial'
  },
  {
    id: 'prod-8',
    name: 'Atenea Velvet Matte Lip Tint Mini',
    category: 'Labios',
    price: 25000,
    priceFormatted: '$25.000 COP',
    image: 'assets/images/products/prod-8-velvet-matte-tint.jpg',
    description: 'Tinta labial mate aterciopelada de textura ligera con aplicador de precisión e intransferible.',
    badge: 'Acabado Velvet'
  },
  {
    id: 'prod-9',
    name: 'Atenea Labial Slim en Barra (Bridal Rose / Classic Coffee)',
    category: 'Labios',
    price: 25000,
    priceFormatted: '$25.000 COP',
    image: 'assets/images/products/prod-9-slim-lipstick-duo.jpg',
    description: 'Labial cremoso en barra delgada en tonos icónicos elegantes Bridal Rose y Classic Coffee.',
    badge: 'Tonos Nude'
  },
  {
    id: 'prod-10',
    name: 'Atenea 1st Scene Lip Gloss (Shell Coral / Coral Haze / Cool Ice)',
    category: 'Labios',
    price: 32000,
    priceFormatted: '$32.000 COP',
    image: 'assets/images/products/prod-10-lip-gloss-trio.jpg',
    description: 'Brillo para labios ultra hidratante de efecto cristal en tonos Shell Coral, Coral Haze y Cool Ice.',
    badge: 'Efecto Cristal'
  },
  {
    id: 'prod-11',
    name: 'Atenea Lip Oil Shimmer (5ml)',
    category: 'Labios / Cuidado',
    price: 28000,
    priceFormatted: '$28.000 COP',
    image: 'assets/images/products/prod-11-lip-oil-shimmer.jpg',
    description: 'Aceite nutritivo para labios con destellos sutiles y nutrición profunda sin sensación pegajosa.',
    badge: 'Nutrición & Brillo'
  },
  {
    id: 'prod-12',
    name: 'Atenea Slim Lip Treatment / Bálsamo con Color',
    category: 'Labios / Cuidado',
    price: 24000,
    priceFormatted: '$24.000 COP',
    image: 'assets/images/products/prod-12-slim-lip-treatment.jpg',
    description: 'Bálsamo labial nutritivo en barra delgada para hidratación diaria y un sutil toque de color fresco.',
    badge: 'Hidratación Diaria'
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

