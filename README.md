# gotra-notifications

Paket npm TypeScript untuk integrasi layanan pesan WhatsApp.

## Instalasi

### Dari npm (jika sudah publish)
```bash
npm install gotra-notifications
```

### Dari GitHub (untuk development atau versi terbaru)
```bash
npm install https://github.com/ivan-primaturangga/gotra-notifications.git
```

## Konfigurasi

### Untuk Node.js
Set environment variables:
```env
WHATSAPP_API_URL=https://your-whatsapp-api.com/api
WHATSAPP_API_KEY=your_api_key_here
```

### Untuk Browser/Vite
Buat file `.env` di root project:
```env
VITE_WHATSAPP_API_URL=https://your-whatsapp-api.com/api
VITE_WHATSAPP_API_KEY=your_api_key_here
```

## Penggunaan

### Node.js (dengan env vars)
```typescript
import WhatsAppService from 'gotra-notifications';

const whatsApp = new WhatsAppService();

async function kirimPesan() {
  try {
    const result = await whatsApp.sendMessage({
      sessionId: 'session123',
      to: '6281234567890',
      message: 'Halo dari paket npm!'
    });

    console.log('Berhasil:', result);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### Browser/Vite (dengan env vars)
```typescript
import WhatsAppService from 'gotra-notifications';

const whatsApp = new WhatsAppService();

// Sama seperti Node.js, env vars otomatis dibaca
```

### Dengan Parameter Langsung
```typescript
import WhatsAppService from 'gotra-notifications';

const whatsApp = new WhatsAppService(
  'https://your-whatsapp-api.com/api',
  'your_api_key_here'
);
```

### Kirim Media
```typescript
const result = await whatsApp.sendMedia({
  sessionId: 'session123',
  to: '6281234567890',
  mediaUrl: 'https://example.com/image.jpg',
  caption: 'Ini gambar'
});
```

### Kirim Lokasi
```typescript
const result = await whatsApp.sendLocation({
  sessionId: 'session123',
  to: '6281234567890',
  latitude: -6.2088,
  longitude: 106.8456,
  description: 'Jakarta'
});
```

### Update Konfigurasi
```typescript
whatsApp.setApiUrl('https://new-api.com/api');
whatsApp.setApiKey('new-key');
```

## API Reference

### WhatsAppService

#### Constructor
```typescript
new WhatsAppService(apiUrl?: string, apiKey?: string)
```

#### Methods
- `sendMessage(params)` - Kirim pesan teks
- `sendMedia(params)` - Kirim media
- `sendLocation(params)` - Kirim lokasi
- `setApiKey(key)` - Set API key baru
- `setApiUrl(url)` - Set API URL baru

## Penanganan Error

### Error Umum
- **WHATSAPP_API_URL is required**: Set `WHATSAPP_API_URL` atau `VITE_WHATSAPP_API_URL`
- **WHATSAPP_API_KEY is required**: Set `WHATSAPP_API_KEY` atau `VITE_WHATSAPP_API_KEY`
- **Network errors**: Cek koneksi internet dan URL API
- **API errors**: Cek response dari API WhatsApp

```typescript
try {
  const result = await whatsApp.sendMessage(params);
  if (!result.success) {
    console.error('API Error:', result.message);
  }
} catch (error) {
  console.error('Error:', error.message);
}
```

## Troubleshooting

### Package tidak bisa install dari GitHub
- Pastikan repo GitHub public
- Cek apakah `dist/` folder ada di repo
- Jalankan `npm run build` di repo lokal sebelum push

### Error di browser
- Pastikan env vars menggunakan prefix `VITE_`
- Restart dev server setelah ubah `.env`

### API tidak merespons
- Verifikasi URL dan API key
- Cek dokumentasi API WhatsApp yang digunakan
- Pastikan sessionId valid

## Lisensi

MIT
