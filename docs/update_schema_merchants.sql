-- Create merchants table
CREATE TABLE merchants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    api_key TEXT UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
    webhook_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add merchant_id to transactions
ALTER TABLE transactions ADD COLUMN merchant_id UUID REFERENCES merchants(id);

-- Update RLS for transactions to support merchants (future proofing)
-- For now, we'll just keep the admin policy as is, but we'll add more later.

-- Optional: Add index for performance
CREATE INDEX idx_transactions_merchant_id ON transactions(merchant_id);
