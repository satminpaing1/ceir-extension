// ဒီစာသားက အစ်ကို့ရဲ့ Master Password ပါ။
const SECRET_SALT = "SMP_TECH_2026_PRO";

export function generateDeviceId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < 8; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `SMP-${id.slice(0, 4)}-${id.slice(4, 8)}`;
}

export function calculateExpectedKey(deviceId: string): string {
  // Device ID ကို ပြောင်းပြန်လှန်ခြင်းဖြင့် Key များကို လုံးဝ ကွဲပြားသွားစေပါသည်
  const reversedId = deviceId.split('').reverse().join('');
  const combined = `${reversedId}_${SECRET_SALT}`;
  const encoded = btoa(combined).replace(/=/g, '').toUpperCase();
  
  // ရှေ့ဆုံးမှ ၁၂ လုံးကို ယူမည်
  const rawKey = encoded.slice(0, 12).padEnd(12, 'X');
  return `${rawKey.slice(0, 4)}-${rawKey.slice(4, 8)}-${rawKey.slice(8, 12)}`;
}

export function verifyLicenseKey(deviceId: string, inputKey: string): boolean {
  const expectedKey = calculateExpectedKey(deviceId);
  return inputKey.trim().toUpperCase() === expectedKey;
}
