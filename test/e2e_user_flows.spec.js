/**
 * End-to-End User Flow Tests - Ground Truth Verification
 * Simulates complete real-world user journeys through the application DOM.
 * 
 * Flows Covered:
 * 1. Conversion Funnel: Service Selection -> Form Pre-fill -> Validation -> WhatsApp Booking
 * 2. Boutique Catalog: Filter Tabs (Featured, Face, Lips, All) -> Product Purchase Trigger
 * 3. Portfolio Gallery: Filter Tabs (Novias, Social, Editorial, All) -> Item Display State
 * 4. Mobile Drawer Navigation & Keyboard Accessibility (Toggle, Links, Escape, Backdrop)
 * 5. Interactive Testimonials Carousel (Next, Prev, Indicator Dots, Keyboard Arrows)
 * 6. Date Constraints Initialization (Min date set to today)
 * 7. Multipage Consistency: Verification of dedicated boutique.html & portafolio.html pages
 * 
 * Performance: Runs 100% deterministically in pure Node.js in < 200ms.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');
const bookingLogic = require('../js/booking.js');

console.log('===============================================================');
console.log('--- Ground Truth End-to-End User Flow Simulation Suite ---');
console.log('===============================================================\n');

// ---------------------------------------------------------------------------
// Lightweight In-Memory DOM Simulator
// ---------------------------------------------------------------------------
class DOMElement {
  constructor(tagName, attributes = {}) {
    this.tagName = tagName.toUpperCase();
    this.attributes = { ...attributes };
    this.id = attributes.id || '';
    this.className = attributes.class || '';
    this.children = [];
    this.parentNode = null;
    this.textContent = '';
    this.value = attributes.value || '';
    this.min = attributes.min || '';
    this.checked = 'checked' in attributes;
    this.style = {};
    this.listeners = {};
  }

  get classList() {
    const self = this;
    return {
      add(...classes) {
        const cur = (self.className || '').trim().split(/\s+/).filter(Boolean);
        classes.forEach(c => {
          if (!cur.includes(c)) cur.push(c);
        });
        self.className = cur.join(' ');
        self.attributes.class = self.className;
      },
      remove(...classes) {
        const cur = (self.className || '').trim().split(/\s+/).filter(Boolean);
        const filtered = cur.filter(c => !classes.includes(c));
        self.className = filtered.join(' ');
        self.attributes.class = self.className;
      },
      toggle(cls, force) {
        const cur = (self.className || '').trim().split(/\s+/).filter(Boolean);
        const has = cur.includes(cls);
        const shouldHave = force !== undefined ? Boolean(force) : !has;
        if (shouldHave && !has) {
          cur.push(cls);
        } else if (!shouldHave && has) {
          const idx = cur.indexOf(cls);
          cur.splice(idx, 1);
        }
        self.className = cur.join(' ');
        self.attributes.class = self.className;
        return shouldHave;
      },
      contains(cls) {
        const cur = (self.className || '').trim().split(/\s+/).filter(Boolean);
        return cur.includes(cls);
      }
    };
  }

  getAttribute(name) {
    return this.attributes[name] !== undefined ? this.attributes[name] : null;
  }

  setAttribute(name, value) {
    this.attributes[name] = String(value);
    if (name === 'id') this.id = String(value);
    if (name === 'class') this.className = String(value);
    if (name === 'value') this.value = String(value);
    if (name === 'min') this.min = String(value);
  }

  hasAttribute(name) {
    return this.attributes[name] !== undefined;
  }

  removeAttribute(name) {
    delete this.attributes[name];
    if (name === 'id') this.id = '';
    if (name === 'class') this.className = '';
  }

  addEventListener(type, handler, options) {
    if (!this.listeners[type]) this.listeners[type] = [];
    this.listeners[type].push(handler);
  }

  removeEventListener(type, handler) {
    if (!this.listeners[type]) return;
    this.listeners[type] = this.listeners[type].filter(h => h !== handler);
  }

  dispatchEvent(event) {
    if (!event.target) event.target = this;
    if (!event.currentTarget) event.currentTarget = this;
    if (this.listeners[event.type]) {
      this.listeners[event.type].forEach(handler => handler.call(this, event));
    }
  }

  click() {
    let defaultPrevented = false;
    const evt = {
      type: 'click',
      target: this,
      currentTarget: this,
      preventDefault: () => { defaultPrevented = true; },
      defaultPrevented: () => defaultPrevented
    };
    this.dispatchEvent(evt);
  }

  focus() {}
  scrollIntoView() {}

  matches(selector) {
    let s = selector.trim();
    if (!s) return false;

    // 1. Tag name at beginning
    const tagMatch = s.match(/^[a-zA-Z0-9_-]+/);
    if (tagMatch) {
      if (this.tagName !== tagMatch[0].toUpperCase()) return false;
      s = s.slice(tagMatch[0].length);
    }

    // 2. ID
    const idMatch = s.match(/^#([a-zA-Z0-9_-]+)/);
    if (idMatch) {
      if (this.id !== idMatch[1]) return false;
      s = s.slice(idMatch[0].length);
    }

    // 3. Classes
    const classMatches = s.match(/\.([a-zA-Z0-9_-]+)/g);
    if (classMatches) {
      for (const cm of classMatches) {
        const clsName = cm.slice(1);
        if (!this.classList.contains(clsName)) return false;
      }
      s = s.replace(/\.[a-zA-Z0-9_-]+/g, '');
    }

    // 4. Attributes [attr] or [attr="val"]
    const attrRegex = /\[([a-zA-Z0-9_-]+)(?:="?([^"\]]*)"?)?\]/g;
    let am;
    while ((am = attrRegex.exec(s)) !== null) {
      const attrName = am[1].toLowerCase();
      const attrVal = am[2];
      if (this.attributes[attrName] === undefined) return false;
      if (attrVal !== undefined && this.attributes[attrName] !== attrVal) return false;
    }
    s = s.replace(/\[[a-zA-Z0-9_-]+(?:="?[^"\]]*"?)?\]/g, '');

    // 5. Pseudo-classes
    if (s.includes(':checked')) {
      if (!this.checked) return false;
      s = s.replace(':checked', '');
    }

    return true;
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] || null;
  }

  querySelectorAll(selector) {
    const results = [];
    const sel = selector.trim();

    // Check descendant combinators e.g. ".products-grid .product-card"
    if (sel.includes(' ')) {
      const parts = sel.split(/\s+/);
      if (parts.length === 2) {
        const [parentSel, childSel] = parts;
        const matchingParents = this.querySelectorAll(parentSel);
        for (const p of matchingParents) {
          const children = p.querySelectorAll(childSel);
          for (const c of children) {
            if (!results.includes(c)) results.push(c);
          }
        }
        return results;
      }
    }

    function traverse(node) {
      for (const child of node.children) {
        if (child.matches(sel)) {
          results.push(child);
        }
        traverse(child);
      }
    }
    traverse(this);
    return results;
  }
}

function parseHTMLToDOM(html) {
  const root = new DOMElement('ROOT');
  const stack = [root];
  const voidTags = new Set(['AREA', 'BASE', 'BR', 'COL', 'EMBED', 'HR', 'IMG', 'INPUT', 'LINK', 'META', 'PARAM', 'SOURCE', 'TRACK', 'WBR']);

  const tagRegex = /<!--[\s\S]*?-->|<(\/)?([a-zA-Z0-9:-]+)((?:\s+[^'">/=\s]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^>\s]+))?)*)\s*(\/)?>|([^<]+)/g;
  let match;

  while ((match = tagRegex.exec(html)) !== null) {
    const [full, isClosing, tagName, rawAttrs, isSelfClose, textContent] = match;

    if (full.startsWith('<!--')) continue;

    if (textContent) {
      const text = textContent.trim();
      if (text && stack.length > 0) {
        const parent = stack[stack.length - 1];
        parent.textContent = (parent.textContent ? parent.textContent + ' ' : '') + text;
      }
      continue;
    }

    if (isClosing) {
      const upper = tagName.toUpperCase();
      for (let i = stack.length - 1; i > 0; i--) {
        if (stack[i].tagName === upper) {
          stack.length = i;
          break;
        }
      }
      continue;
    }

    const upperTag = tagName.toUpperCase();
    const attrs = {};
    if (rawAttrs) {
      const attrRegex = /([a-zA-Z0-9_:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^>\s]+)))?/g;
      let aMatch;
      while ((aMatch = attrRegex.exec(rawAttrs)) !== null) {
        const attrName = aMatch[1].toLowerCase();
        const attrVal = aMatch[2] !== undefined ? aMatch[2] : (aMatch[3] !== undefined ? aMatch[3] : (aMatch[4] !== undefined ? aMatch[4] : ''));
        attrs[attrName] = attrVal;
      }
    }

    const elem = new DOMElement(upperTag, attrs);
    const parent = stack[stack.length - 1];
    elem.parentNode = parent;
    parent.children.push(elem);

    if (!voidTags.has(upperTag) && !isSelfClose) {
      stack.push(elem);
    }
  }

  return root;
}

function createDOMEnvironment(htmlFilePath) {
  const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
  const root = parseHTMLToDOM(htmlContent);
  const body = root.querySelector('body') || root;
  
  const docListeners = {};
  const openedUrls = [];

  const fakeDocument = {
    body,
    getElementById(id) {
      return root.querySelector('#' + id);
    },
    querySelector(sel) {
      return root.querySelector(sel);
    },
    querySelectorAll(sel) {
      return root.querySelectorAll(sel);
    },
    addEventListener(type, handler) {
      if (!docListeners[type]) docListeners[type] = [];
      docListeners[type].push(handler);
    },
    removeEventListener(type, handler) {
      if (!docListeners[type]) return;
      docListeners[type] = docListeners[type].filter(h => h !== handler);
    },
    dispatchEvent(event) {
      if (!event.target) event.target = fakeDocument;
      if (docListeners[event.type]) {
        docListeners[event.type].forEach(h => h(event));
      }
    }
  };

  const fakeWindow = {
    document: fakeDocument,
    BookingLogic: bookingLogic,
    open(url, target, features) {
      openedUrls.push({ url, target, features });
      return {};
    },
    addEventListener(type, handler) {
      fakeDocument.addEventListener(type, handler);
    },
    setTimeout: (fn) => { fn(); return 1; },
    clearTimeout: () => {},
    setInterval: (fn) => 1,
    clearInterval: () => {}
  };

  const appJsCode = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');
  const context = {
    window: fakeWindow,
    document: fakeDocument,
    setTimeout: fakeWindow.setTimeout,
    clearTimeout: fakeWindow.clearTimeout,
    setInterval: fakeWindow.setInterval,
    clearInterval: fakeWindow.clearInterval,
    console: console,
    Date: Date,
    Math: Math,
    parseInt: parseInt,
    isNaN: isNaN,
    String: String,
    Boolean: Boolean
  };

  vm.createContext(context);
  vm.runInContext(appJsCode, context);

  // Trigger DOMContentLoaded
  fakeDocument.dispatchEvent({ type: 'DOMContentLoaded' });

  return { root, document: fakeDocument, window: fakeWindow, openedUrls };
}

// ---------------------------------------------------------------------------
// TEST FLOW 1: Conversion Funnel (Service Selection -> Form -> WhatsApp)
// ---------------------------------------------------------------------------
console.log('Flow 1: Simulating Service Selection & Booking Funnel...');
{
  const env = createDOMEnvironment(path.join(__dirname, '..', 'index.html'));
  const doc = env.document;

  // 1.1 Verify initial form state
  const serviceSelect = doc.getElementById('service-select');
  const clientNameInput = doc.getElementById('client-name');
  const dateInput = doc.getElementById('booking-date');
  const formAlert = doc.getElementById('form-alert');
  const form = doc.getElementById('appointment-form');

  assert.strictEqual(serviceSelect.value, '', 'Initial service select must be unselected');
  assert.strictEqual(clientNameInput.value, '', 'Initial client name input must be empty');

  // 1.2 User clicks "Agendar Servicio" on Bridal Card
  const bridalBtn = doc.querySelector('.select-service-btn[data-service-id="bridal"]');
  assert.ok(bridalBtn, 'Bridal service select button must exist');
  bridalBtn.click();
  assert.strictEqual(serviceSelect.value, 'Novias / Bridal Glam Luxury', 'Clicking Bridal button must pre-select "Novias / Bridal Glam Luxury"');

  // 1.3 User submits empty form -> Validation failure
  let submitPrevented = false;
  form.dispatchEvent({
    type: 'submit',
    preventDefault: () => { submitPrevented = true; }
  });

  assert.ok(submitPrevented, 'Form submission must be prevented on empty input');
  assert.strictEqual(env.openedUrls.length, 0, 'WhatsApp URL must NOT be opened when validation fails');
  assert.strictEqual(doc.getElementById('name-error').textContent, 'Por favor ingresa tu nombre completo');
  assert.strictEqual(doc.getElementById('date-error').textContent, 'Por favor selecciona la fecha de tu evento');
  assert.ok(formAlert.style.display !== 'none', 'Alert banner must be displayed on error');

  // 1.4 User enters past date -> Validation failure
  clientNameInput.value = 'Camila Restrepo';
  dateInput.value = '2020-01-01'; // Past date
  form.dispatchEvent({
    type: 'submit',
    preventDefault: () => {}
  });

  assert.strictEqual(env.openedUrls.length, 0, 'WhatsApp URL must NOT be opened when date is in the past');
  assert.strictEqual(doc.getElementById('date-error').textContent, 'Por favor selecciona la fecha de tu evento');

  // 1.5 User enters valid date, selects Home Service venue & notes -> Valid Submission
  const futureYear = new Date().getFullYear() + 1;
  dateInput.value = `${futureYear}-11-20`;
  doc.getElementById('booking-notes').value = 'Maquillaje para novia y madre de la novia en El Poblado';

  // Toggle venue radio to "Servicio a Domicilio"
  const venueRadios = form.querySelectorAll('input[name="venueType"]');
  assert.strictEqual(venueRadios.length, 2, 'Must have 2 venue options');
  venueRadios[0].checked = false;
  venueRadios[1].checked = true; // "Servicio a Domicilio"

  form.dispatchEvent({
    type: 'submit',
    preventDefault: () => {}
  });

  assert.strictEqual(env.openedUrls.length, 1, 'WhatsApp URL must be opened exactly once on valid submission');
  const openedCall = env.openedUrls[0];
  assert.strictEqual(openedCall.target, '_blank', 'WhatsApp link must open in _blank');
  assert.strictEqual(openedCall.features, 'noopener,noreferrer', 'WhatsApp link must include security rel/features');

  // Deep inspect the opened URL
  const waUrl = openedCall.url;
  assert.ok(waUrl.startsWith('https://api.whatsapp.com/send?phone=573148492143&text='), 'Must target official WhatsApp number +57 314 849 2143 on api.whatsapp.com');

  const decodedMessage = decodeURIComponent(waUrl.split('text=')[1]);
  assert.ok(decodedMessage.includes('*Camila Restrepo*'), 'Message must include client name');
  assert.ok(decodedMessage.includes('Novias / Bridal Glam Luxury'), 'Message must include bridal service');
  assert.ok(decodedMessage.includes(`${futureYear}-11-20`), 'Message must include future booking date');
  assert.ok(decodedMessage.includes('Servicio a Domicilio'), 'Message must include home service venue');
  assert.ok(decodedMessage.includes('Maquillaje para novia y madre de la novia en El Poblado'), 'Message must include additional notes');
  assert.ok(decodedMessage.includes('✨') && decodedMessage.includes('💖') && decodedMessage.includes('💄'), 'Message must preserve emojis');

  // 1.6 User switches to Quinceañera service
  const quinceBtn = doc.querySelector('.select-service-btn[data-service-id="quince"]');
  quinceBtn.click();
  assert.strictEqual(serviceSelect.value, 'Quinceañeras & Sweet 15', 'Clicking Quinceañera button must update select to "Quinceañeras & Sweet 15"');

  console.log('✓ Flow 1: Service selection and booking funnel passed with 100% fidelity\n');
}

// ---------------------------------------------------------------------------
// TEST FLOW 2: Boutique Filtering and Product Purchase Funnel
// ---------------------------------------------------------------------------
console.log('Flow 2: Simulating Boutique Filtering & Product Purchase Funnel...');
{
  const env = createDOMEnvironment(path.join(__dirname, '..', 'index.html'));
  const doc = env.document;

  const productCards = doc.querySelectorAll('.products-grid .product-card');
  assert.strictEqual(productCards.length, 12, 'Must render exactly 12 Atenea product cards');

  // 2.1 Default state: 'featured' tab active (top 4 bestsellers)
  const featuredTab = doc.querySelector('.prod-tab-btn[data-filter="featured"]');
  assert.ok(featuredTab.classList.contains('is-active'), 'Featured tab must be active by default');
  assert.strictEqual(featuredTab.getAttribute('aria-selected'), 'true');

  const initialVisible = productCards.filter(c => !c.classList.contains('is-hidden'));
  const initialHidden = productCards.filter(c => c.classList.contains('is-hidden'));
  assert.strictEqual(initialVisible.length, 4, 'Default view must show exactly 4 featured products');
  assert.strictEqual(initialHidden.length, 8, 'Default view must hide the 8 non-featured products');

  // 2.2 User clicks "Rostro & Piel" (face) tab
  const faceTab = doc.querySelector('.prod-tab-btn[data-filter="face"]');
  faceTab.click();
  assert.ok(faceTab.classList.contains('is-active'), 'Face tab must be active after click');
  assert.ok(!featuredTab.classList.contains('is-active'), 'Featured tab must become inactive');

  const faceVisible = productCards.filter(c => !c.classList.contains('is-hidden'));
  assert.strictEqual(faceVisible.length, 6, 'Face filter must show exactly 6 face products');
  faceVisible.forEach(c => assert.strictEqual(c.getAttribute('data-category'), 'face'));

  // 2.3 User clicks "Labios & Cuidado" (lips) tab
  const lipsTab = doc.querySelector('.prod-tab-btn[data-filter="lips"]');
  lipsTab.click();
  const lipsVisible = productCards.filter(c => !c.classList.contains('is-hidden'));
  assert.strictEqual(lipsVisible.length, 6, 'Lips filter must show exactly 6 lip products');
  lipsVisible.forEach(c => assert.strictEqual(c.getAttribute('data-category'), 'lips'));

  // 2.4 User clicks "Ver Catálogo Completo" (all) tab
  const allTab = doc.querySelector('.prod-tab-btn[data-filter="all"]');
  allTab.click();
  const allVisible = productCards.filter(c => !c.classList.contains('is-hidden'));
  assert.strictEqual(allVisible.length, 12, 'All filter must display all 12 products');

  // 2.5 User clicks "Quiero este producto" on Product 7 (Atenea Mini Peptide Lip Balm)
  const prod7Btn = doc.querySelector('.product-buy-btn[data-product-id="prod-7"]');
  assert.ok(prod7Btn, 'Product 7 purchase CTA must exist');
  assert.strictEqual(prod7Btn.getAttribute('data-product-name'), 'Atenea Mini Peptide Lip Balm (Set x 3)');

  prod7Btn.click();
  assert.strictEqual(env.openedUrls.length, 1, 'Clicking product purchase must trigger window.open');
  const prodUrl = env.openedUrls[0].url;
  assert.ok(prodUrl.startsWith('https://api.whatsapp.com/send?phone=573148492143&text='), 'Must target official WhatsApp');

  const decodedProdMsg = decodeURIComponent(prodUrl.split('text=')[1]);
  assert.ok(decodedProdMsg.includes('Quiero este producto: *Atenea Mini Peptide Lip Balm (Set x 3)*'), 'Must include exact product name');
  assert.ok(decodedProdMsg.includes('$45.000 COP'), 'Must include product price');
  assert.ok(decodedProdMsg.includes('¿Tienes disponibilidad para entrega o envío en Medellín?'), 'Must include delivery inquiry in Medellín');
  assert.ok(decodedProdMsg.includes('✨') && decodedProdMsg.includes('💖'), 'Must preserve emojis');

  console.log('✓ Flow 2: Boutique filtering and product purchase funnel passed with 100% fidelity\n');
}

// ---------------------------------------------------------------------------
// TEST FLOW 3: Portfolio Category Filtering Funnel
// ---------------------------------------------------------------------------
console.log('Flow 3: Simulating Portfolio Category Filtering Funnel...');
{
  const env = createDOMEnvironment(path.join(__dirname, '..', 'index.html'));
  const doc = env.document;

  const portfolioItems = doc.querySelectorAll('.portfolio-grid .portfolio-item');
  assert.strictEqual(portfolioItems.length, 8, 'Must render exactly 8 portfolio showcase items');

  const noviasTab = doc.querySelector('.portfolio-tab-btn[data-filter="novias"]');
  const socialTab = doc.querySelector('.portfolio-tab-btn[data-filter="social"]');
  const editorialTab = doc.querySelector('.portfolio-tab-btn[data-filter="editorial"]');
  const allTab = doc.querySelector('.portfolio-tab-btn[data-filter="all"]');

  // 3.1 Click "Novias"
  noviasTab.click();
  assert.ok(noviasTab.classList.contains('is-active'), 'Novias tab must become active');
  portfolioItems.forEach(item => {
    const isNovia = item.getAttribute('data-category') === 'novias';
    assert.strictEqual(!item.classList.contains('is-hidden'), isNovia, 'Novias items must be visible, others hidden');
  });

  // 3.2 Click "Social & Quinceañeras"
  socialTab.click();
  assert.ok(socialTab.classList.contains('is-active'), 'Social tab must become active');
  portfolioItems.forEach(item => {
    const isSocial = item.getAttribute('data-category') === 'social';
    assert.strictEqual(!item.classList.contains('is-hidden'), isSocial, 'Social/quince items must be visible, others hidden');
  });

  // 3.3 Click "Editorial & Moda"
  editorialTab.click();
  portfolioItems.forEach(item => {
    const isEditorial = item.getAttribute('data-category') === 'editorial';
    assert.strictEqual(!item.classList.contains('is-hidden'), isEditorial, 'Editorial items must be visible, others hidden');
  });

  // 3.4 Click "Todos los Looks"
  allTab.click();
  portfolioItems.forEach(item => {
    assert.ok(!item.classList.contains('is-hidden'), 'All portfolio items must be visible when "all" is active');
  });

  console.log('✓ Flow 3: Portfolio category filtering funnel passed with 100% fidelity\n');
}

// ---------------------------------------------------------------------------
// TEST FLOW 4: Mobile Drawer Navigation & Keyboard Accessibility
// ---------------------------------------------------------------------------
console.log('Flow 4: Simulating Mobile Drawer Navigation & Keyboard Accessibility...');
{
  const env = createDOMEnvironment(path.join(__dirname, '..', 'index.html'));
  const doc = env.document;

  const toggleBtn = doc.getElementById('nav-toggle');
  const closeBtn = doc.getElementById('nav-close');
  const drawer = doc.getElementById('mobile-menu-drawer');
  const backdrop = doc.getElementById('drawer-backdrop');
  const drawerLinks = doc.querySelectorAll('.drawer-link');

  // 4.1 Initial State: Closed
  assert.ok(!drawer.classList.contains('is-open'), 'Drawer must start closed');
  assert.strictEqual(drawer.getAttribute('aria-hidden'), 'true');
  assert.strictEqual(backdrop.getAttribute('aria-hidden'), 'true');

  // 4.2 Click toggle -> Opens drawer
  toggleBtn.click();
  assert.ok(drawer.classList.contains('is-open'), 'Drawer must be open after toggle click');
  assert.ok(backdrop.classList.contains('is-open'), 'Backdrop must be open after toggle click');
  assert.strictEqual(drawer.getAttribute('aria-hidden'), 'false');
  assert.strictEqual(backdrop.getAttribute('aria-hidden'), 'false');
  assert.strictEqual(toggleBtn.getAttribute('aria-expanded'), 'true');
  assert.strictEqual(doc.body.style.overflow, 'hidden', 'Body scroll must be locked');

  // 4.3 Click drawer link -> Closes drawer and unlocks body
  drawerLinks[0].click();
  assert.ok(!drawer.classList.contains('is-open'), 'Drawer must close after clicking a nav link');
  assert.strictEqual(drawer.getAttribute('aria-hidden'), 'true');
  assert.strictEqual(toggleBtn.getAttribute('aria-expanded'), 'false');
  assert.strictEqual(doc.body.style.overflow, '', 'Body scroll must be restored');

  // 4.4 Reopen -> Press Escape key -> Closes drawer
  toggleBtn.click();
  assert.ok(drawer.classList.contains('is-open'));
  doc.dispatchEvent({ type: 'keydown', key: 'Escape' });
  assert.ok(!drawer.classList.contains('is-open'), 'Drawer must close when Escape key is pressed');
  assert.strictEqual(doc.body.style.overflow, '');

  // 4.5 Reopen -> Click Backdrop -> Closes drawer
  toggleBtn.click();
  backdrop.click();
  assert.ok(!drawer.classList.contains('is-open'), 'Drawer must close when backdrop is clicked');

  // 4.6 Reopen -> Click Close Button -> Closes drawer
  toggleBtn.click();
  closeBtn.click();
  assert.ok(!drawer.classList.contains('is-open'), 'Drawer must close when close button is clicked');

  console.log('✓ Flow 4: Mobile drawer navigation and accessibility passed with 100% fidelity\n');
}

// ---------------------------------------------------------------------------
// TEST FLOW 5: Interactive Testimonials Carousel
// ---------------------------------------------------------------------------
console.log('Flow 5: Simulating Testimonials Carousel Interactions...');
{
  const env = createDOMEnvironment(path.join(__dirname, '..', 'index.html'));
  const doc = env.document;

  const track = doc.getElementById('testimonials-track');
  const prevBtn = doc.getElementById('testimonial-prev');
  const nextBtn = doc.getElementById('testimonial-next');
  const dots = doc.querySelectorAll('#testimonial-dots .carousel-dot');
  const cards = doc.querySelectorAll('#testimonials-track .testimonial-card');

  assert.strictEqual(cards.length, 3, 'Must have 3 testimonial cards');
  assert.strictEqual(dots.length, 3, 'Must have 3 dot indicators');

  // 5.1 Initial State: Slide 0 active
  assert.ok(cards[0].classList.contains('is-active'));
  assert.ok(dots[0].classList.contains('is-active'));

  // 5.2 Click Next -> Advances to slide 1
  nextBtn.click();
  assert.strictEqual(track.style.transform, 'translateX(-100%)', 'Track transform must be -100% on slide 1');
  assert.ok(cards[1].classList.contains('is-active'));
  assert.ok(dots[1].classList.contains('is-active'));
  assert.strictEqual(dots[1].getAttribute('aria-selected'), 'true');

  // 5.3 Click dot 2 -> Jumps directly to slide 2
  dots[2].click();
  assert.strictEqual(track.style.transform, 'translateX(-200%)', 'Track transform must be -200% on slide 2');
  assert.ok(cards[2].classList.contains('is-active'));
  assert.ok(dots[2].classList.contains('is-active'));

  // 5.4 Click Prev -> Returns to slide 1
  prevBtn.click();
  assert.strictEqual(track.style.transform, 'translateX(-100%)', 'Track transform must return to -100%');
  assert.ok(cards[1].classList.contains('is-active'));

  // 5.5 Wrap-around behavior: Prev from slide 0 wraps to slide 2
  prevBtn.click(); // Back to slide 0
  assert.strictEqual(track.style.transform, 'translateX(-0%)');
  prevBtn.click(); // Wrap to slide 2
  assert.strictEqual(track.style.transform, 'translateX(-200%)', 'Previous button on first slide must wrap around to last slide');

  // 5.6 Keyboard navigation on track: ArrowRight & ArrowLeft
  track.dispatchEvent({ type: 'keydown', key: 'ArrowRight' }); // wraps to 0
  assert.strictEqual(track.style.transform, 'translateX(-0%)');
  track.dispatchEvent({ type: 'keydown', key: 'ArrowRight' }); // goes to 1
  assert.strictEqual(track.style.transform, 'translateX(-100%)');
  track.dispatchEvent({ type: 'keydown', key: 'ArrowLeft' }); // goes to 0
  assert.strictEqual(track.style.transform, 'translateX(-0%)');

  console.log('✓ Flow 5: Testimonials carousel interactions passed with 100% fidelity\n');
}

// ---------------------------------------------------------------------------
// TEST FLOW 6: Date Constraint Initialization
// ---------------------------------------------------------------------------
console.log('Flow 6: Verifying Date Constraints Initialization...');
{
  const env = createDOMEnvironment(path.join(__dirname, '..', 'index.html'));
  const dateInput = env.document.getElementById('booking-date');

  const today = new Date();
  const expectedMin = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  assert.strictEqual(dateInput.min, expectedMin, `Date input min must be set to today: ${expectedMin}`);
  console.log(`✓ Flow 6: Date constraint min (${expectedMin}) verified\n`);
}

// ---------------------------------------------------------------------------
// TEST FLOW 7: Multipage Consistency (portafolio.html & boutique.html)
// ---------------------------------------------------------------------------
console.log('Flow 7: Verifying Dedicated Pages (portafolio.html & boutique.html)...');
{
  // 7.1 Verify portafolio.html
  const portafolioEnv = createDOMEnvironment(path.join(__dirname, '..', 'portafolio.html'));
  const pDoc = portafolioEnv.document;
  const pTabs = pDoc.querySelectorAll('.portfolio-tab-btn');
  const pItems = pDoc.querySelectorAll('.portfolio-grid .portfolio-item');
  assert.ok(pTabs.length >= 3, 'portafolio.html must have portfolio tabs');
  assert.ok(pItems.length >= 6, 'portafolio.html must display portfolio items');

  const pNoviasTab = pDoc.querySelector('.portfolio-tab-btn[data-filter="novias"]');
  if (pNoviasTab) {
    pNoviasTab.click();
    assert.ok(pNoviasTab.classList.contains('is-active'));
  }

  // 7.2 Verify boutique.html
  const boutiqueEnv = createDOMEnvironment(path.join(__dirname, '..', 'boutique.html'));
  const bDoc = boutiqueEnv.document;
  const bCards = bDoc.querySelectorAll('.products-grid .product-card');
  const bBuyBtns = bDoc.querySelectorAll('.product-buy-btn');
  assert.strictEqual(bCards.length, 12, 'boutique.html must contain all 12 Atenea cosmetics');
  assert.strictEqual(bBuyBtns.length, 12, 'boutique.html must have 12 WhatsApp purchase buttons');

  // Trigger purchase on product 1 in boutique.html
  bBuyBtns[0].click();
  assert.strictEqual(boutiqueEnv.openedUrls.length, 1, 'Clicking buy in boutique.html must open WhatsApp');
  assert.ok(boutiqueEnv.openedUrls[0].url.includes('Quiero%20este%20producto'), 'Must contain prefilled purchase request');

  console.log('✓ Flow 7: Dedicated multipage portfolio and boutique flows verified\n');
}

console.log('===============================================================');
console.log('🎉 ALL 7 REAL USER FLOWS VERIFIED SUCCESSFULLY (GROUND TRUTH)!');
console.log('===============================================================\n');
