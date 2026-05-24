-- ============================================================
-- Migration: Add pricing, guest fields, status columns
-- Ejecutar SOLO si las tablas ya existen
-- ============================================================

-- 1. Agregar columnas a rooms
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS precio_noche DECIMAL(10,2) DEFAULT 0;
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS estado_limpieza VARCHAR(20) DEFAULT 'limpia'
  CHECK (estado_limpieza IN ('limpia', 'sucia', 'mantenimiento'));
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS huesped_nombre TEXT DEFAULT NULL;
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS huesped_identificacion TEXT DEFAULT NULL;
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS huesped_telefono TEXT DEFAULT NULL;
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS check_in TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS check_out TIMESTAMPTZ DEFAULT NULL;

-- 2. Agregar columna precio a servicios
ALTER TABLE servicios ADD COLUMN IF NOT EXISTS precio DECIMAL(8,2) DEFAULT 0;

-- 3. Actualizar precios de servicios existentes
UPDATE servicios SET precio = 0 WHERE titulo IN ('Limpieza de habitación', 'Toallas extra', 'Información local');
UPDATE servicios SET precio = 5.00 WHERE titulo = 'Reabastecer minibar';
UPDATE servicios SET precio = 12.00 WHERE titulo = 'Room service';
UPDATE servicios SET precio = 8.00 WHERE titulo = 'Desayuno en habitación';
UPDATE servicios SET precio = 25.00 WHERE titulo = 'Transporte';
UPDATE servicios SET precio = 15.00 WHERE titulo = 'Lavandería';

-- 4. Insertar habitaciones de ejemplo (si no existen)
INSERT INTO rooms (numero, nombre, tipo, descripcion, precio_noche) VALUES
  ('101', 'Habitación Estándar', 'Estándar', 'Habitación con cama queen, baño privado y vistas al jardín', 80.00),
  ('102', 'Habitación Estándar', 'Estándar', 'Habitación con cama queen, baño privado y vistas al jardín', 80.00),
  ('103', 'Habitación Estándar', 'Estándar', 'Habitación con cama queen, baño privado y vistas al jardín', 80.00),
  ('201', 'Suite Orquídea', 'Suite Junior', 'Suite con cama king, balcón privado y bañera de inmersión', 120.00),
  ('202', 'Suite Orquídea', 'Suite Junior', 'Suite con cama king, balcón privado y bañera de inmersión', 120.00),
  ('301', 'Suite Panorámica', 'Suite', 'Suite de lujo con vistas a las montañas, sala de estar y terraza', 180.00),
  ('112', 'Cabaña del Bosque', 'Cabaña', 'Cabaña privada rodeada de naturaleza con fogatero exterior', 90.00)
ON CONFLICT DO NOTHING;

-- 6. Notificaciones de habitación
CREATE TABLE IF NOT EXISTS notificaciones_habitacion (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL DEFAULT 'servicio' CHECK (tipo IN ('servicio', 'novedad', 'sistema')),
  titulo TEXT NOT NULL,
  mensaje TEXT DEFAULT '',
  leido BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notificaciones_room ON notificaciones_habitacion(room_id);
CREATE INDEX IF NOT EXISTS idx_notificaciones_leido ON notificaciones_habitacion(room_id, leido);

ALTER TABLE notificaciones_habitacion ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Notificaciones visibles para el huésped de la habitación"
  ON notificaciones_habitacion FOR SELECT TO anon
  USING (
    room_id IN (SELECT id FROM rooms WHERE token_sesion_actual IS NOT NULL)
  );

CREATE POLICY "Notificaciones insertables por authenticated"
  ON notificaciones_habitacion FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Notificaciones actualizables por el huésped"
  ON notificaciones_habitacion FOR UPDATE TO anon
  USING (
    room_id IN (SELECT id FROM rooms WHERE token_sesion_actual IS NOT NULL)
  );

-- 5. Perfiles de usuario (roles)
CREATE TABLE IF NOT EXISTS perfiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email TEXT NOT NULL,
  rol TEXT NOT NULL DEFAULT 'recepcion' CHECK (rol IN ('owner', 'recepcion')),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE perfiles ENABLE ROW LEVEL SECURITY;

-- Owner puede ver todos los perfiles
CREATE POLICY "Perfiles visibles para owners"
  ON perfiles FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM perfiles WHERE user_id = auth.uid() AND rol = 'owner')
    OR user_id = auth.uid()
  );

