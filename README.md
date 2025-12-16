
# gotra-notifications

A simple TypeScript package for integrating WhatsApp messaging services via API, including WhatsApp QR code scan features for Node.js, browser, or React environments.

## Main Features

- Send WhatsApp messages (text, media, location)
- Scan WhatsApp QR code (for device/session authentication)
- Node.js, browser, and React support

---

## Installation

```bash
npm install https://github.com/ivan-primaturangga/gotra-notifications.git
```

---

## Basic Usage

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

---

## WhatsApp QR Code Scan Feature

The QrSession module makes it easy to authenticate WhatsApp via QR code in any environment.

### Import

```typescript
import { QrSession } from 'gotra-notifications';
```

### How to Use (Node.js/Browser/General JS)

```typescript
const session = new QrSession({
  sessionId: 'session123',
  apiUrl: 'https://your-whatsapp-api.com/api',
  apiKey: 'your_api_key_here',
});

// Start session and get QR endpoint
const { qrEndpoint } = await session.startSession();

// Get QR code string
const qrString = await session.loadQRCode(qrEndpoint);

// Display qrString using a QR code library (e.g. qrcode.react, qrcodejs, etc)

// Check session status (whether scanned/authenticated)
const status = await session.checkStatus();
if (status.status === 'authenticated' || status.status === 'ready') {
  // QR has been scanned and is ready to use
}
```

### Notes
- To display the QR code in the browser, use a library such as `qrcode.react` (React), `qrcodejs`, or any other QR code library.
- This module only handles backend/API logic, not visual QR code rendering.

---

## React Implementation Example

### Simple (Display QR Code)

```tsx
import React, { useState } from 'react';
import { QrSession } from 'gotra-notifications';
import QRCode from 'react-qr-code'; // install: npm install react-qr-code

const session = new QrSession({
  sessionId: 'session123',
  apiUrl: 'https://your-whatsapp-api.com/api',
  apiKey: 'your_api_key_here',
});

export function QRCodeScan() {
  const [qrString, setQrString] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStart = async () => {
    setLoading(true);
    setError(null);
    try {
      const { qrEndpoint } = await session.startSession();
      const qr = await session.loadQRCode(qrEndpoint);
      setQrString(qr);
    } catch (err: any) {
      setError(err.message || 'Failed to start session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleStart} disabled={loading}>
        {loading ? 'Loading...' : 'Show QR Code'}
      </button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {qrString && (
        <div style={{ marginTop: 16 }}>
          <QRCode value={qrString} size={256} />
        </div>
      )}
    </div>
  );
}
```

### With Auto Status Check (Polling)

This example adds automatic session status checking (polling) after the QR code is displayed. If the status is 'authenticated' or 'ready', a success notification will appear.

```tsx
import React, { useState, useRef } from 'react';
import { QrSession } from 'gotra-notifications';
import QRCode from 'react-qr-code';

const session = new QrSession({
  sessionId: 'session123',
  apiUrl: 'https://your-whatsapp-api.com/api',
  apiKey: 'your_api_key_here',
});

export function QRCodeScanWithStatus() {
  const [qrString, setQrString] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const handleStart = async () => {
    setLoading(true);
    setError(null);
    setStatus(null);
    try {
      const { qrEndpoint } = await session.startSession();
      const qr = await session.loadQRCode(qrEndpoint);
      setQrString(qr);
      startPolling();
    } catch (err: any) {
      setError(err.message || 'Failed to start session');
    } finally {
      setLoading(false);
    }
  };

  const startPolling = () => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    pollingRef.current = setInterval(async () => {
      try {
        const res = await session.checkStatus();
        setStatus(res.status);
        if (res.status === 'authenticated' || res.status === 'ready') {
          clearInterval(pollingRef.current!);
        }
      } catch (err: any) {
        setError('Failed to check status');
      }
    }, 3000); // check every 3 seconds
  };

  React.useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  return (
    <div>
      <button onClick={handleStart} disabled={loading}>
        {loading ? 'Loading...' : 'Show QR Code'}
      </button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {qrString && (
        <div style={{ marginTop: 16 }}>
          <QRCode value={qrString} size={256} />
        </div>
      )}
      {status && (
        <div style={{ marginTop: 16 }}>
          Status: {status}
          {status === 'authenticated' || status === 'ready' ? (
            <div style={{ color: 'green' }}>QR has been scanned & ready to use!</div>
          ) : null}
        </div>
      )}
    </div>
  );
}
```

---

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

### QrSession
- `startSession(): Promise<QrSessionResult>`
- `loadQRCode(qrEndpoint: string): Promise<string>`
- `checkStatus(): Promise<QrSessionStatus>`

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

interface QrSessionOptions {
  sessionId: string;
  apiUrl: string;
  apiKey: string;
}

interface QrSessionResult {
  qr: string;
  qrEndpoint: string;
}

interface QrSessionStatus {
  status: string;
  [key: string]: any;
}
```

---

## Error Handling

If required parameters are missing, the constructor will throw an error:

- `WHATSAPP_API_URL is required`
- `WHATSAPP_API_KEY is required`

Always use try/catch or .catch() to handle promise errors.

---

## License

MIT

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

## QR Code Session (Scan QR WhatsApp)

Modul ini menyediakan fitur scan QR code WhatsApp yang bisa digunakan di Node.js, browser, atau framework JS/TS apa saja.

### Import

```typescript
import { QrSession } from 'gotra-notifications';
```

### Contoh Penggunaan

```typescript
const session = new QrSession({
  sessionId: 'session123',
  apiUrl: 'https://your-whatsapp-api.com/api',
  apiKey: 'your_api_key_here',
});

// Mulai session dan dapatkan endpoint QR
const { qrEndpoint } = await session.startSession();

// Ambil string QR code
const qrString = await session.loadQRCode(qrEndpoint);

// Tampilkan qrString menggunakan library QR code (misal: qrcode.react, qrcodejs, dsb)

// Cek status session (apakah sudah scan/terautentikasi)
const status = await session.checkStatus();
if (status.status === 'authenticated' || status.status === 'ready') {
  // Sudah scan QR dan siap digunakan
}
```

### Catatan

### WhatsAppService

#### Constructor
`new WhatsAppService(apiUrl?: string, apiKey?: string)`

#### Methods

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


Always wrap your API calls in try/catch or handle `.catch()` for promise rejections.

## License

MIT