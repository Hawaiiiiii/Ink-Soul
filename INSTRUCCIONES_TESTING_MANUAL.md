# 🔧 INSTRUCCIONES DE TESTING MANUAL - INK & SOUL
## Acciones Específicas para Ejecutar

---

## 🎯 URL DE TESTING
```
https://ntyfyn98yktr.space.minimax.io
```

---

## 📋 TAREAS ESPECÍFICAS A EJECUTAR

### 1. 🌍 TEST SISTEMA i18n (CRÍTICO - 15 minutos)

#### Paso 1.1: Verificar Página de Inicio ES
- **Acción**: Navegar a la URL principal
- **Verificar**: 
  - [ ] Carga completa sin errores
  - [ ] Todo el texto en español
  - [ ] Footer con créditos visibles
  - [ ] Copyright © 2025

#### Paso 1.2: Probar Cambio a Inglés
- **Acción**: Buscar y usar selector de idioma (puede estar en menú hamburguesa)
- **Verificar**:
  - [ ] Transición ES → EN funciona
  - [ ] Contenido cambia a inglés
  - [ ] Regresa a español EN → ES

#### Paso 1.3: Verificar Traducciones Completas
- **Navegar a cada página en EN**:
  - [ ] Inicio (`/`)
  - [ ] Sobre mí (`/about`)
  - [ ] Portfolio (`/portfolio`)
  - [ ] Citas (`/citas`)
  - [ ] Tienda (`/tienda`)
  - [ ] Contacto (`/contact`)

**⚠️ CRÍTICO**: Anotar cualquier texto que permanezca en español

---

### 2. 📝 TEST FORMULARIO DE CITAS (CRÍTICO - 20 minutos)

#### Paso 2.1: Acceso al Formulario
- **Acción**: Navegar a `/citas`
- **Verificar**: 
  - [ ] Página carga correctamente
  - [ ] Formulario visible y completo

#### Paso 2.2: Verificar Opción "Otros/Other"
- **Acción**: Localizar campo "Project Type" o "Tipo de Proyecto"
- **Verificar**:
  - [ ] En español: opción "Otros" disponible
  - [ ] Cambiar a inglés: opción cambia a "Other"
  - [ ] Regresar a español: vuelve a "Otros"

#### Paso 2.3: Testing de Validación
- **Acción**: Intentar enviar formulario vacío
- **Verificar**:
  - [ ] Mensajes de error en campos requeridos
  - [ ] Campos marcados: nombre, email, project type

#### Paso 2.4: Envío Exitoso
- **Acción**: Llenar formulario completo con datos de prueba:
  ```
  Nombre: "Test Usuario"
  Email: "test@ejemplo.com"
  Proyecto: "Otros" (o "Other" en EN)
  Mensaje: "Testing del formulario"
  ```
- **Verificar**:
  - [ ] Envío exitoso
  - [ ] Mensaje de confirmación

#### Paso 2.5: Verificar Emails
- **Acción**: Revisar bandejas de entrada en 5-10 minutos:
  - [ ] `inkandsoul@gmail.com` - Email recibido
  - [ ] `daviderikgarciaarenas@gmail.com` - Email recibido

---

### 3. 💳 TEST STRIPE CHECKOUT (CRÍTICO - 25 minutos)

#### Paso 3.1: Navegación a Tienda
- **Acción**: Ir a `/tienda`
- **Verificar**:
  - [ ] Página carga con productos
  - [ ] Precios visibles
  - [ ] Botones "Agregar al carrito" funcionan

#### Paso 3.2: Proceso de Compra
- **Acción**: Agregar productos al carrito
- **Verificar**:
  - [ ] Contador del carrito aumenta
  - [ ] Carrito accesible
  - [ ] Precios correctos

#### Paso 3.3: Checkout con Tarjeta Test
- **Acción**: Proceder al pago
- **Usar tarjeta de prueba**:
  ```
  Número: 4242 4242 4242 4242
  Fecha: 12/34
  CVC: 123
  Nombre: Test User
  ```
- **Verificar**:
  - [ ] Formulario de pago carga
  - [ ] Tarjeta test es aceptada
  - [ ] Proceso de pago completo
  - [ ] Página de confirmación aparece

---

### 4. 🎨 TEST DISEÑO Y FOOTER (15 minutos)

#### Paso 4.1: Verificación Visual del Footer
- **Acción**: Inspeccionar footer con DevTools (F12)
- **Verificar colores específicos**:
  - [ ] Roles en color hueso: `rgb(232, 227, 216)` o `#E8E3D8`
  - [ ] Nombres en dorado: `rgb(209, 167, 91)` o `#d1a75b`
  - [ ] Sin bullet points (•) en la lista

#### Paso 4.2: Responsive Design
- **Acción**: Usar DevTools para simular dispositivos
- **Probar viewports**:
  - [ ] **Móvil (375px)**: Menú hamburguesa, formularios usables
  - [ ] **Tablet (768px)**: Galería responsive, navegación adaptada
  - [ ] **Desktop (1024px+)**: Layout completo

---

### 5. 📊 TEST PERFORMANCE (OPCIONAL - 10 minutos)

#### Paso 5.1: Lighthouse Audit
- **Acción**: Abrir DevTools → Lighthouse
- **Configuración**:
  - [ ] Device: Mobile
  - [ ] Categories: Performance, Accessibility, Best Practices, SEO
- **Objetivos mínimos**:
  - [ ] Performance ≥ 85
  - [ ] Accessibility ≥ 85
  - [ ] Best Practices ≥ 85
  - [ ] SEO ≥ 85

---

## 🚨 PROBLEMAS COMUNES Y SOLUCIONES

### Si el formulario de citas no carga:
1. Verificar que JavaScript está habilitado
2. Revisar consola del navegador (F12) para errores
3. Probar en modo incógnito

### Si el checkout falla:
1. Verificar conexión a internet
2. Confirmar que la tarjeta test es exacta: `4242 4242 4242 4242`
3. Revisar errores en consola del navegador

### Si las traducciones no funcionan:
1. Verificar que el selector de idioma es clickeable
2. Probar recargar la página después del cambio
3. Verificar URL `/en` directamente

---

## ✅ CHECKLIST FINAL

### Testing Completado (Marcar cuando termine cada uno):
- [ ] **i18n ES completo** (todas las páginas en español)
- [ ] **i18n EN completo** (cambio a inglés funcional)
- [ ] **Formulario citas** (validación + envío + emails)
- [ ] **Stripe checkout** (compra completa con test card)
- [ ] **Footer visual** (colores correctos sin bullets)
- [ ] **Responsive** (móvil/tablet/desktop)
- [ ] **Performance** (Lighthouse ≥ 85 en todas las categorías)

---

## 📧 REPORTE DE RESULTADOS

Después de completar todas las pruebas, documentar:

1. **Problemas encontrados**: Lista específica con URLs
2. **Funcionalidades OK**: Confirmar qué работает bien
3. **Tiempo total**: Duración de cada testing
4. **Screenshots**: Capturas de pantalla de problemas
5. **Recomendaciones**: Qué mejorar

**¡Ejecuta este plan completo y reporta los resultados!**

---