-- Owner puede insertar/actualizar perfiles
CREATE POLICY "Perfiles editables por owners"
  ON perfiles FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM perfiles WHERE user_id = auth.uid() AND rol = 'owner')
  );

CREATE POLICY "Perfiles actualizables por owners"
  ON perfiles FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM perfiles WHERE user_id = auth.uid() AND rol = 'owner')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM perfiles WHERE user_id = auth.uid() AND rol = 'owner')
  );

-- ============================================================
-- RLS para tablas restantes
-- ============================================================

-- ROOMS: anon puede leer habitaciones con sesión activa (para guest portal)
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Rooms visibles para huéspedes con sesión activa"
  ON rooms FOR SELECT TO anon
  USING (token_sesion_actual IS NOT NULL);

CREATE POLICY "Rooms visibles para staff autenticado"
  ON rooms FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Rooms editables por staff autenticado"
  ON rooms FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

-- SOLICITUDES_SERVICIO
ALTER TABLE solicitudes_servicio ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Solicitudes visibles para el huésped de la habitación"
  ON solicitudes_servicio FOR SELECT TO anon
  USING (
    room_id IN (SELECT id FROM rooms WHERE token_sesion_actual IS NOT NULL)
  );

CREATE POLICY "Solicitudes insertables por el huésped"
  ON solicitudes_servicio FOR INSERT TO anon
  WITH CHECK (
    room_id IN (SELECT id FROM rooms WHERE token_sesion_actual IS NOT NULL)
  );

CREATE POLICY "Solicitudes visibles para staff autenticado"
  ON solicitudes_servicio FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Solicitudes editables por staff autenticado"
  ON solicitudes_servicio FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

-- SERVICIOS: lectura pública
ALTER TABLE servicios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Servicios visibles para todos"
  ON servicios FOR SELECT TO anon, authenticated
  USING (true);

-- STAFF: lectura para autenticado
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff visible para autenticado"
  ON staff FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Staff editable por owner"
  ON staff FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM perfiles WHERE user_id = auth.uid() AND rol = 'owner')
  );

CREATE POLICY "Staff actualizable por owner"
  ON staff FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM perfiles WHERE user_id = auth.uid() AND rol = 'owner')
  );

-- HOTEL_CONFIG: lectura pública, escritura para owner
ALTER TABLE hotel_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Config visible para todos"
  ON hotel_config FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Config editable por owner"
  ON hotel_config FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM perfiles WHERE user_id = auth.uid() AND rol = 'owner')
  );

-- BETA_REGISTRATIONS: insert público, solo owner puede leer
ALTER TABLE beta_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Beta registrations insertables por cualquiera"
  ON beta_registrations FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Beta registrations visibles solo para owner"
  ON beta_registrations FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM perfiles WHERE user_id = auth.uid() AND rol = 'owner')
  );

-- AFFILIATES: el afiliado puede ver su propio registro, owner puede ver todos
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Affiliates insertables por cualquiera"
  ON affiliates FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Affiliates visibles para el propio usuario o owner"
  ON affiliates FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM perfiles WHERE user_id = auth.uid() AND rol = 'owner')
  );

-- REFERRALS: owner puede ver, insert por cualquiera con ref_code
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Referrals insertables por cualquiera"
  ON referrals FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Referrals visibles para owner o afiliado relacionado"
  ON referrals FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM perfiles WHERE user_id = auth.uid() AND rol = 'owner')
    OR affiliate_id IN (SELECT id FROM affiliates WHERE user_id = auth.uid())
  );
