-- Logo del proyecto en el ticket (para mostrarlo aunque no tengamos proyecto_id o el proyecto no tenga logo actualizado)
ALTER TABLE tickets
ADD COLUMN IF NOT EXISTS logo_url VARCHAR(500);

COMMENT ON COLUMN tickets.logo_url IS 'URL del logo del proyecto en el momento de crear el ticket (desde el chat de ayuda).';
