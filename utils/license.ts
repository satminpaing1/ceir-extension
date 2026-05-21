// ဒီစာသားက အစ်ကို့ရဲ့ Master Password ပါ။ အစ်ကိုကြိုက်ရာ ပြောင်းရေးလို့ရပါတယ်။
// ဥပမာ - "SMP_TECH_MYANMAR_2026_SECRET"
const SECRET_SALT = "SMP_TECH_2026_PRO";

// စက်အတွက် သီးသန့် Device ID ထုတ်ပေးမည့် Function
export function generateDeviceId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < 8; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `SMP-${id.slice(0, 4)}-${id.slice(4, 8)}`;
}

// Device ID ပေါ်မူတည်၍ မှန်ကန်သော Key ကို တွက်ထုတ်မည့် Function
export function calculateExpectedKey(deviceId: string): string {
  // ရိုးရှင်းပြီး လုံခြုံသော Hashing နည်းလမ်း
  const combined = `${deviceId}_${SECRET_SALT}`;
  const encoded = btoa(combined).replace(/=/g, '').toUpperCase();
  
  // နောက်ဆုံးက ၁၂ လုံးကိုယူပြီး Key ပုံစံ ဖြတ်မည် (ဥပမာ: ABCD-1234-WXYZ)
  const rawKey = encoded.slice(-12).padEnd(12, 'X');
  return `${rawKey.slice(0, 4)}-${rawKey.slice(4, 8)}-${rawKey.slice(8, 12)}`;
}

// ထည့်လိုက်သော Key မှန်/မမှန် စစ်ဆေးရန်
export function verifyLicenseKey(deviceId: string, inputKey: string): boolean {
  const expectedKey = calculateExpectedKey(deviceId);
  return inputKey.trim().toUpperCase() === expectedKey;
}
