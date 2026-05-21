import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorCard from '@/components/ErrorCard';
import ResultsSection from '@/components/ResultsSection';
import GitHubBanner from '@/components/GitHubBanner';
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

  return (
    <div className="min-h-screen bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-indigo-50 via-slate-50 to-cyan-50">
      
      {/* Top Navigation Bar Style */}
      <div className="sticky top-0 z-10 border-b border-white/40 bg-white/60 px-4 py-4 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-indigo-200">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900">
                CEIR <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">SMP TECH</span>
              </h1>
              <p className="text-xs font-medium text-slate-500">Advanced IMEI Verification Tool</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ── Bulk Checker Panel ── */}
        <div className="mb-10 rounded-2xl border border-white/60 bg-white/70 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl sm:p-8 lg:w-2/3 lg:mx-auto relative overflow-hidden">
          {/* Decorative Background Blob */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-400/10 blur-3xl"></div>
          
          <div className="relative">
            <label htmlFor="imei-input" className="mb-3 flex items-center justify-between text-sm font-semibold text-slate-700">
              <span>ထည့်သွင်းရန် IMEI နံပါတ်များ</span>
              <code className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-500">*#06#</code>
            </label>
            <textarea
              id="imei-input"
              rows={5}
              placeholder={"123xxxxxxxxx456\n789xxxxxxxxx123"}
              value={imeiText}
              onChange={(e) => setImeiText(e.target.value)}
              className="block w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none"
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
                className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] hover:shadow-indigo-600/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
              >
                စစ်ဆေးမည်
              </button>
            </div>
          </div>
        </div>

        {/* ── Error ── */}
        {appError && (
          <div className="mb-8 lg:w-2/3 lg:mx-auto">
            <ErrorCard message={appError.message} onRetry={handleRetry} />
          </div>
        )}

        {/* ── Results ── */}
        <ResultsSection results={results} />
      </div>
    </div>
  );
}

export default CeirApp;
