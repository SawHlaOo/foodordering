import type { MaintenanceSettings } from '../contexts/MaintenanceContext';

export const MaintenancePage = ({
  settings,
  onRetry
}: {
  settings: MaintenanceSettings;
  onRetry?: () => void;
}) => {
  const expectedBack = settings.maintenanceUntil
    ? new Intl.DateTimeFormat(undefined, { dateStyle: 'long', timeStyle: 'short' }).format(new Date(settings.maintenanceUntil))
    : null;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f5f4ef] px-4 py-10 text-slate-900 sm:px-8">
      <div className="pointer-events-none absolute left-0 top-0 h-96 w-96 -translate-x-1/3 -translate-y-1/3 rounded-full bg-emerald-100/70 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[32rem] w-[32rem] translate-x-1/3 translate-y-1/3 rounded-full bg-amber-100/70 blur-3xl" />

      <section className="relative grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/80 bg-white shadow-[0_32px_100px_-48px_rgba(25,45,36,0.35)] lg:min-h-[620px] lg:grid-cols-[1fr_0.9fr]">
        <div className="flex flex-col justify-center px-6 py-10 sm:px-12 sm:py-14 lg:px-16">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#315b48] text-white shadow-lg shadow-emerald-950/15" aria-hidden="true">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 3v6a4 4 0 0 0 8 0V3M12 13v8m-3 0h6M6 3v3m12-3v3" />
              </svg>
            </span>
            <span className="text-lg font-extrabold tracking-tight">Your Choice</span>
          </div>

          <div className="mt-12 inline-flex w-fit items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.12em] text-amber-900 sm:mt-16">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-50" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-500" />
            </span>
            A little refresh in progress
          </div>

          <h1 className="mt-6 max-w-xl text-4xl font-black leading-[1.08] tracking-tight text-[#20372d] sm:text-5xl lg:text-[3.5rem]">
            {settings.maintenanceTitle}
          </h1>
          <p className="mt-6 max-w-lg whitespace-pre-line text-base leading-8 text-slate-600 sm:text-lg">
            {settings.maintenanceMessage}
          </p>

          {expectedBack && (
            <div className="mt-8 flex max-w-lg items-start gap-4 rounded-2xl border border-emerald-100 bg-[#f4f8f4] p-4 sm:p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#315b48] shadow-sm" aria-hidden="true">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="9" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2" />
                </svg>
              </span>
              <span className="pt-0.5">
                <span className="block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Our estimated return</span>
                <time className="mt-1 block text-sm font-bold leading-6 text-[#20372d] sm:text-base" dateTime={settings.maintenanceUntil!}>{expectedBack}</time>
              </span>
            </div>
          )}

          <div className="mt-9 flex items-center gap-3 text-sm text-slate-500">
            <span className="h-px w-8 bg-emerald-300" />
            Thank you for giving us a moment to make things better.
          </div>
          {onRetry && (
            <button type="button" onClick={onRetry} className="mt-8 w-fit rounded-full bg-[#315b48] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-950/15 transition hover:-translate-y-0.5 hover:bg-[#284b3b] focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2">
              Check again
            </button>
          )}
        </div>

        <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden bg-[#eaf1e9] px-6 py-10 sm:min-h-[380px] lg:min-h-full">
          <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'radial-gradient(#9ab3a0 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
          <div className="absolute right-7 top-7 h-24 w-24 rounded-full border border-white/80 sm:right-12 sm:top-12 sm:h-32 sm:w-32" />
          <div className="absolute bottom-8 left-7 h-16 w-16 rounded-full border border-white/80 sm:bottom-12 sm:left-12 sm:h-24 sm:w-24" />

          <div className="gentle-float relative w-full max-w-[420px]">
            <div className="absolute -left-1 top-6 h-24 w-24 rounded-full bg-[#cfdfd0] sm:-left-5 sm:top-8 sm:h-32 sm:w-32" />
            <div className="absolute -right-1 bottom-9 h-28 w-28 rounded-full bg-[#d8e4d8] sm:-right-3 sm:bottom-7 sm:h-36 sm:w-36" />
            <div className="relative rounded-[2rem] border border-white/90 bg-white/90 p-4 shadow-[0_28px_70px_-35px_rgba(33,69,50,0.4)] backdrop-blur sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#d6e4d8]" />
                  <span className="h-2 w-2 rounded-full bg-[#e9ddbe]" />
                  <span className="h-2 w-2 rounded-full bg-[#f0d4cb]" />
                </div>
                <span className="rounded-full bg-[#f2f6f1] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#557761]">Improving your experience</span>
              </div>

              <div className="relative mt-5 flex h-48 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#f3f6ed] to-[#e5efe5] sm:h-60">
                <div className="absolute bottom-8 h-3 w-40 rounded-full bg-[#b6cbb9]/70 blur-sm sm:w-52" />
                <svg className="relative h-44 w-56 sm:h-56 sm:w-72" viewBox="0 0 288 224" fill="none" aria-hidden="true">
                  <path d="M48 185h192" stroke="#9AB49D" strokeWidth="4" strokeLinecap="round" />
                  <path d="M91 167c-2-24 5-45 20-62m81 62c2-24-5-45-20-62" stroke="#557761" strokeWidth="5" strokeLinecap="round" />
                  <path d="M109 111c-1-24 13-43 35-51 22 8 36 27 35 51-1 23-15 39-35 46-20-7-34-23-35-46Z" fill="#C9DCCB" stroke="#557761" strokeWidth="4" />
                  <path d="M144 62v96m-1-62-21-17m22 35 22-19" stroke="#557761" strokeWidth="4" strokeLinecap="round" />
                  <path d="m62 76 5 11 11 5-11 5-5 11-5-11-11-5 11-5 5-11Zm164-43 4 9 9 4-9 4-4 9-4-9-9-4 9-4 4-9Z" fill="#C29A53" />
                  <path d="m221 114 3 6 6 3-6 3-3 6-3-6-6-3 6-3 3-6Z" fill="#819B85" />
                  <path d="M82 161c11-8 23-8 34 0m57 0c11-8 23-8 34 0" stroke="#D7B878" strokeWidth="4" strokeLinecap="round" />
                  <path d="M131 177h26" stroke="#C29A53" strokeWidth="4" strokeLinecap="round" />
                </svg>
                <span className="absolute bottom-3 right-4 text-[10px] font-semibold tracking-wide text-[#718b76]">A better experience is growing</span>
              </div>
            </div>
            <div className="absolute -right-3 -top-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#315b48] text-white shadow-lg sm:-right-5 sm:-top-5 sm:h-14 sm:w-14">
              <svg className="h-7 w-7 animate-[spin_12s_linear_infinite]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2M3 12h2m14 0h2M5.64 5.64l1.42 1.42m9.88 9.88 1.42 1.42m0-12.72-1.42 1.42m-9.88 9.88-1.42 1.42M15.5 12a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" />
              </svg>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
