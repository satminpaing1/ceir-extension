import type { ImeiCheckResult } from '@/utils/types';
import { formatResultForClipboard } from '@/utils/copy-format';
import StatusBadge from './StatusBadge';
import DeviceInfoCard from './DeviceInfoCard';
import CopyButton from './CopyButton';

interface ResultCardProps {
  result: ImeiCheckResult;
}

export default function ResultCard({ result }: ResultCardProps) {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(formatResultForClipboard(result));
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="p-4 sm:p-5">
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

        <dl className="space-y-3">
          <div className="flex items-center justify-between">
            <dt className="text-sm text-gray-500">အခွန်ဆောင်ပြီးစီးမှု အခြေအနေ</dt>
            <dd>
              <StatusBadge 
                label={result.paymentState === 'PAID' ? 'ဆောင်ပြီး' : result.paymentState === 'UNPAID' ? 'မဆောင်ရသေး' : 'မသိရ'} 
                variant={result.paymentState === 'PAID' ? 'success' : 'danger'} 
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

          {result.endOfGracePeriod && (
            <div className="flex items-center justify-between border-t pt-2">
              <dt className="text-sm text-red-600 font-bold">ပိတ်ပင်မည့်ရက်</dt>
              <dd className="text-sm font-bold text-red-600">
                {new Date(result.endOfGracePeriod).toLocaleDateString()}
              </dd>
            </div>
          )}
        </dl>

        {result.deviceInfo && (
          <div className="mt-4">
            <DeviceInfoCard deviceInfo={result.deviceInfo} isOpen={true} />
          </div>
        )}
      </div>
    </div>
  );
}
