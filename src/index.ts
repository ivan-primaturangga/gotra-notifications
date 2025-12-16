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

class WhatsAppService {
  private apiUrl: string;
  private apiKey: string;

  constructor(apiUrl?: string, apiKey?: string) {
    // Support both Node.js and browser environments
    let envApiUrl = '';
    let envApiKey = '';

    if (typeof process !== 'undefined' && process.env) {
      // Node.js environment
      envApiUrl = (process.env as any).WHATSAPP_API_URL || '';
      envApiKey = (process.env as any).WHATSAPP_API_KEY || '';
    } else if (typeof window !== 'undefined' && (globalThis as any).import?.meta?.env) {
      // Vite/browser environment
      const viteEnv = (globalThis as any).import.meta.env;
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

  private async makeRequest<T>(
    endpoint: string,
    data: any
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.apiUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        let errorMessage = `API request failed with status ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If response is not JSON, use status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();

      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Send text message to WhatsApp
   * @param params Message parameters
   * @returns API response
   */
  async sendMessage(params: SendMessageParams): Promise<ApiResponse> {
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
  async sendMedia(params: SendMediaParams): Promise<ApiResponse> {
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
  async sendLocation(params: SendLocationParams): Promise<ApiResponse> {
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
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  /**
   * Set custom API URL
   * @param url New API URL
   */
  setApiUrl(url: string): void {
    this.apiUrl = url;
  }
}


export { QrSession } from './qrSession';
export default WhatsAppService;
