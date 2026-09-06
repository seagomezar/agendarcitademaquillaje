# Vane Pérez | Makeup Artist (Medellín) — Landing Page & SwarmForge Integration

[![Deploy to GitHub Pages](https://github.com/seagomezar/agendarcitademaquillaje/actions/workflows/deploy.yml/badge.svg)](https://github.com/seagomezar/agendarcitademaquillaje/actions/workflows/deploy.yml)

Landing page de alta conversión para **Vane Pérez | Makeup Artist** ([@vaneperezmakeup](https://www.instagram.com/vaneperezmakeup)) en Medellín, Colombia. Diseñada con una estética moderna de lujo inspirada en **Stitch MCP** y desarrollada mediante la orquestación multi-agente de **SwarmForge** de Uncle Bob Robert C. Martin.

---

## 🌸 Características del Proyecto

- **Call To Action Directo a WhatsApp**:
  - Botón principal en el Hero con micro-animaciones.
  - Formulario interactivo de reserva que valida nombre, servicio, fecha y modalidad (estudio vs domicilio) y genera un mensaje personalizado prellenado en WhatsApp (`wa.me/57...`).
  - Botón flotante permanente para contacto inmediato en dispositivos móviles y desktop.
- **Estética Editorial de Lujo (Stitch MCP)**:
  - Paleta de color: Marfil suave (`#FFF8F5`), Rosa Champaña (`#E7C5B1`), Oro Metálico (`#C5A059`) y Espresso Profundo (`#221A14`).
  - Tipografía: Titulares en `Playfair Display` y controles/cuerpo en `Montserrat`.
  - Sombras atmosféricas sutiles y bordes refinados sin saturación visual.
- **Portafolio y Servicios**:
  - Novias / Bridal Glam Luxury.
  - Maquillaje Social & Eventos Especiales.
  - Quinceañeras & Sweet 15.
  - Editorial & Sesiones Fotográficas.
  - Clases VIP de Automaquillaje.
- **Ubicación & Cobertura**:
  - Estudio privado en el área metropolitana de Medellín / Bello.
  - Servicio a domicilio VIP en Medellín, Envigado, El Poblado, Sabaneta y Oriente Antioqueño.

---

## 🤖 Integración de SwarmForge en Antigravity

El framework de coordinación multi-agente de Uncle Bob (`unclebob/swarm-forge`) ha sido integrado tanto a nivel global como local en Antigravity:

- **Activación por Comando de Voz/Texto**:
  - Decir `"use swarm forge"` activa el skill `swarm-forge`.
  - Presenta un cuestionario interactivo para seleccionar el modo de trabajo (`two-pack`, `four-pack`, `six-pack`, `lieutenant` o `project-manager`).
- **Constitución de Ingeniería**:
  - Desarrollo Guiado por Pruebas (TDD).
  - Puntuación CRAP $\le 10$ en todas las funciones.
  - Principio DRY y Arquitectura Limpia (Separación UI/Core).
  - Handoffs durables con commits atómicos de Git.

---

## 🧪 Pruebas en Todos los Modos de SwarmForge

El proyecto fue desarrollado y verificado a través de las 4 modalidades principales de SwarmForge:

### 1. `two-pack` (`coder` → `cleaner`)
- **Coder**: Creó la suite inicial TDD (`test/core_booking.spec.js`) e implementó `js/booking.js`.
- **Cleaner**: Refactorizó constantes, limpió modularidad y redujo complejidad ciclomática.

### 2. `four-pack` (`specifier` → `coder` → `refactorer` → `architect`)
- **Specifier**: Redactó especificaciones Gherkin en `features/appointment_booking.feature`.
- **Coder**: Construyó la interfaz completa en `index.html` y `js/app.js`.
- **Refactorer**: Añadió pruebas de invariantes y robustez en `test/property_invariants.spec.js`.
- **Architect**: Realizó la auditoría estructural en `architecture_review.md` certificando la separación estricta entre el núcleo de negocio y el adaptador del DOM.

### 3. `six-pack` (`specifier` → `coder` → `cleaner` → `architect` → `hardender` → `QA`)
- **Hardener**: Implementó sanitización de entradas, prevención de inyección de código y validación de fechas pasadas en `test/mutation_hardening.spec.js`.
- **QA**: Diseñó y ejecutó la suite de verificación integral `test/landing_page.spec.js` validando enlaces de WhatsApp, imágenes, accesibilidad y diseño responsive.

### 4. `lieutenant` (Concierge & Card Dispatcher)
- Gestionó las tarjetas de trabajo en `swarmforge/project-board.md` a través de las rutas `utility`, `component` y `QA`.

---

## 🚀 Ejecución de Pruebas

Para ejecutar las suites de pruebas automatizadas:

```bash
# 1. Pruebas unitarias de agendamiento (TDD - Coder)
node test/core_booking.spec.js

# 2. Pruebas de propiedades e invariantes (Refactorer)
node test/property_invariants.spec.js

# 3. Pruebas de mutación y seguridad (Hardener)
node test/mutation_hardening.spec.js

# 4. Verificación completa End-to-End (QA)
node test/landing_page.spec.js
```

---

## 🌐 Despliegue en GitHub Pages

El proyecto incluye el flujo automatizado `.github/workflows/deploy.yml`.

### Para desplegar en tu repositorio:
1. Crea un repositorio en GitHub (por ejemplo, `agendarcitademaquillaje`).
2. Agrega el origen remoto y sube tus cambios:
   ```bash
   git remote add origin https://github.com/<tu-usuario>/agendarcitademaquillaje.git
   git branch -M main
   git push -u origin main
   ```
3. En la configuración del repositorio en GitHub:
   - Ve a **Settings** → **Pages**.
   - En **Source**, selecciona **GitHub Actions**.
4. ¡Listo! El sitio estará activo automáticamente en `https://<tu-usuario>.github.io/agendarcitademaquillaje/`.

---

## 📄 Créditos & Derechos

- **Diseño & Maquillaje**: Vane Pérez | Makeup Artist ([@vaneperezmakeup](https://www.instagram.com/vaneperezmakeup)).
- **Arquitectura de Agentes**: Basado en [Uncle Bob SwarmForge](https://github.com/unclebob/swarm-forge).
- **Sistema de Diseño**: Diseñado con **Stitch MCP**.
