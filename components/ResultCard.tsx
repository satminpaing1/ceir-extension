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
  if (state === 'AMNESTY') return 'ကန့်သတ်ချက်ဖြင့်ခွင့်ပြုထားသည့်ပစ္စည်း';
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
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm ring-1 ring-gray-900/5 transition-all hover:shadow-md">
      <div className="p-5 sm:p-6">
        
        {group.items.map((result, index) => {
          const isInvalid = 
            result.WrongFormat || 
            result.Incorrect || 
            !result.IMEI || 
            result.IMEI.length < 14 || 
            !/^\d+$/.test(result.IMEI);

          return (
            <div key={result.IMEI} className={index > 0 ? "mt-6 border-t border-gray-100 pt-6" : ""}>
              
              {/* Header (Clean Look) */}
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CopyButton 
                    onCopy={async () => navigator.clipboard.writeText(formatResultForClipboard(result))} 
                    title="Copy result" 
                  />
                  <h3 className="font-mono text-base font-semibold text-gray-900">
                    {group.items.length > 1 && (
                      <span className="mr-2 rounded bg-gray-100 px-2 py-0.5 text-xs font-sans tracking-wide text-gray-500">SIM {index + 1}</span>
                    )}
                    {result.IMEI}
                  </h3>
                </div>
                <StatusBadge
                  label={isInvalid ? 'IMEI မှားယွင်းသည်' : 'IMEI မှန်ကန်သည်'}
                  variant={isInvalid ? 'danger' : 'success'}
                />
              </div>

              {/* Data List (No inner borders, more space) */}
              <div className="grid grid-cols-1 gap-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">အခွန်ဆောင်ပြီးစီးမှု</span>
                  <StatusBadge
                    label={getPaymentStateLabel(result.paymentState, isInvalid)}
                    variant={getPaymentStateVariant(result.paymentState, isInvalid)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">ကွန်ရက်တွင် ချိတ်ဆက်ခွင့်</span>
                  <StatusBadge
                    label={isInvalid ? 'မသိရ' : (result.blockState === 'BLOCKED' ? 'ခွင့်မပြုပါ' : 'ခွင့်ပြုသည်')}
                    variant={isInvalid ? 'neutral' : (result.blockState === 'BLOCKED' ? 'danger' : 'success')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">ပိတ်ပင်မည့်ရက် / မှတ်ချက်</span>
                  <span className={`text-sm font-semibold ${result.endOfGracePeriod ? 'text-red-600 font-bold' : (isInvalid ? 'text-gray-500' : 'text-emerald-600')}`}>
                    {result.endOfGracePeriod 
                      ? formatDate(result.endOfGracePeriod) 
                      : (isInvalid ? "-" : "သက်မှတ်ထားချင်းမရှိပါ")}
                  </span>
                </div>

                {result.networkDate && !isInvalid && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">စာရင်းသွင်းထားသောရက်</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatDate(result.networkDate)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Warning Box (More subtle) */}
        {isMixedPayment && (
          <div className="mt-6 flex items-start gap-3 rounded-xl bg-amber-50 p-4 border border-amber-100">
            <svg className="h-5 w-5 flex-shrink-0 text-amber-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="text-sm text-amber-800 leading-relaxed">
              <span className="font-semibold block mb-1">သတိပြုရန်</span>
              IMEI တစ်ခုမှာ အခွန်ဆောင်ရန် ကျန်ရှိနေသေးပါသည်။ ကွန်ရက်ပိတ်ပင်ခြင်း မခံရစေရန် ကျန်ရှိသော IMEI ကိုပါ အခွန်ဆောင်ရန် လိုအပ်ပါသည်။
            </div>
          </div>
        )}
      </div>

      {/* Device Info (Moved to a neat footer area) */}
      {group.deviceInfo && (
        <div className="border-t border-gray-100 bg-gray-50/50">
          <button 
            onClick={onToggleDeviceInfo}
            className="flex w-full items-center justify-center gap-2 px-4 py-3.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none"
          >
            <span>Device Info ပြ/ဖျောက်ရန်</span>
            <svg 
              className={`h-4 w-4 text-gray-400 transition-transform ${isDeviceInfoOpen ? 'rotate-180' : ''}`} 
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isDeviceInfoOpen && (
            <div className="px-5 pb-5 pt-2">
              <DeviceInfoCard 
                deviceInfo={group.deviceInfo} 
                isOpen={true} 
                onToggle={() => {}} 
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
