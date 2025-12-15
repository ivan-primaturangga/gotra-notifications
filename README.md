
# gotra-notifications

A simple TypeScript package for integrating WhatsApp messaging services via API.

## Installation

### From GitHub (recommended for latest version)

```bash
npm install https://github.com/ivan-primaturangga/gotra-notifications.git
```

## Usage

### 1. Set Environment Variables (Recommended)

Create a `.env` file in your project root:

```
VITE_WHATSAPP_API_URL=https://your-whatsapp-api.com/api
VITE_WHATSAPP_API_KEY=your_api_key_here
```

For Node.js, use `WHATSAPP_API_URL` and `WHATSAPP_API_KEY` instead.

### 2. Import and Use the Service

```typescript
import WhatsAppService from 'gotra-notifications';

// If using environment variables, you can instantiate without parameters
const wa = new WhatsAppService();

// Or pass API URL and Key directly
// const wa = new WhatsAppService('https://your-whatsapp-api.com/api', 'your_api_key_here');

// Send a text message
wa.sendMessage({
  sessionId: 'session123',
  to: '6281234567890',
  message: 'Hello from gotra-notifications!'
}).then(console.log).catch(console.error);
```

### 3. Send Media or Location

```typescript
// Send media
wa.sendMedia({
  sessionId: 'session123',
  to: '6281234567890',
  mediaUrl: 'https://example.com/image.jpg',
  caption: 'Check this out!'
});

// Send location
wa.sendLocation({
  sessionId: 'session123',
  to: '6281234567890',
  latitude: -6.2,
  longitude: 106.8,
  description: 'Jakarta'
});
```

## API Reference

### WhatsAppService

#### Constructor
`new WhatsAppService(apiUrl?: string, apiKey?: string)`

#### Methods
- `sendMessage(params: SendMessageParams): Promise<ApiResponse>`
- `sendMedia(params: SendMediaParams): Promise<ApiResponse>`
- `sendLocation(params: SendLocationParams): Promise<ApiResponse>`
- `setApiKey(apiKey: string): void`
- `setApiUrl(url: string): void`

### Interfaces

```typescript
interface SendMessageParams {
  sessionId: string;
  to: string;
  message: string;
}

interface SendMediaParams {
  sessionId: string;
  to: string;
  mediaUrl: string;
  caption?: string;
}

interface SendLocationParams {
  sessionId: string;
  to: string;
  latitude: number;
  longitude: number;
  description?: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    details: string;
  };
}
```

## Error Handling

If required parameters are missing, the constructor will throw an error:

- `WHATSAPP_API_URL is required`
- `WHATSAPP_API_KEY is required`

Always wrap your API calls in try/catch or handle `.catch()` for promise rejections.

## License

MIT