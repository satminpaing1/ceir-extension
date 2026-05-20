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

  // Model Name တူရင် IMEI တွေကို Group ဖွဲ့မည့် Logic
  const groupedResults = useMemo(() => {
    const groups: { id: string; items: ImeiCheckResult[]; deviceInfo: any }[] = [];
    const modelMap = new Map<string, number>();

    for (const r of results) {
      if (r.deviceInfo && r.deviceInfo.gsmaModelName) {
        const key = r.deviceInfo.gsmaModelName;
        if (modelMap.has(key)) {
          const index = modelMap.get(key)!;
          groups[index].items.push(r);
        } else {
          groups.push({ id: key, items: [r], deviceInfo: r.deviceInfo });
          modelMap.set(key, groups.length - 1);
        }
      } else {
        // Device Info မရှိရင် သီးသန့်စီ ခွဲထားမယ်
        groups.push({ id: r.IMEI, items: [r], deviceInfo: null });
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
            {/* Copy All */}
            <CopyButton
              onCopy={copyAll}
              title="Copy all results"
              className="rounded-none! p-2! transition-colors hover:bg-gray-50"
            />

            {/* Expand / Collapse All */}
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
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
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
