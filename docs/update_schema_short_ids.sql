-- Add short_id column to merchants
ALTER TABLE merchants ADD COLUMN IF NOT EXISTS short_id TEXT UNIQUE;

-- Function to generate a random short ID
CREATE OR REPLACE FUNCTION generate_short_id() RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result TEXT := '';
    i INTEGER := 0;
BEGIN
    FOR i IN 1..8 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Update existing merchants with a short_id
UPDATE merchants SET short_id = generate_short_id() WHERE short_id IS NULL;

-- Make short_id required for further inserts
-- ALTER TABLE merchants ALTER COLUMN short_id SET NOT NULL; -- Can do this after update

-- Add owner_id to merchants to link with Supabase Auth users
ALTER TABLE merchants ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id);
