
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

## Installation

```bash
npm install @gotra/notifications
```

For development linking:
```bash
npm link @gotra/notifications
```

## Configuration

Set environment variables in your project:

```env
WHATSAPP_API_URL=https://your-whatsapp-api.com/api
WHATSAPP_API_KEY=your_api_key_here
```

## Usage

### Using Environment Variables (Recommended for Node.js)

```typescript
import WhatsAppService from '@gotra/notifications';

// No need to pass parameters if env vars are set
const whatsAppService = new WhatsAppService();

async function sendMessage() {
  try {
    const result = await whatsAppService.sendMessage({
      sessionId: 'session123',
      to: '6281234567890',
      message: 'Hello from npm package!'
    });

    console.log('Success:', result);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### Passing Parameters Directly

```typescript
import WhatsAppService from '@gotra/notifications';

const whatsAppService = new WhatsAppService(
  'https://your-whatsapp-api.com/api',
  'your_api_key_here'
);
```

### Custom Configuration

```typescript
// Update API settings after initialization
whatsAppService.setApiUrl('https://new-api.com/api');
whatsAppService.setApiKey('new-api-key');
```

## API Reference

### WhatsAppService Class

#### Constructor
```typescript
new WhatsAppService(apiUrl?: string, apiKey?: string)
```

#### Methods

##### sendMessage(params: SendMessageParams): Promise<ApiResponse>
Send a text message.

**Parameters:**
- `sessionId: string` - Session identifier
- `to: string` - Recipient phone number
- `message: string` - Message content

##### sendMedia(params: SendMediaParams): Promise<ApiResponse>
Send media (image, video, document).

**Parameters:**
- `sessionId: string` - Session identifier
- `to: string` - Recipient phone number
- `mediaUrl: string` - URL of the media file
- `caption?: string` - Optional caption

##### sendLocation(params: SendLocationParams): Promise<ApiResponse>
Send location coordinates.

**Parameters:**
- `sessionId: string` - Session identifier
- `to: string` - Recipient phone number
- `latitude: number` - Latitude coordinate
- `longitude: number` - Longitude coordinate
- `description?: string` - Optional location description

##### setApiKey(apiKey: string): void
Set a custom API key.

##### setApiUrl(url: string): void
Set a custom API URL.

### Interfaces

#### SendMessageParams
```typescript
interface SendMessageParams {
  sessionId: string;
  to: string;
  message: string;
}
```

#### SendMediaParams
```typescript
interface SendMediaParams {
  sessionId: string;
  to: string;
  mediaUrl: string;
  caption?: string;
}
```

#### SendLocationParams
```typescript
interface SendLocationParams {
  sessionId: string;
  to: string;
  latitude: number;
  longitude: number;
  description?: string;
}
```

#### ApiResponse<T>
```typescript
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

The constructor will throw errors if required parameters are missing:

- `apiUrl is required`
- `apiKey is required`

Handle API errors appropriately in your application:

```typescript
try {
  const result = await whatsAppService.sendMessage(params);
  if (!result.success) {
    console.error('API Error:', result.error);
  }
} catch (error) {
  console.error('Network Error:', error.message);
}
```

## License

MIT
