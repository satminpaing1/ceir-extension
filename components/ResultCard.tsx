import type { ImeiCheckResult } from '@/utils/types';
import { formatResultForClipboard } from '@/utils/copy-format';
import StatusBadge from './StatusBadge';
import DeviceInfoCard from './DeviceInfoCard';
import CopyButton from './CopyButton';

interface ResultCardProps {
  result: ImeiCheckResult;
}

function getPaymentStateLabel(state: string) {
  if (state === 'PAID' || state === 'ACCUMULATION') return 'ဆောင်ပြီး';
  if (state === 'UNPAID') return 'မဆောင်ရသေး';
  if (state === 'AMNESTY') return 'ကန့်သတ်ချက်ဖြင့်ခွင့်ပြုထားသည့်ပစ္စည်း';
  return 'မသိရ';
}

function getPaymentStateVariant(state: string) {
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

export default function ResultCard({ result }: ResultCardProps) {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(formatResultForClipboard(result));
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="p-4 sm:p-5">
        
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <CopyButton onCopy={handleCopy} title="Copy result" />
            <h3 className="font-mono text-sm font-semibold text-gray-900">{result.IMEI}</h3>
          </div>
          <StatusBadge
            label={result.WrongFormat || result.Incorrect ? 'IMEI မှားယွင်းသည်' : 'IMEI မှန်ကန်သည်'}
            variant={result.WrongFormat || result.Incorrect ? 'danger' : 'success'}
          />
        </div>

        {/* Info List */}
        <dl className="space-y-3">
          <div className="flex items-center justify-between">
            <dt className="text-sm text-gray-500">အခွန်ဆောင်ပြီးစီးမှု အခြေအနေ</dt>
            <dd>
              <StatusBadge
                label={getPaymentStateLabel(result.paymentState)}
                variant={getPaymentStateVariant(result.paymentState)}
              />
            </dd>
          </div>

          <div className="flex items-center justify-between">
            <dt className="text-sm text-gray-500">ကွန်ရက်တွင် ချိတ်ဆက်ခွင့်</dt>
            <dd>
              <StatusBadge
                label={result.blockState === 'BLOCKED' ? 'ခွင့်မပြုပါ' : 'ခွင့်ပြုသည်'}
                variant={result.blockState === 'BLOCKED' ? 'danger' : 'success'}
              />
            </dd>
          </div>

          {/* ပိတ်ပင်မည့်ရက် သို့မဟုတ် မှတ်ချက် */}
          <div className="flex items-center justify-between border-t pt-2">
            <dt className="text-sm text-gray-500">ပိတ်ပင်မည့်ရက် / မှတ်ချက်</dt>
            <dd className={`text-sm font-semibold ${result.endOfGracePeriod ? 'text-red-600 font-bold' : 'text-emerald-600'}`}>
              {result.endOfGracePeriod 
                ? formatDate(result.endOfGracePeriod) 
                : "၄ လပိုင်းအရှေ့ပိုင်းက စာရင်းသွင်းထားသောဖုန်း"}
            </dd>
          </div>

          {/* စာရင်းသွင်းထားသောရက် */}
          {result.networkDate ? (
            <div className="flex items-center justify-between">
              <dt className="text-sm text-gray-500">စာရင်းသွင်းထားသောရက်</dt>
              <dd className="text-sm font-medium text-gray-900">
                {formatDate(result.networkDate)}
              </dd>
            </div>
          ) : null}
        </dl>

        {/* Device Info */}
        {result.deviceInfo ? (
          <div className="mt-4">
            <DeviceInfoCard 
              deviceInfo={result.deviceInfo} 
              isOpen={true} 
              onToggle={() => {}} 
            />
          </div>
        ) : null}

      </div>
    </div>
  );
}
