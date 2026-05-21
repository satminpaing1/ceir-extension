import { useState, useCallback, useEffect, useRef } from 'react';
import { fetchAndSolveAltcha, FetchError, type AltchaSolution } from '@/utils/altcha';
import { verifyImeis, fetchDeviceInfo } from '@/utils/ceir-api'; 
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

    // အရေးကြီးဆုံး ပြင်ဆင်ချက်: စစ်ဆေးတိုင်း Token အသစ် အရင်တောင်းမည် (Single-use ဖြစ်သောကြောင့်)
    let solution = await solveCaptcha(); 
    if (!solution) {
        // Token မရခဲ့လျှင် Error ပြပြီး ရပ်မည်
        setAppError({ message: "Security Token ရယူ၍ မရပါ။", kind: 'captcha' });
        return; 
    }

    setIsChecking(true);
    setAppError(null);
    setResults([]);

    try {
      const data = await verifyImeis(imeis, solution);
      
      const enrichedResults = await Promise.all(
        data.IMEI_CHECK_LIST.map(async (item) => {
          try {
            const deviceInfo = await fetchDeviceInfo(item.IMEI, solution!);
            return { ...item, deviceInfo };
          } catch {
            return item; 
          }
        })
      );
      
      setResults(enrichedResults);
    } catch (err: unknown) {
      // 412 (Precondition Failed) သို့မဟုတ် 500 (Internal Server Error) နှစ်ခုလုံးကို ဖမ်းမည်
      const isTokenError = err instanceof FetchError && (err.status === 412 || err.status === 500);
      
      if (isTokenError) {
        try {
          // နောက်တစ်ကြိမ် ထပ်ကြိုးစားကြည့်မည်
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
    // Component စတက်ချိန်တွင်လည်း ကြိုပြီး Token တစ်ခါ တောင်းထားမည်
    solveCaptcha();
  }, [solveCaptcha]);

  const canCheck = !isCaptchaSolving && !appError && !isChecking && parseImeis(imeiText).length > 0;

  return { imeiText, setImeiText, isCaptchaSolving, isChecking, results, appError, canCheck, handleCheck, handleRetry };
}
