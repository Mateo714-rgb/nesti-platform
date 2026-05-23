-- ============================================================
-- Nesti — Esquema de Base de Datos para Supabase
-- ============================================================

-- 1. HABITACIONES
CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero VARCHAR(10) NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL,
  tipo VARCHAR(50) DEFAULT 'estándar',
  descripcion TEXT,
  token_sesion_actual UUID DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. SERVICIOS DEL HOTEL
CREATE TABLE IF NOT EXISTS servicios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria TEXT NOT NULL,
  icono TEXT NOT NULL,
  titulo TEXT NOT NULL,
  descripcion TEXT DEFAULT '',
  tiempo_estimado TEXT DEFAULT '',
  orden INTEGER DEFAULT 0
);

-- 3. STAFF
CREATE TABLE IF NOT EXISTS staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  rol TEXT NOT NULL CHECK (rol IN ('mucama', 'botones', 'cocina', 'recepcion', 'mantenimiento')),
  avatar TEXT DEFAULT '',
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. SOLICITUDES DE SERVICIO
CREATE TABLE IF NOT EXISTS solicitudes_servicio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  tipo_servicio TEXT NOT NULL,
  nota TEXT DEFAULT '',
  estado VARCHAR(20) NOT NULL DEFAULT 'pendiente'
    CHECK (estado IN ('pendiente', 'aceptado', 'completado')),
  asignado_a UUID REFERENCES staff(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. CONFIGURACIÓN DEL HOTEL
CREATE TABLE IF NOT EXISTS hotel_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'Mi Hotel',
  tagline TEXT DEFAULT '',
  guest_name TEXT DEFAULT 'Huésped',
  wifi_name TEXT DEFAULT '',
  wifi_password TEXT DEFAULT '',
  breakfast_info TEXT DEFAULT '',
  pool_info TEXT DEFAULT '',
  parking_info TEXT DEFAULT '',
  reception_info TEXT DEFAULT '',
  check_out_info TEXT DEFAULT '',
  address TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. ÍNDICES
CREATE INDEX IF NOT EXISTS idx_solicitudes_estado ON solicitudes_servicio(estado);
CREATE INDEX IF NOT EXISTS idx_solicitudes_creado ON solicitudes_servicio(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_solicitudes_room ON solicitudes_servicio(room_id);
CREATE INDEX IF NOT EXISTS idx_rooms_token ON rooms(token_sesion_actual);

-- 7. SEED — SERVICIOS
INSERT INTO servicios (categoria, icono, titulo, descripcion, tiempo_estimado, orden) VALUES
  ('habitación', '🛏️', 'Limpieza de habitación', 'Solicita limpieza o cambio de ropa de cama', '20 min', 1),
  ('habitación', '🪣', 'Toallas extra', 'Toallas de baño o de piscina', '10 min', 2),
  ('habitación', '🧊', 'Reabastecer minibar', 'Agua, jugos, snacks disponibles', '15 min', 3),
  ('alimentos', '🍽️', 'Room service', 'Menú disponible de 7am a 10pm', '35 min', 4),
  ('alimentos', '☕', 'Desayuno en habitación', 'Disfruta el desayuno sin salir del cuarto', '25 min', 5),
  ('logística', '🚗', 'Transporte', 'Taxi al aeropuerto, city tour, excursiones', '30 min', 6),
  ('logística', '👕', 'Lavandería', 'Entrega en bolsa antes de las 9am, lista a las 6pm', '9h', 7),
  ('logística', '📍', 'Información local', 'Restaurantes, actividades, mapas de Mindo', '5 min', 8)
ON CONFLICT DO NOTHING;

-- 8. SEED — STAFF
INSERT INTO staff (nombre, rol) VALUES
  ('María Gómez', 'mucama'),
  ('Carlos Ruiz', 'mucama'),
  ('Pedro Martínez', 'botones'),
  ('Ana López', 'cocina'),
  ('Luis Vega', 'cocina'),
  ('Sofía Torres', 'recepcion'),
  ('Jorge Mora', 'mantenimiento')
ON CONFLICT DO NOTHING;

-- 9. SEED — CONFIG INICIAL
INSERT INTO hotel_config (name, tagline, guest_name, wifi_name, wifi_password, breakfast_info, pool_info, parking_info, reception_info, check_out_info, address)
VALUES (
  'Casa del Árbol',
  'Boutique Lodge · Mindo, Ecuador',
  'Sebastián',
  'CasaArbol_Guest',
  'orquidea2024',
  'Incluido. Buffet de 7:00 – 10:30 AM en el comedor principal',
  'Abierta de 8 AM a 8 PM. Toallas disponibles en recepción',
  'Gratuito. Zona vigilada 24h, sótano nivel B1',
  'Disponible 24 horas. Llama al ext. 0 desde el teléfono de tu habitación',
  'Hasta las 12:00 PM. Extensión disponible según disponibilidad (cobro extra)',
  'Av. Quito km 4.5, Mindo, Ecuador'
)
ON CONFLICT DO NOTHING;

-- 10. REGISTROS BETA (BETA REGISTRATIONS)
CREATE TABLE IF NOT EXISTS beta_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  hotel TEXT NOT NULL,
  telefono TEXT DEFAULT '',
  hotel_size TEXT DEFAULT '',
  mensaje TEXT DEFAULT '',
  ref_code TEXT DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 11. AFILIADOS
CREATE TABLE IF NOT EXISTS affiliates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  ref_code TEXT NOT NULL UNIQUE,
  payout_email TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 12. REFERRALS (hoteles referidos)
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  beta_registration_id UUID REFERENCES beta_registrations(id) ON DELETE SET NULL,
  hotel_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'paid')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 13. NOVEDADES / HOY EN EL HOTEL
CREATE TABLE IF NOT EXISTS novedades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descripcion TEXT DEFAULT '',
  categoria TEXT DEFAULT 'general' CHECK (categoria IN ('general', 'evento', 'comida', 'actividad')),
  fecha_evento DATE DEFAULT NULL,
  activo BOOLEAN DEFAULT true,
  hotel_id UUID DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE novedades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Novedades insertable por admin autenticado"
  ON novedades FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Novedades editables por admin autenticado"
  ON novedades FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Novedades visibles para todos (lectura)"
  ON novedades FOR SELECT TO anon, authenticated
  USING (true);

-- 14. HABILITAR REALTIME
ALTER PUBLICATION supabase_realtime ADD TABLE solicitudes_servicio;
ALTER PUBLICATION supabase_realtime ADD TABLE rooms;
