export interface SendMessageParams {
    sessionId: string;
    to: string;
    message: string;
}
export interface SendMediaParams {
    sessionId: string;
    to: string;
    mediaUrl: string;
    caption?: string;
}
export interface SendLocationParams {
    sessionId: string;
    to: string;
    latitude: number;
    longitude: number;
    description?: string;
}
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: {
        code: string;
        details: string;
    };
}
declare class WhatsAppService {
    private apiUrl;
    private apiKey;
    constructor(apiUrl?: string, apiKey?: string);
    private makeRequest;
    /**
     * Send text message to WhatsApp
     * @param params Message parameters
     * @returns API response
     */
    sendMessage(params: SendMessageParams): Promise<ApiResponse>;
    /**
     * Send media (image, video, document) to WhatsApp
     * @param params Media parameters
     * @returns API response
     */
    sendMedia(params: SendMediaParams): Promise<ApiResponse>;
    /**
     * Send location to WhatsApp
     * @param params Location parameters
     * @returns API response
     */
    sendLocation(params: SendLocationParams): Promise<ApiResponse>;
    /**
     * Set custom API key
     * @param apiKey New API key
     */
    setApiKey(apiKey: string): void;
    /**
     * Set custom API URL
     * @param url New API URL
     */
    setApiUrl(url: string): void;
}
export default WhatsAppService;
