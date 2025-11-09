# README: Módulo Flash Tattoo - Ink & Soul

## Estado de Implementación: BACKEND COMPLETO + FUNDAMENTOS FRONTEND

**Fecha**: 2025-11-05  
**Estado**: Backend 100% funcional | Frontend: Estructura base lista  
**Siguiente**: Implementar componentes UI y páginas React

---

## 1. ARQUITECTURA IMPLEMENTADA

### Base de Datos Supabase ✅

Se han creado 4 tablas con sus respectivas políticas RLS:

#### Tabla: `flash_events`
Gestiona eventos flash (Halloween, Navidad, etc.)

```sql
- id (UUID, PK)
- title, title_en (TEXT) - Títulos bilingües
- slug (TEXT, UNIQUE) - URL amigable
- description, description_en (TEXT) - Descripciones bilingües
- start_date, end_date (TIMESTAMPTZ) - Fechas del evento
- is_active (BOOLEAN) - Estado del evento
- banner_image (TEXT) - URL imagen banner
- rules_markdown, rules_markdown_en (TEXT) - Reglas en markdown
- deposit_amount (INTEGER) - Depósito en centavos (default 2000 = 20€)
- created_at, updated_at (TIMESTAMPTZ)
```

#### Tabla: `flash_designs`
Diseños disponibles por evento

```sql
- id (UUID, PK)
- event_id (UUID, FK) - Referencia al evento
- title, title_en (TEXT) - Títulos bilingües
- image_url (TEXT) - Imagen principal (PNG 1:1, 1200px)
- color_image_url (TEXT) - Imagen a color (opcional)
- base_price (INTEGER) - Precio base en centavos
- color_extra (INTEGER) - Extra por color en centavos
- stock (INTEGER) - Unidades disponibles
- zones (TEXT[]) - Zonas permitidas ['forearm','arm','ankle','calf']
- sizes (TEXT[]) - Tamaños disponibles ['S','M','L']
- duration_minutes (INTEGER[]) - Duración por tamaño [20,30,40]
- is_available (BOOLEAN)
- created_at, updated_at (TIMESTAMPTZ)
```

#### Tabla: `flash_slots`
Slots de tiempo disponibles

```sql
- id (UUID, PK)
- event_id (UUID, FK)
- design_id (UUID, FK, NULL)
- slot_date (DATE)
- start_time (TIME)
- duration_minutes (INTEGER)
- taken (BOOLEAN) - Estado del slot
- booking_id (UUID) - Referencia a booking
- created_at (TIMESTAMPTZ)
- UNIQUE(slot_date, start_time)
```

#### Tabla: `flash_bookings`
Reservas confirmadas

```sql
- id (UUID, PK)
- event_id, design_id, slot_id (UUIDs, FKs)
- client_name, client_email, client_phone (TEXT)
- size (TEXT) - CHECK ('S', 'M', 'L')
- zone (TEXT) - Zona del cuerpo
- with_color (BOOLEAN)
- price_total (INTEGER) - Precio final en centavos
- stripe_payment_intent_id (TEXT)
- status (TEXT) - CHECK ('pending', 'confirmed', 'cancelled', 'completed')
- notes (TEXT)
- created_at, updated_at (TIMESTAMPTZ)
```

### Políticas RLS ✅

- **Lectura pública**: Eventos activos, diseños disponibles, slots libres
- **Admin completo**: Service role puede gestionar todo
- **Bookings**: Solo admin puede ver/modificar

---

## 2. EDGE FUNCTIONS DESPLEGADAS ✅

### `flash-create-payment-intent`
**URL**: `https://enitsirdzrsqtgjksctk.supabase.co/functions/v1/flash-create-payment-intent`

**Función**: Crear PaymentIntent de Stripe y booking inicial

**Request**:
```json
{
  "eventId": "uuid",
  "designId": "uuid",
  "slotId": "uuid",
  "clientName": "string",
  "clientEmail": "string",
  "clientPhone": "string (opcional)",
  "size": "S|M|L",
  "zone": "forearm|arm|ankle|calf",
  "withColor": boolean,
  "notes": "string (opcional)"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "clientSecret": "pi_xxx_secret_xxx",
    "bookingId": "uuid",
    "priceTotal": 3500
  }
}
```

