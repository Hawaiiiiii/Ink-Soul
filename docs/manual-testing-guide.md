# Guía de Testing Manual - Sistema de Pagos Stripe
## Ink & Soul by Asunaah

**Sitio Desplegado**: https://1a3ujjc1eeuf.space.minimax.io
**Fecha**: 2025-11-01

## ✅ Infraestructura Desplegada

### Edge Functions (Activas)
1. **create-payment-intent**: `https://enitsirdzrsqtgjksctk.supabase.co/functions/v1/create-payment-intent`
2. **confirm-payment**: `https://enitsirdzrsqtgjksctk.supabase.co/functions/v1/confirm-payment`
3. **get-orders**: `https://enitsirdzrsqtgjksctk.supabase.co/functions/v1/get-orders`
4. **stripe-webhook**: `https://enitsirdzrsqtgjksctk.supabase.co/functions/v1/stripe-webhook`

### Base de Datos
- ✅ Tabla `orders` creada
- ✅ Tabla `order_items` creada

### Frontend
- ✅ Carrito con localStorage
- ✅ Páginas de checkout y confirmación
- ✅ Integración Stripe.js

## 📋 Plan de Testing Manual

### Pathway 1: Navegación y Productos

**Objetivo**: Verificar que la tienda muestre productos correctamente

**Pasos**:
1. Abrir https://1a3ujjc1eeuf.space.minimax.io
2. Click en "Shop" en el menú de navegación
3. **Verificar**:
   - [ ] Se muestran 15 productos
   - [ ] Las imágenes cargan correctamente
   - [ ] Los precios son visibles
   - [ ] Los botones "Añadir al Carrito" están presentes

4. Probar filtros de categoría:
   - [ ] Click en "Prints" - filtrar productos
   - [ ] Click en "Merchandise" - filtrar productos
   - [ ] Click en "Aftercare" - filtrar productos
   - [ ] Click en "Prints / Merchandise" - mostrar todos

**Resultado Esperado**: Todos los productos se muestran correctamente con filtros funcionales

---

### Pathway 2: Sistema de Carrito

**Objetivo**: Verificar funcionalidad completa del carrito

**Pasos**:
1. En la página de tienda, click en "Añadir al Carrito" del primer producto
2. **Verificar**:
   - [ ] Aparece feedback "Añadido" en el botón
   - [ ] El icono del carrito en la navegación muestra badge con "1"

3. Añadir 2 productos más al carrito
4. **Verificar**:
   - [ ] El contador del carrito muestra "3"

5. Click en el icono del carrito (icono de shopping cart en la navegación)
6. **Verificar**:
   - [ ] Redirección a `/checkout`
   - [ ] Se muestran los 3 productos añadidos
   - [ ] Cada producto muestra: imagen, nombre, precio unitario, cantidad
   - [ ] Se muestra el total calculado correctamente

**Resultado Esperado**: Carrito funciona correctamente, items se añaden y contador se actualiza

---

### Pathway 3: Edición del Carrito

**Objetivo**: Verificar controles de edición en checkout

**Pasos (desde página /checkout)**:
1. Click en botón "+" de un producto
   - **Verificar**: Cantidad aumenta, total se recalcula

2. Click en botón "-" de un producto
   - **Verificar**: Cantidad disminuye, total se recalcula

3. Click en icono de basura (eliminar) de un producto
   - **Verificar**: Producto se elimina, total se recalcula, quedan 2 productos

4. Si se intenta disminuir cantidad a 0
   - **Verificar**: Producto se elimina automáticamente

**Resultado Esperado**: Todos los controles de edición funcionan correctamente

---

### Pathway 4: Formulario de Envío

**Objetivo**: Verificar validación del formulario

**Pasos (en página /checkout con productos en carrito)**:
1. **Sin completar campos**, click en "Continuar al Pago"
   - **Verificar**: Aparece mensaje de error "Por favor completa todos los campos requeridos"

2. Completar formulario:
   ```
   Email: test@inkandsoul.com
   Nombre Completo: Test Usuario
   Dirección: Calle Prueba 123
   Ciudad: Madrid
   Código Postal: 28001
   ```

3. Click en "Continuar al Pago"
   - **Verificar**: 
     - [ ] Mensaje "Preparando pago..." aparece brevemente
     - [ ] Aparece formulario de pago de Stripe (Stripe Elements)
     - [ ] El resumen del carrito desaparece (ya no editable)

**Resultado Esperado**: Validación funciona, formulario de Stripe se carga

---

### Pathway 5: Pago con Stripe (Modo Test)

**Objetivo**: Completar un pago exitoso de prueba

**Tarjeta de Prueba**:
- **Número**: 4242 4242 4242 4242
- **Fecha**: 12/25 (cualquier fecha futura)
- **CVC**: 123 (cualquier 3 dígitos)

**Pasos (con formulario de Stripe visible)**:
1. Ingresar datos de la tarjeta de prueba
2. **Verificar**: Campos se llenan sin errores

