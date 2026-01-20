-- Admin users table
CREATE TABLE admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Merchants (Firms) table
CREATE TABLE merchants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    api_key TEXT UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
    webhook_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

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
    merchant_id UUID REFERENCES merchants(id),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to read all
CREATE POLICY "Admins can read all transactions" ON transactions
    FOR SELECT
    USING (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users));

CREATE POLICY "Admins can manage merchants" ON merchants
    USING (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users));

-- Create policy for service role to manage all
CREATE POLICY "Service role can manage all transactions" ON transactions
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Service role can manage all merchants" ON merchants
    USING (true)
    WITH CHECK (true);
