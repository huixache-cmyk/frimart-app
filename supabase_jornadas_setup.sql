-- =====================================================================
-- FRIMART · JORNADAS LABORALES (abrir / cerrar jornada + histórico diario)
-- Ejecutar una vez en Supabase → SQL Editor → Run
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.frimart_jornadas (
  id                   TEXT PRIMARY KEY,
  vendedor_id          TEXT NOT NULL,
  vendedor_nombre      TEXT,
  cedis_id             TEXT,
  ruta_id              TEXT,
  fecha                DATE NOT NULL,
  inicio               TIMESTAMPTZ NOT NULL,
  fin                  TIMESTAMPTZ,
  inicio_lat           DOUBLE PRECISION,
  inicio_lng           DOUBLE PRECISION,
  inicio_distancia_m   INTEGER,
  fin_lat              DOUBLE PRECISION,
  fin_lng              DOUBLE PRECISION,
  cierre_auto          BOOLEAN DEFAULT false,
  tiendas_programadas  INTEGER DEFAULT 0,
  tiendas_visitadas    INTEGER DEFAULT 0,
  venta                NUMERIC(12,2) DEFAULT 0,
  piezas               INTEGER DEFAULT 0,
  calificacion_prom    NUMERIC(5,1),
  cumplimiento_prom    NUMERIC(5,1),
  no_visitadas         JSONB DEFAULT '[]'::jsonb,   -- [{tienda_id, tienda_nombre, motivo}]
  estado               TEXT DEFAULT 'abierta',      -- abierta | cerrada
  creado_en            TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_jornadas_vendedor_fecha ON public.frimart_jornadas (vendedor_id, fecha DESC);

ALTER TABLE public.frimart_jornadas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public all frimart_jornadas" ON public.frimart_jornadas;
CREATE POLICY "Public all frimart_jornadas" ON public.frimart_jornadas FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DO $$
BEGIN
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.frimart_jornadas; EXCEPTION WHEN duplicate_object THEN NULL; END;
END $$;