3. Click en "Pagar Ahora"
   - **Verificar**: 
     - [ ] Botón muestra "Procesando..."
     - [ ] Después de unos segundos, redirección automática
     - [ ] URL cambia a `/checkout/success`

4. En página de éxito, **verificar**:
   - [ ] Mensaje "Gracias por tu compra" visible
   - [ ] Icono de éxito (checkmark verde) visible
   - [ ] Información de próximos pasos mostrada
   - [ ] Botones "Continuar Comprando" y "Volver al Inicio" presentes

5. Click en icono del carrito en navegación
   - **Verificar**: Contador muestra "0" (carrito vacío)

**Resultado Esperado**: Pago procesa exitosamente, carrito se limpia, confirmación visible

---

### Pathway 6: Pago Rechazado (Modo Test)

**Objetivo**: Verificar manejo de errores

**Tarjeta de Prueba (que falla)**:
- **Número**: 4000 0000 0000 0002
- **Fecha**: 12/25
- **CVC**: 123

**Pasos**:
1. Añadir productos al carrito nuevamente
2. Ir a checkout, completar información de envío
3. Ingresar tarjeta que falla (4000 0000 0000 0002)
4. Click en "Pagar Ahora"
   - **Verificar**:
     - [ ] Aparece mensaje de error de Stripe
     - [ ] El usuario permanece en la página de pago
     - [ ] Puede intentar con otra tarjeta

**Resultado Esperado**: Error se maneja correctamente, usuario puede reintentar

---

## 🔍 Verificación de Base de Datos

**Después de completar un pago exitoso**, verificar en Supabase:

### Query 1: Ver última orden
```sql
SELECT * FROM orders ORDER BY created_at DESC LIMIT 1;
```

**Verificar**:
- [ ] `status` = 'pending' (inicialmente)
- [ ] `total_amount` = suma de productos
- [ ] `customer_email` = email ingresado
- [ ] `stripe_payment_intent_id` presente

### Query 2: Ver items de la orden
```sql
SELECT oi.* FROM order_items oi
JOIN orders o ON oi.order_id = o.id
ORDER BY o.created_at DESC
LIMIT 10;
```

**Verificar**:
- [ ] Cantidad de registros = cantidad de productos en carrito
- [ ] `product_name`, `quantity`, `price_at_time` correctos

---

## 🎯 Checklist de Testing Completo

### Funcionalidad Básica
- [ ] Navegación entre páginas funciona
- [ ] Productos se muestran correctamente
- [ ] Filtros de categoría funcionan
- [ ] Responsive design en mobile/tablet

### Sistema de Carrito
- [ ] Añadir productos al carrito
- [ ] Contador del carrito se actualiza
- [ ] Ver carrito en /checkout
- [ ] Editar cantidades (+ / -)
- [ ] Eliminar productos
- [ ] Total se calcula correctamente
- [ ] Persistencia en localStorage (recargar página)

### Proceso de Pago
- [ ] Formulario de envío valida campos requeridos
- [ ] Stripe Elements se carga correctamente
- [ ] Pago exitoso con tarjeta de test
- [ ] Redirección a página de éxito
- [ ] Carrito se limpia después de pago exitoso
- [ ] Manejo de errores de pago

### Base de Datos
- [ ] Órdenes se crean en tabla `orders`
- [ ] Items se crean en tabla `order_items`
- [ ] Payment Intent ID se almacena

### Edge Functions
- [ ] create-payment-intent responde correctamente
- [ ] Orden se crea en BD antes de mostrar Stripe form
- [ ] Webhook está configurado (opcional en test mode)

---

## 🐛 Registro de Bugs Encontrados

| # | Descripción | Severidad | Página | Status |
|---|-------------|-----------|--------|--------|
| 1 | Ejemplo: Botón no cambia color | Baja | /shop | Pendiente |

---

## 📊 Resultados Esperados vs Actuales

### Flujo Completo E-commerce
**Esperado**: Usuario puede navegar → añadir al carrito → completar checkout → pagar con Stripe → recibir confirmación

**Actual**: [Por completar después del testing]

---

## 🔧 Configuración Adicional Necesaria

### Stripe Webhook (Producción)
Para producción completa, configurar webhook en Stripe Dashboard:

1. URL: `https://enitsirdzrsqtgjksctk.supabase.co/functions/v1/stripe-webhook`
2. Eventos:
   - payment_intent.succeeded
   - payment_intent.payment_failed
   - payment_intent.canceled
3. Copiar `Signing Secret` y configurar como `STRIPE_WEBHOOK_SECRET` en Supabase

---

## 📝 Notas del Testing

- Modo actual: **TEST** (tarjetas de prueba Stripe)
- Para producción: cambiar a claves `pk_live_` y `sk_live_`
- Todas las transacciones actuales son simuladas (no se cobra dinero real)

---

## ✅ Aprobación Final

**Testing completado por**: _________________
**Fecha**: _________________
**Resultado**: [ ] Aprobado [ ] Requiere correcciones

**Comentarios adicionales**:
_______________________________________
_______________________________________
