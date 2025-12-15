class WhatsAppService {
    constructor(apiUrl, apiKey) {
        // Support both Node.js and browser environments
        let envApiUrl = '';
        let envApiKey = '';
        if (typeof process !== 'undefined' && process.env) {
            // Node.js environment
            envApiUrl = process.env.WHATSAPP_API_URL || '';
            envApiKey = process.env.WHATSAPP_API_KEY || '';
        }
        else if (typeof window !== 'undefined' && globalThis.import?.meta?.env) {
            // Vite/browser environment
            const viteEnv = globalThis.import.meta.env;
            envApiUrl = viteEnv.VITE_WHATSAPP_API_URL || '';
            envApiKey = viteEnv.VITE_WHATSAPP_API_KEY || '';
        }
        this.apiUrl = apiUrl || envApiUrl;
        this.apiKey = apiKey || envApiKey;
        if (!this.apiUrl) {
            throw new Error('WHATSAPP_API_URL is required (pass as parameter or set WHATSAPP_API_URL/VITE_WHATSAPP_API_URL environment variable)');
        }
        if (!this.apiKey) {
            throw new Error('WHATSAPP_API_KEY is required (pass as parameter or set WHATSAPP_API_KEY/VITE_WHATSAPP_API_KEY environment variable)');
        }
    }
    async makeRequest(endpoint, data) {
        try {
            const response = await fetch(`${this.apiUrl}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': this.apiKey,
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'API request failed');
            }
            return result;
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * Send text message to WhatsApp
     * @param params Message parameters
     * @returns API response
     */
    async sendMessage(params) {
        return this.makeRequest('/message/send', {
            sessionId: params.sessionId,
            to: params.to,
            message: params.message,
        });
    }
    /**
     * Send media (image, video, document) to WhatsApp
     * @param params Media parameters
     * @returns API response
     */
    async sendMedia(params) {
        return this.makeRequest('/message/send-media', {
            sessionId: params.sessionId,
            to: params.to,
            mediaUrl: params.mediaUrl,
            caption: params.caption || undefined,
        });
    }
    /**
     * Send location to WhatsApp
     * @param params Location parameters
     * @returns API response
     */
    async sendLocation(params) {
        return this.makeRequest('/message/send-location', {
            sessionId: params.sessionId,
            to: params.to,
            latitude: params.latitude,
            longitude: params.longitude,
            description: params.description || undefined,
        });
    }
    /**
     * Set custom API key
     * @param apiKey New API key
     */
    setApiKey(apiKey) {
        this.apiKey = apiKey;
    }
    /**
     * Set custom API URL
     * @param url New API URL
     */
    setApiUrl(url) {
        this.apiUrl = url;
    }
}
export default WhatsAppService;
