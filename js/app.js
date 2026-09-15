/**
 * UI Adapter & Interactive Controller - Vane Pérez Makeup Artist
 * Connects DOM user actions with pure domain logic in booking.js
 * Clean Architecture & SwarmForge compliant
 */

document.addEventListener('DOMContentLoaded', () => {
  initBookingForm();
  initServiceSelectButtons();
  initProductPurchaseButtons();
  initDateConstraints();
});

/**
 * Initializes the appointment booking form.
 */
function initBookingForm() {
  const form = document.getElementById('appointment-form');
  if (!form) return;

  const clientNameInput = document.getElementById('client-name');
  const serviceSelect = document.getElementById('service-select');
  const bookingDateInput = document.getElementById('booking-date');
  const notesInput = document.getElementById('booking-notes');
  const alertBox = document.getElementById('form-alert');

  // Error span elements
  const nameError = document.getElementById('name-error');
  const serviceError = document.getElementById('service-error');
  const dateError = document.getElementById('date-error');

  function clearErrors() {
    if (nameError) nameError.textContent = '';
    if (serviceError) serviceError.textContent = '';
    if (dateError) dateError.textContent = '';
    if (alertBox) {
      alertBox.style.display = 'none';
      alertBox.textContent = '';
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    const selectedVenue = form.querySelector('input[name="venueType"]:checked')?.value || 'Estudio Privado (Medellín)';

    const bookingData = {
      clientName: clientNameInput.value,
      serviceName: serviceSelect.value,
      bookingDate: bookingDateInput.value,
      venueType: selectedVenue,
      notes: notesInput ? notesInput.value : ''
    };

    // Use pure domain validation logic
    const validation = window.BookingLogic ? 
      window.BookingLogic.validateBookingDetails(bookingData) : 
      { isValid: Boolean(bookingData.clientName && bookingData.serviceName && bookingData.bookingDate), errors: [] };

    if (!validation.isValid) {
      if (validation.errors.some(err => err.includes('nombre')) && nameError) {
        nameError.textContent = 'Por favor ingresa tu nombre completo';
      }
      if (validation.errors.some(err => err.includes('servicio')) && serviceError) {
        serviceError.textContent = 'Por favor selecciona un servicio';
      }
      if (validation.errors.some(err => err.includes('fecha')) && dateError) {
        dateError.textContent = 'Por favor selecciona la fecha de tu evento';
      }

      if (alertBox) {
        alertBox.textContent = 'Por favor completa los campos requeridos para agendar tu cita.';
        alertBox.style.display = 'block';
      }
      return;
    }

    // Build the WhatsApp direct booking URL using domain logic
    const waUrl = window.BookingLogic ? 
      window.BookingLogic.buildWhatsAppBookingUrl(bookingData) : 
      `https://api.whatsapp.com/send?phone=573148492143&text=${encodeURIComponent('Hola Vane, quisiera agendar una cita')}`;

    // Open WhatsApp directly
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  });
}

/**
 * Connects service cards 'Agendar Servicio' buttons directly to the booking form.
 */
function initServiceSelectButtons() {
  const buttons = document.querySelectorAll('.select-service-btn');
  const serviceSelect = document.getElementById('service-select');
  const bookingSection = document.getElementById('booking-section');

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const serviceName = button.getAttribute('data-service-name');
      if (serviceSelect && serviceName) {
        serviceSelect.value = serviceName;
      }
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
      }
      // Focus name input
      const clientNameInput = document.getElementById('client-name');
      if (clientNameInput) {
        setTimeout(() => clientNameInput.focus(), 600);
      }
    });
  });
}

/**
 * Handles clicks on beauty product WhatsApp purchase buttons.
 * User requirement: "que para comprar algun product redirija whatssap con un mensaje quiero este producto"
 */
function initProductPurchaseButtons() {
  const productButtons = document.querySelectorAll('.product-buy-btn');

  productButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const productName = button.getAttribute('data-product-name');
      const productPrice = button.getAttribute('data-product-price');

      if (window.BookingLogic && productName) {
        e.preventDefault();
        const productUrl = window.BookingLogic.buildWhatsAppProductUrl(productName, productPrice);
        window.open(productUrl, '_blank', 'noopener,noreferrer');
      }
    });
  });
}

/**
 * Sets minimum booking date to today so users cannot select past dates.
 */
function initDateConstraints() {
  const dateInput = document.getElementById('booking-date');
  if (!dateInput) return;

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  dateInput.min = `${yyyy}-${mm}-${dd}`;
}

