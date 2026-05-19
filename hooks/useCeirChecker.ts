import { useState, useCallback, useEffect, useRef } from 'react';
import { fetchAndSolveAltcha, FetchError, type AltchaSolution } from '@/utils/altcha';
import { verifyImeis, fetchDeviceInfo } from '@/utils/ceir-api'; // fetchDeviceInfo ကိုပါ import လုပ်ပါ
import type { ImeiCheckResult } from '@/utils/types';

const DRAFT_KEY = 'ceir_imei_draft';

export type AppErrorKind = 'captcha' | 'captcha-403' | 'check';

export interface AppError {
  message: string;
  kind: AppErrorKind;
}

function parseImeis(text: string): string[] {
  return text.split('\n').map((l) => l.trim()).filter(Boolean);
}

export function useCeirChecker() {
  const [imeiText, setImeiText] = useState('');
  const [isCaptchaSolving, setIsCaptchaSolving] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [results, setResults] = useState<ImeiCheckResult[]>([]);
  const [appError, setAppError] = useState<AppError | null>(null);

  const solutionRef = useRef<AltchaSolution | null>(null);

  const solveCaptcha = useCallback(async (): Promise<AltchaSolution | null> => {
    setIsCaptchaSolving(true);
    setAppError(null);
    solutionRef.current = null;
    try {
      const solution = await fetchAndSolveAltcha();
      solutionRef.current = solution;
      setIsCaptchaSolving(false);
      return solution;
    } catch (err: unknown) {
      const is403 = err instanceof FetchError && err.status === 403;
      setAppError({ message: err instanceof Error ? err.message : String(err), kind: is403 ? 'captcha-403' : 'captcha' });
      setIsCaptchaSolving(false);
      return null;
    }
  }, []);

  const handleCheck = useCallback(async () => {
    const imeis = parseImeis(imeiText);
    if (imeis.length === 0) return;

    let solution = solutionRef.current;
    if (!solution) return;

    setIsChecking(true);
    setAppError(null);
    setResults([]);

    try {
      const data = await verifyImeis(imeis, solution);
      
      // API ကရလာတဲ့ IMEI တွေကို Loop ပတ်ပြီး Device Info တွဲယူမယ်
      const enrichedResults = await Promise.all(
        data.IMEI_CHECK_LIST.map(async (item) => {
          try {
            // အစ်ကို့ API က device info ကို ဒီ function နဲ့ ယူရတာပါ
            const deviceInfo = await fetchDeviceInfo(item.IMEI, solution!);
            return { ...item, deviceInfo };
          } catch {
            return item; // Info မရရင်လည်း ရသလောက်ပဲပြမယ်
          }
        })
      );
      
      setResults(enrichedResults);
    } catch (err: unknown) {
      if (err instanceof FetchError && err.status === 412) {
        try {
          solution = await solveCaptcha();
          if (!solution) throw new Error('Failed to re-solve captcha.');
          const data = await verifyImeis(imeis, solution);
          const enriched = await Promise.all(
             data.IMEI_CHECK_LIST.map(async (item) => {
               const deviceInfo = await fetchDeviceInfo(item.IMEI, solution!).catch(() => null);
               return { ...item, deviceInfo };
             })
          );
          setResults(enriched);
        } catch (retryErr) {
          setAppError({ message: retryErr instanceof Error ? retryErr.message : String(retryErr), kind: 'check' });
        }
      } else {
        setAppError({ message: err instanceof Error ? err.message : String(err), kind: 'check' });
      }
    } finally {
      setIsChecking(false);
    }
  }, [imeiText, solveCaptcha]);

  // ... (handleRetry နဲ့ ကျန်တဲ့ code တွေက မူရင်းအတိုင်းထားပါ)
  const handleRetry = useCallback(() => {
    if (!appError) return;
    switch (appError.kind) {
      case 'captcha-403':
        localStorage.setItem(DRAFT_KEY, imeiText);
        window.location.reload();
        break;
      case 'captcha': solveCaptcha(); break;
      case 'check': handleCheck(); break;
    }
  }, [appError, imeiText, solveCaptcha, handleCheck]);

  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) { setImeiText(draft); localStorage.removeItem(DRAFT_KEY); }
    solveCaptcha();
  }, [solveCaptcha]);

  const canCheck = !isCaptchaSolving && !appError && !isChecking && parseImeis(imeiText).length > 0;

  return { imeiText, setImeiText, isCaptchaSolving, isChecking, results, appError, canCheck, handleCheck, handleRetry };
}
