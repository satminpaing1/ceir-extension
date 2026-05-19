// အစ်ကို့ရဲ့ ResultCard.tsx အတွက် သန့်စင်ပြီးသား Code
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
          <div className="flex items-center gap-1">
            <StatusBadge
              label={result.WrongFormat || result.Incorrect ? 'IMEI မှားယွင်းသည်' : 'IMEI မှန်ကန်သည်'}
              variant={result.WrongFormat || result.Incorrect ? 'danger' : 'success'}
            />
          </div>
        </div>

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
                label={result.blockState === null || result.blockState === 'BLOCKED' ? 'ခွင့်မပြုပါ' : 'ခွင့်ပြုသည်'}
                variant={result.blockState === null || result.blockState === 'BLOCKED' ? 'danger' : 'success'}
              />
            </dd>
          </div>

          <div className="flex items-center justify-between border-t pt-2">
            <dt className="text-sm text-red-600 font-bold">ပိတ်ပင်မည့်ရက်</dt>
            <dd className="text-sm font-bold text-red-600">
            {result.endOfGracePeriod ? formatDate(result.endOfGracePeriod) : "သတ်မှတ်ချက်မရှိ"}
         </dd>
         </div>
          )}

          {result.networkDate && (
            <div className="flex items-center justify-between">
              <dt className="text-sm text-gray-500">စာရင်းသွင်းထားသောရက်</dt>
              <dd className="text-sm font-medium text-gray-900">
                {formatDate(result.networkDate)}
              </dd>
            </div>
          )}
        </dl>

        {result.deviceInfo && (
          <div className="mt-4">
            <DeviceInfoCard 
              deviceInfo={result.deviceInfo} 
              isOpen={true} 
              onToggle={() => {}} 
            />
          </div>
        )}
      </div>
    </div>
  );
}
