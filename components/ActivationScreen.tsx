import { useState } from 'react';
import { verifyLicenseKey } from '@/utils/license';

interface Props {
  deviceId: string;
  onSuccess: () => void;
}

export default function ActivationScreen({ deviceId, onSuccess }: Props) {
  const [inputKey, setInputKey] = useState('');
  const [error, setError] = useState(false);

  const handleActivate = () => {
    if (verifyLicenseKey(deviceId, inputKey)) {
      setError(false);
      onSuccess();
    } else {
      setError(true);
    }
  };

  const copyDeviceId = () => {
    navigator.clipboard.writeText(deviceId);
    alert('Device ID ကို Copy ကူးပြီးပါပြီ! Admin ထံသို့ ပို့ပေးပါ။');
  };

  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-white/60 bg-white/70 p-6 shadow-2xl backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-800/90 sm:p-10 transition-all">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50">
          <svg className="h-8 w-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Software Locked</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          ဤ Extension ကို အသုံးပြုရန် Activation Key လိုအပ်ပါသည်။ အောက်ပါ Device ID ကို Admin ထံသို့ ပို့ပေးပါ။
        </p>
      </div>

      <div className="mt-8 rounded-xl bg-slate-50 p-4 border border-slate-200 dark:bg-slate-900/50 dark:border-slate-700">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider dark:text-slate-400">Your Device ID</div>
        <div className="mt-2 flex items-center justify-between gap-3">
          <code className="text-lg font-mono font-bold text-indigo-600 dark:text-indigo-400 select-all">{deviceId}</code>
          <button onClick={copyDeviceId} className="rounded-lg bg-indigo-100 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50 transition-colors">
            Copy
          </button>
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Enter License Key</label>
        <input
          type="text"
          placeholder="XXXX-XXXX-XXXX"
          value={inputKey}
          onChange={(e) => setInputKey(e.target.value.toUpperCase())}
          className={`block w-full rounded-xl border ${error ? 'border-red-500 ring-red-500/20' : 'border-slate-300 dark:border-slate-600'} bg-white dark:bg-slate-900/50 px-4 py-3 font-mono text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:ring-4 transition-all`}
        />
        {error && <p className="mt-2 text-xs font-semibold text-red-500">Key မှားယွင်းနေပါသည်။ ကျေးဇူးပြု၍ ပြန်စစ်ဆေးပါ။</p>}
      </div>

      <button
        onClick={handleActivate}
        disabled={inputKey.length < 10}
        className="mt-6 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
      >
        Activate Now
      </button>
    </div>
  );
}
