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
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sage-50 via-white to-brand-50 px-4 py-12">
      <section className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white px-6 py-10 text-center shadow-xl shadow-brand-900/5 sm:px-12 sm:py-14">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-700" aria-hidden="true">
          <svg className="h-9 w-9 animate-[spin_12s_linear_infinite]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2M3 12h2m14 0h2M5.64 5.64l1.42 1.42m9.88 9.88 1.42 1.42m0-12.72-1.42 1.42m-9.88 9.88-1.42 1.42M15.5 12a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" />
          </svg>
        </div>
        <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-brand-700">Your Choice</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">{settings.maintenanceTitle}</h1>
        <p className="mx-auto mt-4 max-w-md whitespace-pre-line text-base leading-7 text-slate-600">{settings.maintenanceMessage}</p>
        {expectedBack && (
          <p className="mt-6 rounded-2xl bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-800">
            Expected back: <time dateTime={settings.maintenanceUntil!}>{expectedBack}</time>
          </p>
        )}
        <p className="mt-6 text-sm text-slate-500">Thank you for your patience.</p>
        {onRetry && (
          <button type="button" onClick={onRetry} className="mt-6 rounded-full bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2">
            Try again
          </button>
        )}
      </section>
    </main>
  );
};
