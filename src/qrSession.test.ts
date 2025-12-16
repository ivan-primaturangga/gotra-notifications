import { QrSession } from './qrSession';

// Test sederhana untuk QrSession (mock fetch diperlukan untuk test real)
async function testQrSession() {
  const session = new QrSession({
    sessionId: 'dummy-session',
    apiUrl: 'https://dummy-api-url.com/api',
    apiKey: 'dummy-key',
  });

  try {
    // Biasanya di test, fetch perlu di-mock agar tidak benar-benar call API
    const { qrEndpoint } = await session.startSession();
    const qr = await session.loadQRCode(qrEndpoint);
    const status = await session.checkStatus();
    console.log('Test success:', { qrEndpoint, qr, status });
  } catch (err) {
    console.error('Test failed:', err);
  }
}

// Jalankan test jika file ini dieksekusi langsung
if (require.main === module) {
  testQrSession();
}