**Lógica**:
1. Verifica disponibilidad del slot
2. Obtiene datos del diseño
3. Calcula precio: `base_price + (color_extra if withColor)`
4. Crea PaymentIntent en Stripe
5. Crea booking en estado 'pending'
6. Retorna clientSecret para Stripe Elements

### `flash-confirm-booking`
**URL**: `https://enitsirdzrsqtgjksctk.supabase.co/functions/v1/flash-confirm-booking`

**Función**: Webhook de Stripe para confirmar booking

**Flujo**:
1. Recibe evento `payment_intent.succeeded`
2. Busca booking por `stripe_payment_intent_id`
3. Actualiza booking a status 'confirmed'
4. Marca slot como `taken=true`
5. Decrementa stock del diseño
6. Envía emails:
   - Cliente: Confirmación con detalles
   - Estudio: Notificación nueva reserva

**Emails**:
- Usa Resend API
- Destinatarios: `NOTIFY_TO_1` (inkandsoul@gmail.com), `NOTIFY_TO_2` (daviderikgarciaarenas@gmail.com)
- Template HTML con branding Ink & Soul

### `flash-get-available-slots`
**URL**: `https://enitsirdzrsqtgjksctk.supabase.co/functions/v1/flash-get-available-slots`

**Función**: Obtener slots disponibles

**Query Params**:
- `eventId` (requerido)
- `designId` (opcional)
- `date` (opcional, formato YYYY-MM-DD)

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "slot_date": "2025-10-31",
      "start_time": "10:00:00",
      "duration_minutes": 30
    }
  ]
}
```

---

## 3. SISTEMA I18N ACTUALIZADO ✅

### Traducciones Agregadas

En `/src/lib/i18n.ts` se agregaron todas las claves para el módulo Flash en ES/EN:

```typescript
flash: {
  title, subtitle, events, activeEvents, noEvents, viewEvent,
  bookNow, soldOut, stock, available, designs, selectDesign,
  size, sizes: {S, M, L},
  zone, zones: {forearm, arm, ankle, calf},
  color, withColor, withoutColor,
  selectSlot, date, time, duration, minutes,
  price, basePrice, colorExtra, total,
  booking: {
    title, step1-5, name, email, phone, notes,
    confirm, processing, success, successMessage
  },
  errors: {
    slotUnavailable, paymentFailed, designSoldOut,
    selectSize, selectZone, selectSlot, fillRequired
  },
  countdown: {
    startsIn, endsIn, days, hours, minutes, seconds
  }
}
```

### Navegación Actualizada

Se agregó el link "Flash" al nav:
```typescript
nav: {
  flash: 'Flash' (ES) | 'Flash' (EN)
}
```

---

## 4. VARIABLES DE ENTORNO CONFIGURADAS ✅

Todas las secrets están configuradas en Supabase Edge Functions:

```bash
SUPABASE_URL=https://enitsirdzrsqtgjksctk.supabase.co
SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
STRIPE_SECRET_KEY=sk_test_... (configurar en Supabase)
STRIPE_PUBLISHABLE_KEY=pk_test_... (configurar en .env frontend)
RESEND_API_KEY=re_... (configurar en Supabase)
RESEND_FROM=Ink & Soul <notifications@resend.dev>
NOTIFY_TO_1=inkandsoul@gmail.com
NOTIFY_TO_2=daviderikgarciaarenas@gmail.com
```

---

## 5. FRONTEND POR IMPLEMENTAR

### Estructura de Archivos Recomendada

```
src/
├── pages/
│   ├── FlashEventsPage.tsx      # Listado de eventos activos
│   ├── FlashEventDetailPage.tsx # Detalle de evento con diseños
│   └── admin/
│       └── FlashAdminPage.tsx   # Panel admin CRUD eventos/diseños
├── components/
│   └── flash/
│       ├── FlashEventCard.tsx      # Card de evento
│       ├── FlashDesignCard.tsx     # Card de diseño con stock
│       ├── FlashBookingDrawer.tsx  # Drawer de reserva (stepper)
│       ├── FlashSlotPicker.tsx     # Selector de horarios
│       ├── CountdownTimer.tsx      # Contador regresivo
│       └── StockBadge.tsx          # Badge de stock disponible
├── hooks/
│   ├── useFlashEvents.ts           # Hook para eventos
│   ├── useFlashDesigns.ts          # Hook para diseños
│   ├── useFlashSlots.ts            # Hook para slots
│   └── useFlashBooking.ts          # Hook para crear booking
└── types/
    └── flash.ts                    # Tipos TypeScript
