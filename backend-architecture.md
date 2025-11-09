# Arquitectura Backend - Ink & Soul by Asunaah

## Base de Datos Supabase

### Tablas

#### 1. appointments (Citas)
```sql
- id: UUID PRIMARY KEY
- customer_name: TEXT NOT NULL
- email: TEXT NOT NULL
- phone: TEXT
- project_type: TEXT (devocional/geometrico/espiritual/simbolico)
- description: TEXT
- body_zone: TEXT
- preferred_date: DATE
- status: TEXT DEFAULT 'pending' (pending/confirmed/cancelled/completed)
- created_at: TIMESTAMP DEFAULT NOW()
```

#### 2. products (Productos)
```sql
- id: UUID PRIMARY KEY
- name: TEXT NOT NULL
- name_en: TEXT NOT NULL
- description: TEXT
- description_en: TEXT
- price: DECIMAL NOT NULL
- category: TEXT (prints/merchandise/aftercare)
- image_url: TEXT
- stock: INTEGER DEFAULT 0
- is_limited_edition: BOOLEAN DEFAULT FALSE
- edition_number: TEXT (ej: "I/III")
- created_at: TIMESTAMP DEFAULT NOW()
```

#### 3. orders (Órdenes)
```sql
- id: UUID PRIMARY KEY
- stripe_payment_intent_id: TEXT UNIQUE
- status: TEXT DEFAULT 'pending'
- total_amount: DECIMAL NOT NULL
- currency: TEXT DEFAULT 'eur'
- shipping_address: JSONB
- billing_address: JSONB
- customer_email: TEXT
- created_at: TIMESTAMP DEFAULT NOW()
- updated_at: TIMESTAMP DEFAULT NOW()
```

#### 4. order_items (Items de Orden)
```sql
- id: UUID PRIMARY KEY
- order_id: UUID (referencia a orders.id)
- product_id: UUID (referencia a products.id)
- quantity: INTEGER NOT NULL
- price_at_time: DECIMAL NOT NULL
- product_name: TEXT
- product_image_url: TEXT
- created_at: TIMESTAMP DEFAULT NOW()
```

#### 5. contact_messages (Mensajes de Contacto)
```sql
- id: UUID PRIMARY KEY
- name: TEXT NOT NULL
- email: TEXT NOT NULL
- subject: TEXT
- message: TEXT NOT NULL
- created_at: TIMESTAMP DEFAULT NOW()
```

## Edge Functions

### 1. create-payment-intent
- **Propósito**: Crear intención de pago con Stripe
- **Input**: { amount, currency, cartItems, customerEmail, shippingAddress }
- **Output**: { clientSecret, paymentIntentId, orderId }

### 2. submit-appointment
- **Propósito**: Guardar cita en base de datos
- **Input**: { customer_name, email, phone, project_type, description, body_zone, preferred_date }
- **Output**: { success, appointmentId }

### 3. send-contact-message
- **Propósito**: Guardar mensaje de contacto
- **Input**: { name, email, subject, message }
- **Output**: { success, messageId }

## Políticas RLS (Row Level Security)

Todas las tablas tendrán políticas que permiten:
- SELECT: público (anon)
- INSERT: público (anon) y service_role
- UPDATE: solo service_role
- DELETE: solo service_role

## APIs Externas

- **Stripe**: Procesamiento de pagos
- **Google Maps**: Mostrar ubicación del estudio (solo frontend, API key ya disponible)
- **WhatsApp**: Enlaces directos (no requiere API)

## Deployment

Backend completamente en Supabase:
- Base de datos: PostgreSQL gestionado
- Edge Functions: Deno Deploy
- Storage: Para imágenes de productos (opcional)
