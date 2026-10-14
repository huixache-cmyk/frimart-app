-- =====================================================================
-- FRIMART · CORRECCIÓN: tabla antigua de congeladores (demo)
-- Ya existía una tabla "frimart_congeladores" de pruebas con otro formato
-- (5 congeladores demo), por eso no se creó la nueva.
-- Se conserva renombrada como respaldo (no se pierde historial) y se crea la nueva.
-- Ejecutar una vez en Supabase → SQL Editor → Run
-- =====================================================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_schema = 'public' AND table_name = 'frimart_congeladores' AND column_name = 'codigo_qr')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_schema = 'public' AND table_name = 'frimart_congeladores' AND column_name = 'datos') THEN
    BEGIN ALTER PUBLICATION supabase_realtime DROP TABLE public.frimart_congeladores; EXCEPTION WHEN OTHERS THEN NULL; END;
    DROP TRIGGER IF EXISTS trg_historial ON public.frimart_congeladores;
    ALTER TABLE public.frimart_congeladores RENAME TO frimart_congeladores_demo_respaldo;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.frimart_congeladores (
  id               TEXT PRIMARY KEY,
  qr               TEXT,
  tienda_id        TEXT,
  modelo           TEXT,
  activo           BOOLEAN DEFAULT true,
  datos            JSONB NOT NULL,
  creado_en        TIMESTAMPTZ DEFAULT now(),
  creado_por       TEXT,
  actualizado_en   TIMESTAMPTZ DEFAULT now(),
  actualizado_por  TEXT
);
CREATE INDEX IF NOT EXISTS idx_congeladores_tienda ON public.frimart_congeladores (tienda_id);

DROP TRIGGER IF EXISTS trg_historial ON public.frimart_congeladores;
CREATE TRIGGER trg_historial AFTER INSERT OR UPDATE OR DELETE ON public.frimart_congeladores
  FOR EACH ROW EXECUTE FUNCTION public.frimart_registrar_historial();

ALTER TABLE public.frimart_congeladores ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public all frimart_congeladores" ON public.frimart_congeladores;
CREATE POLICY "Public all frimart_congeladores" ON public.frimart_congeladores FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DO $$
BEGIN
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.frimart_congeladores; EXCEPTION WHEN duplicate_object THEN NULL; END;
END $$;
