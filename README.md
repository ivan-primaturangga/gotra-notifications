# @gotra/notifications

A TypeScript npm package for WhatsApp messaging service integration.

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
