-- =====================================================================
-- FRIMART · CATÁLOGO EN LÍNEA + AUTORIZACIONES + HISTORIAL TOTAL
-- Ejecutar una vez en Supabase → SQL Editor → Run (se puede re-ejecutar)
--
--  1. frimart_tiendas / frimart_congeladores: puntos de venta y equipos
--     compartidos entre todos los teléfonos (antes solo vivían en el teléfono).
--  2. frimart_autorizaciones: códigos de UN SOLO USO que genera el supervisor
--     para que un vendedor abra jornada fuera del CEDIS.
--  3. frimart_bitacora: historial inmutable. Un trigger guarda el ANTES y el
--     DESPUÉS de cada alta, cambio o baja en todas las tablas operativas, y la
--     app registra además acciones (inicio/cierre de sesión, códigos, etc.).
--     No se permite editar ni borrar la bitácora.
-- =====================================================================

-- ---------- 1. Tiendas y congeladores ----------
CREATE TABLE IF NOT EXISTS public.frimart_tiendas (
  id               TEXT PRIMARY KEY,
  nombre           TEXT,
  ruta_id          TEXT,
  cedis_id         TEXT,
  lat              DOUBLE PRECISION,
  lng              DOUBLE PRECISION,
  activo           BOOLEAN DEFAULT true,
  datos            JSONB NOT NULL,              -- registro completo de la app
  creado_en        TIMESTAMPTZ DEFAULT now(),
  creado_por       TEXT,
  actualizado_en   TIMESTAMPTZ DEFAULT now(),
  actualizado_por  TEXT
);
CREATE INDEX IF NOT EXISTS idx_tiendas_ruta ON public.frimart_tiendas (ruta_id);

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

-- ---------- 2. Autorizaciones de un solo uso ----------
CREATE TABLE IF NOT EXISTS public.frimart_autorizaciones (
  id                 TEXT PRIMARY KEY,
  codigo             TEXT NOT NULL,
  tipo               TEXT NOT NULL DEFAULT 'jornada_fuera_cedis',
  supervisor_id      TEXT NOT NULL,
  supervisor_nombre  TEXT,
  vendedor_id        TEXT,                       -- vendedor al que se le autoriza
  vendedor_nombre    TEXT,
  motivo             TEXT,
  creado_en          TIMESTAMPTZ DEFAULT now(),
  expira_en          TIMESTAMPTZ NOT NULL,
  usado_en           TIMESTAMPTZ,
  usado_por          TEXT,
  jornada_id         TEXT,
  cancelado_en       TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_autorizaciones_codigo ON public.frimart_autorizaciones (codigo);

-- Jornadas: quién autorizó una apertura fuera del CEDIS
ALTER TABLE public.frimart_jornadas ADD COLUMN IF NOT EXISTS autorizacion_id   TEXT;
ALTER TABLE public.frimart_jornadas ADD COLUMN IF NOT EXISTS autorizado_por    TEXT;
ALTER TABLE public.frimart_jornadas ADD COLUMN IF NOT EXISTS autorizado_nombre TEXT;

-- ---------- 3. Bitácora inmutable ----------
CREATE TABLE IF NOT EXISTS public.frimart_bitacora (
  id              BIGSERIAL PRIMARY KEY,
  creado_en       TIMESTAMPTZ DEFAULT now(),
  origen          TEXT NOT NULL DEFAULT 'app',  -- app | trigger
  usuario_id      TEXT,
  usuario_nombre  TEXT,
  rol             TEXT,
  accion          TEXT NOT NULL,                -- alta | cambio | baja | login | logout | ...
  tabla           TEXT,
  registro_id     TEXT,
  antes           JSONB,
  despues         JSONB,
  detalle         JSONB,
  dispositivo     TEXT
);
CREATE INDEX IF NOT EXISTS idx_bitacora_registro ON public.frimart_bitacora (tabla, registro_id, creado_en DESC);
CREATE INDEX IF NOT EXISTS idx_bitacora_usuario  ON public.frimart_bitacora (usuario_id, creado_en DESC);

CREATE OR REPLACE FUNCTION public.frimart_registrar_historial() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_new JSONB := CASE WHEN TG_OP <> 'DELETE' THEN to_jsonb(NEW) END;
  v_old JSONB := CASE WHEN TG_OP <> 'INSERT' THEN to_jsonb(OLD) END;
  v_ref JSONB := COALESCE(v_new, v_old);
BEGIN
  IF TG_OP = 'UPDATE' AND v_new = v_old THEN RETURN NEW; END IF;  -- sin cambios reales
  INSERT INTO public.frimart_bitacora (origen, usuario_id, accion, tabla, registro_id, antes, despues)
  VALUES (
    'trigger',
    COALESCE(v_ref->>'actualizado_por', v_ref->>'revisado_por', v_ref->>'usado_por', v_ref->>'vendedor_id', v_ref->>'supervisor_id'),
    CASE TG_OP WHEN 'INSERT' THEN 'alta' WHEN 'UPDATE' THEN 'cambio' ELSE 'baja' END,
    TG_TABLE_NAME,
    v_ref->>'id',
    v_old,
    v_new
  );
  RETURN COALESCE(NEW, OLD);
END $$;

DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['frimart_tiendas','frimart_congeladores','frimart_autorizaciones','frimart_jornadas','frimart_visitas','frimart_alertas'] LOOP
    IF to_regclass('public.' || t) IS NOT NULL THEN
      EXECUTE format('DROP TRIGGER IF EXISTS trg_historial ON public.%I', t);
      EXECUTE format('CREATE TRIGGER trg_historial AFTER INSERT OR UPDATE OR DELETE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.frimart_registrar_historial()', t);
    END IF;
  END LOOP;
END $$;

-- ---------- Permisos (piloto: acceso con la llave pública de la app) ----------
ALTER TABLE public.frimart_tiendas        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.frimart_congeladores   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.frimart_autorizaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.frimart_bitacora       ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public all frimart_tiendas" ON public.frimart_tiendas;
CREATE POLICY "Public all frimart_tiendas" ON public.frimart_tiendas FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Public all frimart_congeladores" ON public.frimart_congeladores;
CREATE POLICY "Public all frimart_congeladores" ON public.frimart_congeladores FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Public all frimart_autorizaciones" ON public.frimart_autorizaciones;
CREATE POLICY "Public all frimart_autorizaciones" ON public.frimart_autorizaciones FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Bitácora: solo leer y agregar (sin editar ni borrar)
DROP POLICY IF EXISTS "Bitacora leer" ON public.frimart_bitacora;
CREATE POLICY "Bitacora leer" ON public.frimart_bitacora FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Bitacora agregar" ON public.frimart_bitacora;
CREATE POLICY "Bitacora agregar" ON public.frimart_bitacora FOR INSERT TO anon, authenticated WITH CHECK (true);

DO $$
BEGIN
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.frimart_tiendas;        EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.frimart_congeladores;   EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.frimart_autorizaciones; EXCEPTION WHEN duplicate_object THEN NULL; END;
END $$;
