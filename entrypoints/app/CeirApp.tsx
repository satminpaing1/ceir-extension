import { useState } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorCard from '@/components/ErrorCard';
import ResultsSection from '@/components/ResultsSection';
import { useCeirChecker } from '@/hooks/useCeirChecker';

function CeirApp() {
  const {
    imeiText,
    setImeiText,
    isCaptchaSolving,
    isChecking,
    results,
    appError,
    canCheck,
    handleCheck,
    handleRetry,
  } = useCeirChecker();

  // Dark Mode State 
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    {/* ဤနေရာတွင် dark class ကို တိုက်ရိုက် ထည့်သွင်းထားပါသည် */}
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-indigo-50 via-slate-50 to-cyan-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
        
        {/* Top Navigation Bar Style */}
        <div className="sticky top-0 z-10 border-b border-white/40 bg-white/60 dark:border-slate-700/40 dark:bg-slate-900/60 px-4 py-4 backdrop-blur-md shadow-sm transition-colors duration-300">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                  CEIR <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">SMP TECH</span>
                </h1>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Advanced IMEI Verification Tool</p>
              </div>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="rounded-full p-2.5 text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700 transition-all focus:outline-none"
              title="Toggle Dark Mode"
            >
              {isDarkMode ? (
                <svg className="h-5 w-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 4.22a1 1 0 011.415 0l.708.708a1 1 0 01-1.414 1.414l-.708-.708a1 1 0 010-1.414zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM14.22 15.636a1 1 0 01-1.414 1.414l-.708-.708a1 1 0 011.414-1.414l.708.708zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-4.22-1.414a1 1 0 011.414 1.414l-.708.708a1 1 0 01-1.414-1.414l.708-.708zM2 10a1 1 0 011-1h1a1 1 0 110 2H3a1 1 0 01-1-1zm1.414-4.22a1 1 0 010-1.414l.708-.708a1 1 0 011.414 1.414l-.708.708a1 1 0 01-1.414 0zM10 5a5 5 0 100 10 5 5 0 000-10z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* ── Bulk Checker Panel ── */}
          <div className="mb-10 rounded-2xl border border-white/60 bg-white/70 dark:border-slate-700/60 dark:bg-slate-800/70 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-slate-900/50 backdrop-blur-xl sm:p-8 lg:w-2/3 lg:mx-auto relative overflow-hidden transition-colors duration-300">
            
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-400/10 dark:bg-blue-400/5 blur-3xl"></div>
            
            <div className="relative">
              <h2 className="mb-2 text-center text-xl font-extrabold text-slate-800 dark:text-slate-100">
                CEIR Checker
              </h2>

              <label htmlFor="imei-input" className="mb-4 flex items-center justify-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <span>IMEI များကို တစ်ကြောင်းချင်းစီ ထည့်သွင်း စစ်ဆေးနိုင်ပါသည်။</span>
                <code className="rounded-md bg-slate-100 dark:bg-slate-700 px-2 py-1 text-xs text-slate-500 dark:text-slate-300">*#06#</code>
              </label>

              <textarea
                id="imei-input"
                rows={5}
                placeholder={"123xxxxxxxxx456\n789xxxxxxxxx123"}
                value={imeiText}
                onChange={(e) => setImeiText(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white/50 dark:bg-slate-900/50 px-4 py-3 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-indigo-500/10 outline-none"
              />

              <div className="mt-5 flex items-center justify-between">
                {isCaptchaSolving ? (
                  <LoadingSpinner text="Security Check ပြုလုပ်နေသည်..." />
                ) : isChecking ? (
                  <LoadingSpinner text="Data ဆွဲယူနေသည်..." />
                ) : (
                  <div />
                )}

                <button
                  type="button"
                  disabled={!canCheck}
                  onClick={handleCheck}
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 dark:shadow-indigo-900/40 transition-all hover:scale-[1.02] hover:shadow-indigo-600/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                >
                  စစ်ဆေးမည်
                </button>
              </div>
            </div>
          </div>

          {appError && (
            <div className="mb-8 lg:w-2/3 lg:mx-auto">
              <ErrorCard message={appError.message} onRetry={handleRetry} />
            </div>
          )}

          <ResultsSection results={results} />
        </div>
      </div>
    </div>
  );
}

export default CeirApp;
