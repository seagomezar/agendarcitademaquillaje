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

// Favicon & Touch Icons
assert.ok(htmlContent.includes('rel="icon" type="image/x-icon" href="favicon.ico"'), 'Favicon ICO must be linked in HTML');
assert.ok(htmlContent.includes('rel="apple-touch-icon"'), 'Apple touch icon must be linked in HTML');
assert.ok(fs.existsSync(path.join(projectRoot, 'favicon.ico')), 'favicon.ico must exist on disk');
assert.ok(fs.existsSync(path.join(projectRoot, 'assets', 'images', 'favicon-32.png')), 'assets/images/favicon-32.png must exist');
assert.ok(fs.existsSync(path.join(projectRoot, 'assets', 'images', 'apple-touch-icon.png')), 'assets/images/apple-touch-icon.png must exist');

// Key Landmark Sections
const requiredSectionIds = ['hero', 'services', 'products', 'booking-section', 'portfolio', 'about', 'testimonials', 'faq'];
requiredSectionIds.forEach(id => {
  assert.ok(htmlContent.includes(`id="${id}"`), `Section #${id} must exist in HTML`);
});

// Navigation Elements & Luxury Slide-out Drawer
assert.ok(htmlContent.includes('id="nav-toggle"'), 'Mobile navigation toggle button (#nav-toggle) must exist');
assert.ok(htmlContent.includes('id="nav-close"'), 'Mobile drawer close button (#nav-close) must exist');
assert.ok(htmlContent.includes('id="mobile-menu-drawer"'), 'Mobile navigation drawer (#mobile-menu-drawer) must exist');
assert.ok(htmlContent.includes('id="drawer-backdrop"'), 'Mobile drawer backdrop (#drawer-backdrop) must exist');
console.log('✓ All 8 core sections, Favicon assets, and slide-out navigation drawer exist in DOM and disk\n');

// 3. Verify WhatsApp CTAs & Official Phone Number (+57 314 849 2143)
console.log('3. Validating Call-To-Action (CTA) WhatsApp Integrations & Official Number...');
assert.ok(!htmlContent.includes('573002345678'), 'Old placeholder phone 573002345678 must not exist');
assert.ok(htmlContent.includes('573148492143'), 'Official phone 573148492143 must be present');
assert.ok(htmlContent.includes('id="hero-primary-cta"'), 'Hero primary CTA button must exist');
assert.ok(htmlContent.includes('id="floating-whatsapp-btn"'), 'Floating persistent WhatsApp button must exist');
assert.ok(htmlContent.includes('https://api.whatsapp.com/send?phone=573148492143'), 'WhatsApp links must target official api.whatsapp.com with new phone');
assert.ok(htmlContent.includes('target="_blank"'), 'External WhatsApp links must open in new tab');
assert.ok(htmlContent.includes('rel="noopener noreferrer"'), 'External links must use secure noopener noreferrer');

// Verify Boutique Section, Haute-Couture VP Branding & "Quiero este producto" CTAs
assert.ok(htmlContent.includes('Boutique &amp; Maquillaje para Venta') || htmlContent.includes('Maquillaje para Venta'), 'Section title must reference Boutique & Maquillaje para Venta');
assert.ok(htmlContent.includes('class="brand-monogram">VP</span>'), 'Haute-couture VP monogram must be present');
assert.ok(htmlContent.includes('Dior Backstage'), 'High-end kit distinction notice must reference Dior Backstage');
assert.ok(htmlContent.includes('Haus Labs'), 'High-end kit distinction notice must reference Haus Labs');
assert.ok(htmlContent.includes('class="product-filter-tabs"'), 'Boutique filter tabs must exist in DOM');
assert.ok(htmlContent.includes('class="portfolio-filter-tabs"'), 'Portfolio filter tabs must exist in DOM');
assert.ok(htmlContent.includes('id="testimonials-track"'), 'Testimonials carousel track must exist in DOM');

for (let i = 1; i <= 12; i++) {
  assert.ok(htmlContent.includes(`data-product-id="prod-${i}"`), `Product prod-${i} must exist in DOM`);
}
const productBtnCount = (htmlContent.match(/class="[^"]*product-buy-btn[^"]*"/g) || []).length;
assert.strictEqual(productBtnCount, 12, 'Must have exactly 12 product purchase buttons');
assert.ok(htmlContent.includes('Quiero%20este%20producto'), 'Product buttons must prefill "Quiero este producto"');
assert.ok(htmlContent.includes('%E2%9C%A8'), 'Product buttons must include URL-encoded sparkles emoji (%E2%9C%A8)');
assert.ok(htmlContent.includes('%F0%9F%92%96'), 'Product buttons must include URL-encoded heart emoji (%F0%9F%92%96)');
console.log('✓ All 12 Atenea beauty products with preserved emojis and official WhatsApp (+57 314 849 2143) links verified\n');

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
  'vane-perez-portrait.jpg',
  'vane-perez-logo.png'
];

expectedImages.forEach(imgName => {
  const imgFile = path.join(projectRoot, 'assets', 'images', imgName);
  assert.ok(fs.existsSync(imgFile), `Image ${imgName} must exist on disk`);
});

// Check 12 product photos in assets/images/products
for (let i = 1; i <= 12; i++) {
  const pMatch = htmlContent.match(new RegExp(`assets/images/products/prod-${i}[^"']*\\.jpg`));
  assert.ok(pMatch, `Product image for prod-${i} must be referenced in HTML`);
  const pFile = path.join(projectRoot, pMatch[0]);
  assert.ok(fs.existsSync(pFile), `Product image ${pMatch[0]} must exist on disk`);
}

console.log(`✓ All ${expectedImages.length} photography assets + 12 product photos verified and intact\n`);

// 6. Verify Design System & CSS Rules
console.log('6. Auditing Stitch Design Tokens in css/styles.css...');
const cssContent = fs.readFileSync(cssPath, 'utf8');
assert.ok(cssContent.includes('--color-bg: #FFF8F5;'), 'Ivory background token must be defined');
assert.ok(cssContent.includes('--color-gold: #C5A059;'), 'Gold metallic accent token must be defined');
assert.ok(cssContent.includes('--color-espresso: #221A14;'), 'Espresso text token must be defined');
assert.ok(cssContent.includes('Playfair Display'), 'Playfair Display font family must be configured');
assert.ok(cssContent.includes('@media (min-width: 993px) and (max-width: 1200px)'), 'Medium desktop responsive breakpoint (993px-1200px) must exist');
assert.ok(cssContent.includes('@media (max-width: 768px)'), 'Mobile responsive breakpoint 768px must exist');
assert.ok(cssContent.includes('@media (max-width: 680px)'), 'Mobile responsive breakpoint 680px for product grid must exist');
assert.ok(cssContent.includes('@media (max-width: 520px)'), 'Mobile responsive breakpoint 520px for header and layout must exist');
assert.ok(cssContent.includes('.mobile-menu-drawer'), 'Mobile navigation drawer CSS must exist');
assert.ok(cssContent.includes('.nav-toggle-btn'), 'Mobile navigation toggle button CSS must exist');
console.log('✓ Stitch design tokens, medium desktop nowrap layout & mobile responsive CSS verified\n');

console.log('====================================================');
console.log('🎉 QA VERIFICATION COMPLETE: ALL 6 AUDITS PASSED!');
console.log('====================================================\n');
