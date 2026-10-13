-- =====================================================================
-- FRIMART · Visitas guiadas, alertas y fotos de evidencia (en línea)
-- Ejecutar UNA VEZ en Supabase → SQL Editor → New query → Run
-- =====================================================================

-- 1) VISITAS GUIADAS ---------------------------------------------------
CREATE TABLE IF NOT EXISTS public.frimart_visitas (
  id                TEXT PRIMARY KEY,
  congelador_id     TEXT NOT NULL,
  tienda_id         TEXT,
  tienda_nombre     TEXT,
  vendedor_id       TEXT,
  vendedor_nombre   TEXT,
  cedis_id          TEXT,
  ruta_id           TEXT,
  inicio            TIMESTAMPTZ,
  fin               TIMESTAMPTZ DEFAULT now(),
  gps_lat           DOUBLE PRECISION,
  gps_lng           DOUBLE PRECISION,
  distancia_m       INTEGER,
  bolsas_surtidas   INTEGER DEFAULT 0,
  venta             NUMERIC(12,2) DEFAULT 0,
  cumplimiento      INTEGER DEFAULT 0,
  frentes_vacios    INTEGER DEFAULT 0,
  temperatura       NUMERIC(5,1),
  alerta_temp       BOOLEAN DEFAULT false,
  checklist         JSONB DEFAULT '{}'::jsonb,
  lineas            JSONB DEFAULT '[]'::jsonb,
  foto_url          TEXT,
  calificacion      INTEGER DEFAULT 0,
  estado            TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente','aprobada','rechazada')),
  revisado_por      TEXT,
  revisado_nombre   TEXT,
  revisado_en       TIMESTAMPTZ,
  comentario        TEXT,
  creado_en         TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_visitas_fin ON public.frimart_visitas (fin DESC);
CREATE INDEX IF NOT EXISTS idx_visitas_vendedor ON public.frimart_visitas (vendedor_id);
CREATE INDEX IF NOT EXISTS idx_visitas_estado ON public.frimart_visitas (estado);

-- 2) ALERTAS (temperatura, equipo, etc.) ------------------------------
CREATE TABLE IF NOT EXISTS public.frimart_alertas (
  id              TEXT PRIMARY KEY,
  tipo            TEXT NOT NULL,            -- 'temperatura' | 'equipo' | 'visita_rechazada'
  severidad       TEXT DEFAULT 'alta',
  mensaje         TEXT NOT NULL,
  visita_id       TEXT,
  congelador_id   TEXT,
  tienda_id       TEXT,
  tienda_nombre   TEXT,
  vendedor_id     TEXT,
  vendedor_nombre TEXT,
  cedis_id        TEXT,
  ruta_id         TEXT,
  atendida        BOOLEAN DEFAULT false,
  atendida_por    TEXT,
  atendida_en     TIMESTAMPTZ,
  creado_en       TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_alertas_abiertas ON public.frimart_alertas (atendida, creado_en DESC);

-- 3) SEGURIDAD (mismo esquema abierto que el resto de tablas frimart_*) --
ALTER TABLE public.frimart_visitas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.frimart_alertas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public all frimart_visitas" ON public.frimart_visitas;
CREATE POLICY "Public all frimart_visitas" ON public.frimart_visitas FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Public all frimart_alertas" ON public.frimart_alertas;
CREATE POLICY "Public all frimart_alertas" ON public.frimart_alertas FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 4) TIEMPO REAL (el supervisor ve visitas y alertas al instante) ------
DO $$
BEGIN
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.frimart_visitas; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.frimart_alertas; EXCEPTION WHEN duplicate_object THEN NULL; END;
END $$;

-- 5) FOTOS DE EVIDENCIA (Storage) --------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('visitas-fotos', 'visitas-fotos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Frimart fotos lectura" ON storage.objects;
CREATE POLICY "Frimart fotos lectura" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'visitas-fotos');
DROP POLICY IF EXISTS "Frimart fotos subida" ON storage.objects;
CREATE POLICY "Frimart fotos subida" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'visitas-fotos');
