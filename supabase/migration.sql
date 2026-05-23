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
