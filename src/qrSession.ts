// src/qrSession.ts
// Modul reusable untuk scan QR code (bisa digunakan di JS/TS environment apa saja)

export interface QrSessionOptions {
  sessionId: string;
  apiUrl: string;
  apiKey: string;
}

export interface QrSessionResult {
  qr: string;
  qrEndpoint: string;
}

export interface QrSessionStatus {
  status: string;
  [key: string]: any;
}

/**
 * QrSession
 *
 * Modul untuk mengelola sesi scan QR code WhatsApp (start session, ambil QR, cek status).
 * Dapat digunakan di Node.js, browser, React, dsb.
 */
export class QrSession {
  private sessionId: string;
  private apiUrl: string;
  private apiKey: string;

  /**
   * @param options QrSessionOptions
   */
  constructor(options: QrSessionOptions) {
    this.sessionId = options.sessionId;
    this.apiUrl = options.apiUrl;
    this.apiKey = options.apiKey;
  }

  /**
   * Memulai sesi WhatsApp dan mendapatkan endpoint QR code.
   * @returns {Promise<QrSessionResult>} qrEndpoint (string endpoint untuk ambil QR code)
   * @throws Error jika gagal memulai sesi
   */
  async startSession(): Promise<QrSessionResult> {
    const res = await fetch(`${this.apiUrl}/auth/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
      },
      body: JSON.stringify({ sessionId: this.sessionId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to start session');
    return { qr: '', qrEndpoint: data.qrEndpoint };
  }

  /**
   * Mengambil string QR code dari endpoint yang diberikan.
   * @param qrEndpoint string endpoint hasil dari startSession
   * @returns {Promise<string>} string QR code
   * @throws Error jika gagal mengambil QR code
   */
  async loadQRCode(qrEndpoint: string): Promise<string> {
    // Remove trailing /api from apiUrl if present
    const cleanApiUrl = this.apiUrl.replace(/\/api$/, '');
    const fullUrl = `${cleanApiUrl}${qrEndpoint}`;
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'x-api-key': this.apiKey,
      },
    });
    const data = await response.json();
    if (!response.ok || !data.success || !data.qr) {
      throw new Error(data.message || 'Failed to load QR code');
    }
    return data.qr;
  }

  /**
   * Mengecek status sesi WhatsApp (apakah sudah scan/terautentikasi).
   * @returns {Promise<QrSessionStatus>} status session
   * @throws Error jika gagal cek status
   */
  async checkStatus(): Promise<QrSessionStatus> {
    const statusRes = await fetch(`${this.apiUrl}/auth/status/${this.sessionId}`, {
      method: 'GET',
      headers: {
        'x-api-key': this.apiKey,
      },
    });
    const statusData = await statusRes.json();
    if (!statusRes.ok) throw new Error(statusData.message || 'Failed to check status');
    return statusData;
  }
}

// Contoh penggunaan (bisa dihapus di production):
// const session = new QrSession({ sessionId, apiUrl, apiKey });
// const { qrEndpoint } = await session.startSession();
// const qrString = await session.loadQRCode(qrEndpoint);
// const status = await session.checkStatus();
