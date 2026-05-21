import { useState, useCallback, useMemo } from 'react';
import ResultCard from '@/components/ResultCard';
import CopyButton from '@/components/CopyButton';
import { formatAllResultsForClipboard } from '@/utils/copy-format';
import type { ImeiCheckResult } from '@/utils/types';

interface ResultsSectionProps {
  results: ImeiCheckResult[];
}

export default function ResultsSection({ results }: ResultsSectionProps) {
  const [deviceInfoOpen, setDeviceInfoOpen] = useState<Record<string, boolean>>({});
  const [allExpanded, setAllExpanded] = useState(false);

  // ပိုမိုစမတ်ကျသော Grouping Logic
  const groupedResults = useMemo(() => {
    const groups: { id: string; items: ImeiCheckResult[]; deviceInfo: any }[] = [];

    for (const r of results) {
      const lastGroup = groups.length > 0 ? groups[groups.length - 1] : null;

      // ဖုန်းမော်ဒယ်တူပြီး၊ ကတ်အရေအတွက် (simSlots သို့မဟုတ် အများဆုံး ၂ ကတ်) မပြည့်သေးမှသာ ပေါင်းထည့်မည်
      const maxSims = lastGroup?.deviceInfo?.simSlots > 0 ? lastGroup.deviceInfo.simSlots : 2;
      
      const canGroup =
        lastGroup &&
        lastGroup.deviceInfo &&
        r.deviceInfo &&
        lastGroup.deviceInfo.gsmaModelName === r.deviceInfo.gsmaModelName &&
        lastGroup.items.length < maxSims;

      if (canGroup) {
        // ဖုန်းတစ်လုံးတည်းဟု ယူဆပြီး အုပ်စုတွင်း ပေါင်းထည့်သည်
        lastGroup.items.push(r);
      } else {
        // ဖုန်းနောက်တစ်လုံးဖြစ်သွားပြီမို့ အုပ်စုအသစ်တစ်ခု ဖန်တီးသည်
        groups.push({ id: r.IMEI, items: [r], deviceInfo: r.deviceInfo });
      }
    }
    return groups;
  }, [results]);

  const toggleDeviceInfo = useCallback((id: string) => {
    setDeviceInfoOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const toggleAll = useCallback(() => {
    const next = !allExpanded;
    setAllExpanded(next);
    const map: Record<string, boolean> = {};
    for (const g of groupedResults) {
      if (g.deviceInfo) map[g.id] = next;
    }
    setDeviceInfoOpen(map);
  }, [allExpanded, groupedResults]);

  const copyAll = useCallback(async () => {
    await navigator.clipboard.writeText(formatAllResultsForClipboard(results));
  }, [results]);

  if (results.length === 0) return null;

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          စစ်ဆေးမှု ရလာဒ်များ
        </h2>
        {groupedResults.some((g) => g.deviceInfo) && (
          <div className="flex items-stretch overflow-hidden rounded-md border border-gray-300 bg-white divide-x divide-gray-300">
            <CopyButton
              onCopy={copyAll}
              title="Copy all results"
              className="rounded-none! p-2! transition-colors hover:bg-gray-50"
            />
            <button
              type="button"
              onClick={toggleAll}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 focus:outline-none"
            >
              {allExpanded ? (
                <>
                  <svg className="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z" clipRule="evenodd" />
                  </svg>
                  Collapse All
                </>
              ) : (
                <>
                  <svg className="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                  Expand All
                </>
              )}
            </button>
          </div>
        )}
      </div>
      
      {/* ၂ ကော်လံ Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {groupedResults.map((group) => (
          <ResultCard
            key={group.id}
            group={group}
            isDeviceInfoOpen={!!deviceInfoOpen[group.id]}
            onToggleDeviceInfo={() => toggleDeviceInfo(group.id)}
          />
        ))}
      </div>
    </section>
  );
}
