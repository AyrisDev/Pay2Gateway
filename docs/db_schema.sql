-- Admin users table
CREATE TABLE admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Register initial admin (User should replace this or add via dashboard)
-- INSERT INTO admin_users (email) VALUES ('your-email@example.com');

-- Transactions table
CREATE TABLE transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    amount NUMERIC NOT NULL,
    currency TEXT NOT NULL DEFAULT 'TRY',
    status TEXT NOT NULL DEFAULT 'succeeded' CHECK (status IN ('pending', 'succeeded', 'failed')),
    stripe_pi_id TEXT UNIQUE,
    source_ref_id TEXT,
    customer_name TEXT,
    customer_phone TEXT,
    callback_url TEXT,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to read all
CREATE POLICY "Admins can read all transactions" ON transactions
    FOR SELECT
    USING (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users));

-- Create policy for service role to manage all
CREATE POLICY "Service role can manage all" ON transactions
    USING (true)
    WITH CHECK (true);
