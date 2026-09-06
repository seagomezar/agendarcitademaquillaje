// SwarmForge six-pack: QA End-to-End Independent Verification Suite
const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('====================================================');
console.log('--- SwarmForge QA Role: End-to-End Verification ---');
console.log('====================================================\n');

const projectRoot = path.join(__dirname, '..');
const htmlPath = path.join(projectRoot, 'index.html');
const cssPath = path.join(projectRoot, 'css', 'styles.css');
const bookingJsPath = path.join(projectRoot, 'js', 'booking.js');
const appJsPath = path.join(projectRoot, 'js', 'app.js');

// 1. Verify Core Project Files Exist
console.log('1. Verifying Core File Deliverables...');
assert.ok(fs.existsSync(htmlPath), 'index.html must exist');
assert.ok(fs.existsSync(cssPath), 'css/styles.css must exist');
assert.ok(fs.existsSync(bookingJsPath), 'js/booking.js must exist');
assert.ok(fs.existsSync(appJsPath), 'js/app.js must exist');
console.log('✓ All core code files exist\n');

// 2. Parse and Validate HTML Structure
console.log('2. Inspecting index.html Structure & Accessibility...');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

// Viewport meta
assert.ok(htmlContent.includes('<meta name="viewport" content="width=device-width, initial-scale=1.0">'), 'Meta viewport must be configured');
// Title
assert.ok(htmlContent.includes('<title>Vane Pérez | Makeup Artist Medellín'), 'Page title must reference Vane Pérez and Medellín');
// Language
assert.ok(htmlContent.includes('<html lang="es">'), 'HTML lang attribute must be Spanish (es)');

// Key Landmark Sections
const requiredSectionIds = ['hero', 'services', 'booking-section', 'portfolio', 'about', 'testimonials', 'faq'];
requiredSectionIds.forEach(id => {
  assert.ok(htmlContent.includes(`id="${id}"`), `Section #${id} must exist in HTML`);
});
console.log('✓ All 7 core sections exist in DOM\n');

// 3. Verify WhatsApp CTAs
console.log('3. Validating Call-To-Action (CTA) WhatsApp Integrations...');
assert.ok(htmlContent.includes('id="hero-primary-cta"'), 'Hero primary CTA button must exist');
assert.ok(htmlContent.includes('id="floating-whatsapp-btn"'), 'Floating persistent WhatsApp button must exist');
assert.ok(htmlContent.includes('id="submit-booking-btn"'), 'Form submit WhatsApp CTA button must exist');
assert.ok(htmlContent.includes('https://wa.me/57'), 'WhatsApp links must use Colombian international prefix 57');
assert.ok(htmlContent.includes('target="_blank"'), 'External WhatsApp links must open in new tab');
assert.ok(htmlContent.includes('rel="noopener noreferrer"'), 'External links must use secure noopener noreferrer');
console.log('✓ All WhatsApp CTA buttons verified and properly secured\n');

// 4. Verify Instagram Branding & Links
console.log('4. Checking Instagram Profile Integration (@vaneperezmakeup)...');
assert.ok(htmlContent.includes('https://www.instagram.com/vaneperezmakeup'), 'Must link to @vaneperezmakeup profile');
assert.ok(htmlContent.includes('@vaneperezmakeup'), 'Must mention @vaneperezmakeup in copy');
console.log('✓ Instagram branding verified\n');

// 5. Verify Photo Assets
console.log('5. Auditing Photography Assets in assets/images/...');
const expectedImages = [
  'hero-makeup.jpg',
  'service-bridal.jpg',
  'service-social.jpg',
  'service-quince.jpg',
  'service-editorial.jpg',
  'service-classes.jpg',
  'portfolio-1.jpg',
  'portfolio-2.jpg',
  'portfolio-3.jpg',
  'portfolio-4.jpg',
  'portfolio-5.jpg',
  'portfolio-6.jpg',
  'vane-perez-portrait.jpg'
];

expectedImages.forEach(imgName => {
  const imgFile = path.join(projectRoot, 'assets', 'images', imgName);
  assert.ok(fs.existsSync(imgFile), `Image ${imgName} must exist on disk`);
  const stats = fs.statSync(imgFile);
  assert.ok(stats.size > 4000, `Image ${imgName} must have valid content (>4KB), size was ${stats.size} bytes`);
});
console.log(`✓ All ${expectedImages.length} photography assets verified and intact\n`);

// 6. Verify Design System & CSS Rules
console.log('6. Auditing Stitch Design Tokens in css/styles.css...');
const cssContent = fs.readFileSync(cssPath, 'utf8');
assert.ok(cssContent.includes('--color-bg: #FFF8F5;'), 'Ivory background token must be defined');
assert.ok(cssContent.includes('--color-gold: #C5A059;'), 'Gold metallic accent token must be defined');
assert.ok(cssContent.includes('--color-espresso: #221A14;'), 'Espresso text token must be defined');
assert.ok(cssContent.includes('Playfair Display'), 'Playfair Display font family must be configured');
assert.ok(cssContent.includes('@media (max-width: 768px)'), 'Mobile responsive breakpoint must exist');
console.log('✓ Stitch design tokens & responsive CSS verified\n');

console.log('====================================================');
console.log('🎉 QA VERIFICATION COMPLETE: ALL 6 AUDITS PASSED!');
console.log('====================================================\n');
