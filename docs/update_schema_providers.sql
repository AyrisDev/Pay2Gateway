-- Add payment provider configuration to merchants table
ALTER TABLE merchants ADD COLUMN payment_provider TEXT NOT NULL DEFAULT 'stripe';
ALTER TABLE merchants ADD COLUMN provider_config JSONB DEFAULT '{}'::jsonb;

-- Add provider info to transactions to track which one was used
ALTER TABLE transactions ADD COLUMN provider TEXT NOT NULL DEFAULT 'stripe';
ALTER TABLE transactions ADD COLUMN provider_tx_id TEXT;
ALTER TABLE transactions ADD COLUMN provider_status TEXT;

-- Update status constraint if needed (ours was already quite flexible, but let's be sure)
-- Currently: CHECK (status IN ('pending', 'succeeded', 'failed'))
