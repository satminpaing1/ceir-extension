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
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="p-4 sm:p-5">
        
        {group.items.map((result, index) => {
          const isInvalid = 
            result.WrongFormat || 
            result.Incorrect || 
            !result.IMEI || 
            result.IMEI.length < 14 || 
            !/^\d+$/.test(result.IMEI);

          return (
            <div key={result.IMEI} className={index > 0 ? "mt-6 border-t pt-6" : ""}>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CopyButton 
                    onCopy={async () => navigator.clipboard.writeText(formatResultForClipboard(result))} 
                    title="Copy result" 
                  />
                  <h3 className="font-mono text-sm font-semibold text-gray-900">
                    {group.items.length > 1 && (
                      <span className="text-gray-500 mr-1.5">IMEI {index + 1} :</span>
                    )}
                    {result.IMEI}
                  </h3>
                </div>
                <StatusBadge
                  label={isInvalid ? 'IMEI မှားယွင်းသည်' : 'IMEI မှန်ကန်သည်'}
                  variant={isInvalid ? 'danger' : 'success'}
                />
              </div>

              <dl className="space-y-3">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-500">အခွန်ဆောင်ပြီးစီးမှု အခြေအနေ</dt>
                  <dd>
                    <StatusBadge
                      label={getPaymentStateLabel(result.paymentState, isInvalid)}
                      variant={getPaymentStateVariant(result.paymentState, isInvalid)}
                    />
                  </dd>
                </div>

                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-500">ကွန်ရက်တွင် ချိတ်ဆက်ခွင့်</dt>
                  <dd>
                    <StatusBadge
                      label={isInvalid ? 'မသိရ' : (result.blockState === 'BLOCKED' ? 'ခွင့်မပြုပါ' : 'ခွင့်ပြုသည်')}
                      variant={isInvalid ? 'neutral' : (result.blockState === 'BLOCKED' ? 'danger' : 'success')}
                    />
                  </dd>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-2">
                  <dt className="text-sm text-gray-500">ပိတ်ပင်မည့်ရက် / မှတ်ချက်</dt>
                  <dd className={`text-sm font-semibold ${result.endOfGracePeriod ? 'text-red-600 font-bold' : (isInvalid ? 'text-gray-500' : 'text-emerald-600')}`}>
                    {result.endOfGracePeriod 
                      ? formatDate(result.endOfGracePeriod) 
                      : (isInvalid ? "-" : "၄ လပိုင်းအရှေ့ပိုင်းက စာရင်းသွင်းထားသောဖုန်း")}
                  </dd>
                </div>

                {result.networkDate && !isInvalid ? (
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-gray-500">စာရင်းသွင်းထားသောရက်</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {formatDate(result.networkDate)}
                    </dd>
                  </div>
                ) : null}
              </dl>
            </div>
          );
        })}

        {isMixedPayment && (
          <div className="mt-5 rounded-md bg-amber-50 p-4 border border-amber-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-amber-800">သတိပြုရန်</h3>
                <div className="mt-1 text-sm text-amber-700">
                  <p>ဤဖုန်း၏ IMEI တစ်ခုမှာ အခွန်ဆောင်ရန် ကျန်ရှိနေသေးပါသည်။ ကွန်ရက်ပိတ်ပင်ခြင်း မခံရစေရန် ကျန်ရှိသော IMEI ကိုပါ အခွန်ဆောင်ရန် လိုအပ်ပါသည်။</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {group.deviceInfo ? (
          <div className="mt-5 border-t pt-4">
            <button 
              onClick={onToggleDeviceInfo}
              className="flex w-full items-center justify-between text-left focus:outline-none"
            >
              <span className="text-sm font-semibold text-gray-700">Device Info ပြ/ဖျောက်ရန် နှိပ်ပါ</span>
              <svg 
                className={`h-5 w-5 text-gray-500 transition-transform ${isDeviceInfoOpen ? 'rotate-180' : ''}`} 
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDeviceInfoOpen && (
              <div className="mt-3">
                <DeviceInfoCard 
                  deviceInfo={group.deviceInfo} 
                  isOpen={true} 
                  onToggle={() => {}} 
                />
              </div>
            )}
          </div>
        ) : null}

      </div>
    </div>
  );
}