```

### Tipos TypeScript

Crear `/src/types/flash.ts`:

```typescript
export interface FlashEvent {
  id: string;
  title: string;
  title_en?: string;
  slug: string;
  description?: string;
  description_en?: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  banner_image?: string;
  rules_markdown?: string;
  rules_markdown_en?: string;
  deposit_amount: number;
  created_at: string;
  updated_at: string;
}

export interface FlashDesign {
  id: string;
  event_id: string;
  title: string;
  title_en?: string;
  image_url: string;
  color_image_url?: string;
  base_price: number;
  color_extra: number;
  stock: number;
  zones: string[];
  sizes: ('S' | 'M' | 'L')[];
  duration_minutes: number[];
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface FlashSlot {
  id: string;
  event_id: string;
  design_id?: string;
  slot_date: string;
  start_time: string;
  duration_minutes: number;
  taken: boolean;
  booking_id?: string;
  created_at: string;
}

export interface FlashBooking {
  eventId: string;
  designId: string;
  slotId: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  size: 'S' | 'M' | 'L';
  zone: string;
  withColor: boolean;
  notes?: string;
}
```

### Hooks Recomendados

#### `useFlashEvents.ts`

```typescript
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { FlashEvent } from '../types/flash';

export const useFlashEvents = () => {
  const [events, setEvents] = useState<FlashEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('flash_events')
          .select('*')
          .eq('is_active', true)
          .order('start_date', { ascending: true });

        if (error) throw error;
        setEvents(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return { events, loading, error };
};
```

#### `useFlashBooking.ts`

```typescript
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { FlashBooking } from '../types/flash';

export const useFlashBooking = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBooking = async (bookingData: FlashBooking) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke(
        'flash-create-payment-intent',
        {
          body: bookingData
        }
      );

      if (error) throw error;
      if (data.error) throw new Error(data.error.message);

      return data.data; // { clientSecret, bookingId, priceTotal }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error creating booking';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createBooking, loading, error };
};
```

### Componentes Principales

#### `FlashEventCard.tsx`

```typescript
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { FlashEvent } from '../types/flash';
import { Button } from './common/Button';
import { CountdownTimer } from './flash/CountdownTimer';

interface Props {
  event: FlashEvent;
}

export const FlashEventCard = ({ event }: Props) => {
  const { t, language } = useLanguage();
  const title = language === 'es' ? event.title : (event.title_en || event.title);
  const description = language === 'es' ? event.description : (event.description_en || event.description);

  const isActive = new Date() >= new Date(event.start_date) && new Date() <= new Date(event.end_date);
  const isUpcoming = new Date() < new Date(event.start_date);

  return (
    <div className="bg-background-elevated border border-border-gold rounded-lg overflow-hidden hover:shadow-glow-gold transition-all duration-standard">
      {event.banner_image && (
        <div className="aspect-video overflow-hidden">
          <img 
            src={event.banner_image} 
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-lg">
        <h3 className="font-display text-2xl text-accent-gold mb-sm">{title}</h3>
        <p className="text-text-secondary text-sm mb-md">{description}</p>
        
        {isUpcoming && (
          <div className="mb-md">
            <p className="text-text-tertiary text-xs uppercase tracking-wider mb-xs">
              {t('flash.countdown.startsIn')}
            </p>
            <CountdownTimer targetDate={event.start_date} />
          </div>
        )}
        
        {isActive && (
          <div className="mb-md">
            <p className="text-text-tertiary text-xs uppercase tracking-wider mb-xs">
              {t('flash.countdown.endsIn')}
            </p>
            <CountdownTimer targetDate={event.end_date} />
          </div>
        )}
        
        <Link to={`/flash/${event.slug}`}>
          <Button variant="primary" className="w-full">
            {t('flash.viewEvent')}
          </Button>
        </Link>
      </div>
    </div>
  );
};
```

#### `FlashDesignCard.tsx`

```typescript
import { useLanguage } from '../contexts/LanguageContext';
import { FlashDesign } from '../types/flash';
import { Button } from './common/Button';

interface Props {
  design: FlashDesign;
  onSelect: (design: FlashDesign) => void;
}

export const FlashDesignCard = ({ design, onSelect }: Props) => {
  const { t, language } = useLanguage();
  const title = language === 'es' ? design.title : (design.title_en || design.title);
  const isSoldOut = design.stock <= 0;

  return (
    <div className="bg-background-elevated border border-border-gold rounded-lg overflow-hidden hover:border-accent-gold transition-all duration-fast group">
      <div className="aspect-square overflow-hidden relative">
        <img 
          src={design.image_url} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-standard group-hover:scale-105"
        />
        
        {/* Stock Badge */}
        <div className="absolute top-2 right-2">
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
            isSoldOut 
              ? 'bg-red-900/80 text-red-200' 
              : design.stock <= 3
              ? 'bg-yellow-900/80 text-yellow-200'
              : 'bg-green-900/80 text-green-200'
          }`}>
            {isSoldOut ? t('flash.soldOut') : `${design.stock} ${t('flash.available')}`}
          </div>
        </div>
      </div>

      <div className="p-md">
        <h4 className="font-display text-lg text-text-primary mb-xs">{title}</h4>
        
        <div className="flex items-center justify-between mb-sm">
          <span className="text-text-secondary text-sm">{t('flash.basePrice')}</span>
          <span className="text-accent-gold font-semibold">
            €{(design.base_price / 100).toFixed(2)}
          </span>
        </div>

        {design.color_extra > 0 && (
          <div className="flex items-center justify-between mb-md">
            <span className="text-text-tertiary text-xs">{t('flash.colorExtra')}</span>
            <span className="text-text-secondary text-xs">
              +€{(design.color_extra / 100).toFixed(2)}
            </span>
          </div>
        )}

        <Button 
          variant="primary" 
          size="sm" 
          className="w-full"
          onClick={() => onSelect(design)}
          disabled={isSoldOut}
        >
          {isSoldOut ? t('flash.soldOut') : t('flash.selectDesign')}
        </Button>
      </div>
    </div>
  );
};
```

---

## 6. RUTAS A CONFIGURAR

En `/src/App.tsx`, agregar:

```typescript
import { FlashEventsPage } from './pages/FlashEventsPage';
import { FlashEventDetailPage } from './pages/FlashEventDetailPage';

// En el Router:
<Route path="/flash" element={<FlashEventsPage />} />
<Route path="/flash/:slug" element={<FlashEventDetailPage />} />
```

En `/src/components/layout/Navigation.tsx`, agregar link:

```typescript
{ path: '/flash', label: t('nav.flash') }
```

---

## 7. TESTING REQUERIDO

### Checklist de Testing

#### Backend
- [ ] Crear evento de prueba vía SQL
- [ ] Crear diseños con diferentes precios y stock
- [ ] Generar slots para varias fechas
- [ ] Test create-payment-intent con datos válidos
- [ ] Test con slot ya tomado (debe fallar)
- [ ] Test confirm-booking con webhook Stripe

#### Frontend
- [ ] Listado de eventos muestra eventos activos
- [ ] Detalle de evento muestra diseños con stock correcto
- [ ] Selección de tamaño S/M/L calcula precio correcto
- [ ] Selección de color añade color_extra al precio
- [ ] Selector de slots muestra solo disponibles
- [ ] Flujo completo: diseño → tamaño → color → zona → slot → pago
- [ ] Stripe Elements carga correctamente
- [ ] Pago exitoso muestra confirmación
- [ ] Email de confirmación recibido

#### Tarjetas de Prueba Stripe
- Éxito: 4242 4242 4242 4242
- Fallo: 4000 0000 0000 0002

---

## 8. DATOS DE EJEMPLO

### Crear Evento de Prueba

```sql
INSERT INTO flash_events (
  title, title_en, slug, description, description_en,
  start_date, end_date, is_active, deposit_amount
) VALUES (
  'Halloween Flash 2025',
  'Halloween Flash 2025',
  'halloween-2025',
  'Diseños exclusivos de Halloween con temática oscura y misteriosa',
  'Exclusive Halloween designs with dark and mysterious themes',
  '2025-10-25 00:00:00+00',
  '2025-10-31 23:59:59+00',
  true,
  2000
);
```

### Crear Diseño de Prueba

```sql
INSERT INTO flash_designs (
  event_id, title, title_en, image_url,
  base_price, color_extra, stock,
  zones, sizes, duration_minutes
) VALUES (
  '(event_id del INSERT anterior)',
  'Calavera Gótica',
  'Gothic Skull',
  'https://placehold.co/1200x1200/1a1a1a/C6A45D.png',
  3500,  -- 35€ base
  1000,  -- +10€ color
  5,     -- 5 unidades
  ARRAY['forearm', 'arm', 'calf'],
  ARRAY['S', 'M', 'L'],
  ARRAY[20, 30, 40]
);
```

### Generar Slots Automáticamente

```sql
-- Slots para el 31 de octubre, cada 30 minutos, de 10:00 a 18:00
INSERT INTO flash_slots (event_id, slot_date, start_time, duration_minutes)
SELECT 
  '(event_id)',
  '2025-10-31'::date,
  time::time,
  30
FROM generate_series(
  '10:00'::time,
  '18:00'::time,
  '30 minutes'::interval
) AS time;
```

---

## 9. PRÓXIMOS PASOS RECOMENDADOS

### Prioridad Alta
1. Implementar `FlashEventsPage` - Listado de eventos
2. Implementar `FlashEventDetailPage` - Detalle con diseños
3. Implementar `FlashBookingDrawer` - Drawer de reserva con stepper
4. Actualizar Navigation con link a Flash
5. Testing manual del flujo completo

### Prioridad Media
6. Implementar `FlashAdminPage` - Panel admin CRUD
7. Implementar generador masivo de slots
8. Dashboard de bookings del día
9. Exportación de datos a CSV

### Prioridad Baja
10. Banner dinámico en Home cuando hay evento activo
11. Log de auditoría de cambios
12. Notificaciones push para nuevos bookings
13. Sistema de cancelación de bookings

---

## 10. SOLUCIÓN DE PROBLEMAS

### Error: "Slot no disponible"
- Verificar que el slot no esté marcado como `taken=true`
- Verificar que la fecha/hora del slot sea futura
- Verificar RLS policies en flash_slots

### Error: "Diseño agotado"
- Verificar que `stock > 0`
- Verificar que `is_available = true`
- Verificar RLS policies en flash_designs

### Error: "Payment intent failed"
- Verificar `STRIPE_SECRET_KEY` en Supabase Edge Functions
- Verificar que el amount sea > 0
- Ver logs de la edge function en Supabase Dashboard

### Emails no se envían
- Verificar `RESEND_API_KEY` en Supabase Edge Functions
- Verificar `RESEND_FROM` y destinatarios `NOTIFY_TO_1`, `NOTIFY_TO_2`
- Ver logs de flash-confirm-booking en Supabase

---

## 11. RECURSOS ÚTILES

### Documentación
- [Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [Stripe Payment Intents](https://stripe.com/docs/payments/payment-intents)
- [Resend API](https://resend.com/docs/introduction)
- [Stripe Elements React](https://stripe.com/docs/stripe-js/react)

### URLs Importantes
- Supabase Dashboard: https://supabase.com/dashboard/project/enitsirdzrsqtgjksctk
- Stripe Dashboard: https://dashboard.stripe.com/test/payments
- Edge Functions: https://enitsirdzrsqtgjksctk.supabase.co/functions/v1/

---

**Módulo Flash Tattoo - Backend Completo ✅**  
**Frontend - Por Implementar según esta guía**