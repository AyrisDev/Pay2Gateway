import { stripe } from './stripe';

export interface PaymentIntentOptions {
    amount: number;
    currency: string;
    merchantId: string;
    refId?: string;
    customerName?: string;
    customerPhone?: string;
    callbackUrl?: string;
    providerConfig?: any;
}

export interface PaymentIntentResponse {
    clientSecret: string;
    providerTxId: string;
    nextAction?: 'redirect' | 'iframe' | 'none';
    redirectUrl?: string;
}

export const PaymentProviderFactory = {
    async createIntent(provider: string, options: PaymentIntentOptions): Promise<PaymentIntentResponse> {
        switch (provider.toLowerCase()) {
            case 'stripe':
                return this.handleStripe(options);
            case 'cryptomus':
                return this.handleCryptomus(options);
            case 'nuvei':
            case 'paykings':
            case 'highriskpay':
            case 'paymentcloud':
            case 'securionpay':
                // For now, these will use mock or a generic handler
                return this.handleGeneric(provider, options);
            default:
                return this.handleStripe(options);
        }
    },

    async handleStripe(options: PaymentIntentOptions): Promise<PaymentIntentResponse> {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(options.amount * 100),
            currency: options.currency.toLowerCase(),
            metadata: {
                ref_id: options.refId || '',
                merchant_id: options.merchantId,
                customer_name: options.customerName || '',
                customer_phone: options.customerPhone || '',
            },
        });

        return {
            clientSecret: paymentIntent.client_secret!,
            providerTxId: paymentIntent.id
        };
    },

    async handleCryptomus(options: PaymentIntentOptions): Promise<PaymentIntentResponse> {
        // Mock implementation for Cryptomus - real implementation would call their API
        // Cryptomus usually returns a payment URL for redirect
        const mockTxId = 'crypt_' + Math.random().toString(36).substring(7);
        return {
            clientSecret: mockTxId,
            providerTxId: mockTxId,
            nextAction: 'redirect',
            redirectUrl: `https://cryptomus.com/pay/${mockTxId}`
        };
    },

    async handleGeneric(provider: string, options: PaymentIntentOptions): Promise<PaymentIntentResponse> {
        // Mock generic handler for other providers
        const mockTxId = `${provider.slice(0, 3)}_${Math.random().toString(36).substring(7)}`;
        return {
            clientSecret: `mock_secret_${mockTxId}`,
            providerTxId: mockTxId
        };
    }
};
