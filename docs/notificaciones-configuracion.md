# Sistema de Notificaciones - Guía de Configuración

## Información del Deployment

- **URL del sitio**: https://xcbz5y47s112.space.minimax.io
- **Fecha de deployment**: 2025-11-04
- **Estado**: Sistema completo desplegado

---

## Pasos de Configuración Post-Deployment

### 1. Configurar Variables de Entorno en Supabase

Accede al dashboard de Supabase:
- URL: https://supabase.com/dashboard/project/enitsirdzrsqtgjksctk/settings/functions

Añade las siguientes variables de entorno (Settings > Edge Functions > Environment Variables):

```bash
# Resend API Configuration
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx
RESEND_FROM=Ink & Soul <notifications@resend.dev>

# Destinatarios de notificaciones
NOTIFY_TO_1=inkandsoul@gmail.com
NOTIFY_TO_2=daviderikgarciaarenas@gmail.com
```

**Cómo obtener RESEND_API_KEY:**
1. Crea cuenta en https://resend.com
2. Ve a API Keys: https://resend.com/api-keys
3. Crea una nueva API key
4. Copia el valor que empieza con `re_`

---

### 2. Crear Usuario Administrador

Para acceder al panel administrativo, necesitas crear un usuario en Supabase Auth:

**Opción A: Desde Supabase Dashboard (Recomendado)**

1. Ve a Authentication > Users: https://supabase.com/dashboard/project/enitsirdzrsqtgjksctk/auth/users
2. Click en "Add user" > "Create new user"
3. Completa:
   - **Email**: tu email de administrador
   - **Password**: contraseña segura (mínimo 6 caracteres)
   - **Auto Confirm User**: Activado (marca el checkbox)
4. Click en "Create user"

**Opción B: Desde SQL Editor**

```sql
-- Crear usuario admin
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@inkandsoul.com', -- Cambia por tu email
  crypt('tu_password_seguro', gen_salt('bf')), -- Cambia por tu contraseña
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);
```

---

### 3. Acceder al Panel Administrativo

Una vez configurado el usuario:

1. Ve a: https://xcbz5y47s112.space.minimax.io/admin/login
2. Introduce las credenciales creadas
3. Accederás al dashboard administrativo

**Rutas disponibles:**
- `/admin/login` - Página de inicio de sesión
- `/admin/dashboard` - Dashboard con estadísticas
- `/admin/notifications` - Tabla completa de notificaciones

---

## Funcionalidades del Panel Administrativo

### Dashboard
- **Estadísticas globales**: Total de notificaciones por tipo
- **Actividad reciente**: Últimas 24 horas
- **Notificaciones recientes**: Últimas 5 notificaciones

### Página de Notificaciones
- **Tabla completa**: Todas las notificaciones registradas
- **Filtros avanzados**:
  - Por tipo (consulta, cita, compra)
  - Búsqueda en asunto/contenido
  - Rango de fechas (desde/hasta)
  - Reset de filtros
- **Paginación**: 10 notificaciones por página
- **Modal de detalles**: Ver contenido completo HTML
- **Exportación CSV**: Descargar datos filtrados

---

## Edge Functions Desplegadas

### 1. send-notification
- **URL**: https://enitsirdzrsqtgjksctk.supabase.co/functions/v1/send-notification
- **Función**: Envía emails con Resend y registra en BD
- **Método**: POST
- **Body**:
```json
{
  "tipo": "consulta|cita|compra",
  "asunto": "string",
  "contenido": "HTML string",
  "datosExtra": {}
}
```

### 2. contact-notification
- **URL**: https://enitsirdzrsqtgjksctk.supabase.co/functions/v1/contact-notification
- **Función**: Procesa notificaciones del formulario de contacto
- **Integración**: Conectado con ContactPage

### 3. appointment-notification
- **URL**: https://enitsirdzrsqtgjksctk.supabase.co/functions/v1/appointment-notification
- **Función**: Procesa notificaciones de solicitudes de citas
- **Integración**: Conectado con AppointmentsPage

