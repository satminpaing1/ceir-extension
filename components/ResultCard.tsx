import type { ImeiCheckResult, DeviceInfo } from '@/utils/types';
import { formatResultForClipboard } from '@/utils/copy-format';
import StatusBadge from './StatusBadge';
import DeviceInfoCard from './DeviceInfoCard';
import CopyButton from './CopyButton';

interface GroupedResult {
  id: string;
  items: ImeiCheckResult[];
  deviceInfo: DeviceInfo | null;
}

interface ResultCardProps {
  group: GroupedResult;
  isDeviceInfoOpen: boolean;
  onToggleDeviceInfo: () => void;
}

function getPaymentStateLabel(state: string, isInvalid: boolean) {
  if (isInvalid) return 'မသိရ';
  if (state === 'PAID' || state === 'ACCUMULATION') return 'ဆောင်ပြီး';
  if (state === 'UNPAID') return 'မဆောင်ရသေး';
  if (state === 'AMNESTY') return 'ကန့်သတ်ချက်ဖြင့်ခွင့်ပြုထား';
  return 'မသိရ';
}

function getPaymentStateVariant(state: string, isInvalid: boolean) {
  if (isInvalid) return 'neutral' as const;
  if (state === 'PAID' || state === 'ACCUMULATION') return 'success' as const;
  if (state === 'UNPAID') return 'danger' as const;
  if (state === 'AMNESTY') return 'warning' as const;
  return 'neutral' as const;
}

function formatDate(dateStr: string): string {
  try { 
    return new Date(dateStr).toLocaleDateString(); 
  } catch { 
    return dateStr; 
  }
}

export default function ResultCard({ group, isDeviceInfoOpen, onToggleDeviceInfo }: ResultCardProps) {
  const hasPaid = group.items.some(r => r.paymentState === 'PAID' || r.paymentState === 'ACCUMULATION');
  const hasUnpaid = group.items.some(r => r.paymentState === 'UNPAID');
  const isMixedPayment = hasPaid && hasUnpaid;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700/50 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
      
      <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

      <div className="p-5 sm:p-6">
        {group.items.map((result, index) => {
          const isInvalid = 
            result.WrongFormat || 
            result.Incorrect || 
            !result.IMEI || 
            result.IMEI.length < 14 || 
            !/^\d+$/.test(result.IMEI);

          return (
            <div key={result.IMEI} className={index > 0 ? "mt-6 border-t border-dashed border-slate-200 dark:border-slate-700 pt-6" : ""}>
              
              {/* IMEI Header */}
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {group.items.length > 1 && (
                    <div className="flex h-7 px-2.5 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-[11px] font-bold text-indigo-700 dark:text-indigo-300 tracking-wide border border-indigo-100 dark:border-indigo-800/50">
                      SIM {index + 1}
                    </div>
                  )}
                  <h3 className="font-mono text-lg font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
                    {result.IMEI}
                  </h3>
                  <CopyButton 
                    onCopy={async () => navigator.clipboard.writeText(formatResultForClipboard(result))} 
                    title="Copy result" 
                  />
                </div>
                <StatusBadge
                  label={isInvalid ? 'Invalid' : 'Valid'}
                  variant={isInvalid ? 'danger' : 'success'}
                />
              </div>

              {/* Data Dashboard Widgets */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="rounded-xl bg-slate-50/80 dark:bg-slate-700/30 p-3.5 border border-slate-100 dark:border-slate-700">
                  <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">အခွန်ဆောင်ပြီးစီးမှု</div>
                  <StatusBadge
                    label={getPaymentStateLabel(result.paymentState, isInvalid)}
                    variant={getPaymentStateVariant(result.paymentState, isInvalid)}
                  />
                </div>

                <div className="rounded-xl bg-slate-50/80 dark:bg-slate-700/30 p-3.5 border border-slate-100 dark:border-slate-700">
                  <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">ကွန်ရက်ချိတ်ဆက်ခွင့်</div>
                  <StatusBadge
                    label={isInvalid ? 'မသိရ' : (result.blockState === 'BLOCKED' ? 'ခွင့်မပြုပါ' : 'ခွင့်ပြုသည်')}
                    variant={isInvalid ? 'neutral' : (result.blockState === 'BLOCKED' ? 'danger' : 'success')}
                  />
                </div>
              </div>

              {/* Date Footer Box */}
              <div className="flex items-center justify-between rounded-xl bg-slate-50/80 dark:bg-slate-700/30 p-3.5 border border-slate-100 dark:border-slate-700">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">ပိတ်ပင်မည့်ရက် / မှတ်ချက်</span>
                <span className={`text-sm font-bold ${result.endOfGracePeriod ? 'text-red-500 dark:text-red-400' : (isInvalid ? 'text-slate-400' : 'text-emerald-500 dark:text-emerald-400')}`}>
                  {result.endOfGracePeriod 
                    ? formatDate(result.endOfGracePeriod) 
                    : (isInvalid ? "-" : "သက်မှတ်ထားချင်းမရှိပါ။")}
                </span>
              </div>
            </div>
          );
        })}

        {isMixedPayment && (
          <div className="mt-5 flex items-start gap-3 rounded-xl bg-amber-50/80 dark:bg-amber-900/20 p-4 border border-amber-200/60 dark:border-amber-800/40">
            <svg className="h-5 w-5 flex-shrink-0 text-amber-500 dark:text-amber-400 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="text-xs text-amber-800 dark:text-amber-200/80 leading-relaxed font-medium">
              IMEI တစ်ခုမှာ အခွန်ဆောင်ရန် ကျန်ရှိနေသေးပါသည်။ ကွန်ရက်ပိတ်ပင်ခြင်း မခံရစေရန် ကျန်ရှိသော IMEI ကိုပါ အခွန်ဆောင်ရန် လိုအပ်ပါသည်။
            </div>
          </div>
        )}
      </div>

      {group.deviceInfo && (
        <div className="border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30">
          <button 
            onClick={onToggleDeviceInfo}
            className="flex w-full items-center justify-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none"
          >
            <span>{isDeviceInfoOpen ? 'Hide Device Info' : 'Show Device Info'}</span>
            <svg 
              className={`h-4 w-4 transition-transform duration-300 ${isDeviceInfoOpen ? 'rotate-180 text-indigo-600 dark:text-indigo-400' : ''}`} 
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div className={`transition-all duration-300 ease-in-out ${isDeviceInfoOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            <div className="px-5 pb-5 pt-1">
              <DeviceInfoCard 
                deviceInfo={group.deviceInfo} 
                isOpen={true} 
                onToggle={() => {}} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