### 4. stripe-webhook (actualizado)
- **URL**: https://enitsirdzrsqtgjksctk.supabase.co/functions/v1/stripe-webhook
- **Función**: Webhook de Stripe con notificaciones de compra integradas
- **Integración**: Automático al completar pago

---

## Diseño del Panel

### Paleta de Colores Ink & Soul
- **Fondo principal**: #0b0b0b (negro carbón)
- **Fondo elevado**: #1a1a1a
- **Texto principal**: #EAE6DA (hueso)
- **Acento dorado**: #C6A45D
- **Bordes**: #333

### Componentes
- **Tipografía**: Playfair Display (títulos) + Inter (cuerpo)
- **Iconos**: Lucide React
- **Responsive**: Mobile-first con sidebar colapsable
- **Accesibilidad**: Focus states, contraste WCAG AA

---

## Testing del Sistema

### Probar Notificaciones de Contacto
1. Ve a: https://xcbz5y47s112.space.minimax.io/contact
2. Completa el formulario
3. Verifica email en los destinatarios configurados
4. Comprueba el registro en /admin/notifications

### Probar Notificaciones de Citas
1. Ve a: https://xcbz5y47s112.space.minimax.io/appointments
2. Completa el formulario de cita
3. Verifica email y registro

### Probar Notificaciones de Compra
1. Añade productos al carrito
2. Completa el proceso de pago con tarjeta de prueba Stripe
3. Verifica email de notificación de compra
4. Comprueba el registro en el panel

---

## Solución de Problemas

### No llegan emails
1. Verifica que RESEND_API_KEY esté configurada correctamente
2. Revisa los logs de la Edge Function en Supabase
3. Comprueba que los emails destinatarios sean válidos
4. Verifica que el dominio de Resend esté verificado

### No puedo iniciar sesión en el panel
1. Verifica que el usuario exista en Supabase Auth
2. Comprueba que el email esté confirmado (email_confirmed_at no sea null)
3. Intenta resetear la contraseña
4. Revisa los logs del navegador (F12 > Console)

### Las notificaciones no se registran
1. Verifica que la tabla `notificaciones` exista
2. Comprueba las políticas RLS estén activas
3. Revisa los logs de las Edge Functions
4. Verifica que SUPABASE_SERVICE_ROLE_KEY esté configurada

---

## Estructura de la Base de Datos

### Tabla: notificaciones

```sql
CREATE TABLE notificaciones (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tipo TEXT NOT NULL CHECK (tipo IN ('consulta', 'cita', 'compra')),
  asunto TEXT NOT NULL,
  contenido TEXT NOT NULL,
  fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  enviado_a TEXT[] NOT NULL,
  datos_extra JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Índices:**
- `idx_notificaciones_tipo` en columna `tipo`
- `idx_notificaciones_fecha` en columna `fecha` (DESC)

**Row Level Security:**
- SELECT: Solo usuarios autenticados
- INSERT: Solo service_role (Edge Functions)

---

## Próximos Pasos Opcionales

### Funcionalidades Avanzadas
- [ ] Reenvío manual de notificaciones desde el panel
- [ ] Plantillas personalizables de emails
- [ ] Webhooks para notificaciones en tiempo real
- [ ] Backup automático de notificaciones
- [ ] Sistema de alertas por umbral (ej: +10 consultas en 1h)
- [ ] Integración con WhatsApp Business API
- [ ] Dashboard con gráficos de tendencias (Chart.js/Recharts)

---

## Contacto y Soporte

Para cualquier duda o problema con el sistema de notificaciones:
- Revisa los logs en Supabase Dashboard
- Consulta la documentación de Resend: https://resend.com/docs
- Verifica las Edge Functions en: https://supabase.com/dashboard/project/enitsirdzrsqtgjksctk/functions
