import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import type { MaintenanceSettings } from '../../contexts/MaintenanceContext';

type AdminMaintenanceSettings = MaintenanceSettings & {
  updatedAt: string;
  updatedById: string | null;
  updatedBy: { email: string } | null;
};

type FormValues = Omit<MaintenanceSettings, 'maintenanceUntil'> & {
  maintenanceDate: string;
  maintenanceTime: string;
};

const pad = (value: number) => String(value).padStart(2, '0');

const toFormValues = (settings: MaintenanceSettings): FormValues => {
  const date = settings.maintenanceUntil ? new Date(settings.maintenanceUntil) : null;
  return {
    maintenanceMode: settings.maintenanceMode,
    maintenanceTitle: settings.maintenanceTitle,
    maintenanceMessage: settings.maintenanceMessage,
    maintenanceDate: date ? `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` : '',
    maintenanceTime: date ? `${pad(date.getHours())}:${pad(date.getMinutes())}` : ''
  };
};

const toApiSettings = (form: FormValues): MaintenanceSettings => {
  let maintenanceUntil: string | null = null;
  if (form.maintenanceDate && form.maintenanceTime) {
    const [year, month, day] = form.maintenanceDate.split('-').map(Number);
    const [hours, minutes] = form.maintenanceTime.split(':').map(Number);
    const localDate = new Date(year, month - 1, day, hours, minutes);
    if (!Number.isFinite(localDate.getTime())) throw new Error('Enter a valid return date and time.');
    maintenanceUntil = localDate.toISOString();
  }

  return {
    maintenanceMode: form.maintenanceMode,
    maintenanceTitle: form.maintenanceTitle,
    maintenanceMessage: form.maintenanceMessage,
    maintenanceUntil
  };
};

export const MaintenanceSettingsPage = () => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormValues | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [confirmEnable, setConfirmEnable] = useState(false);

  const settingsQuery = useQuery({
    queryKey: ['adminMaintenanceSettings'],
    queryFn: () => api.get<AdminMaintenanceSettings>('/admin/settings/maintenance')
  });

  useEffect(() => {
    if (settingsQuery.data) {
      setForm(toFormValues(settingsQuery.data));
    }
  }, [settingsQuery.data]);

  const saveSettings = useMutation({
    mutationFn: (values: MaintenanceSettings) => api.patch<AdminMaintenanceSettings>('/admin/settings/maintenance', values),
    onSuccess: async (saved) => {
      setForm(toFormValues(saved));
      setErrorMessage('');
      setSuccessMessage('Website settings saved successfully.');
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['adminMaintenanceSettings'] }),
        queryClient.invalidateQueries({ queryKey: ['publicMaintenanceSettings'] })
      ]);
    },
    onError: (error: Error) => {
      setSuccessMessage('');
      setErrorMessage(error.message);
    }
  });

  if (settingsQuery.isLoading) {
    return <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600">Loading website settings…</div>;
  }

  if (settingsQuery.isError || !form) {
    return (
      <section className="rounded-3xl border border-red-200 bg-white p-8">
        <h2 className="text-xl font-bold text-slate-900">Unable to load website settings</h2>
        <p className="mt-2 text-sm text-red-700">{settingsQuery.error instanceof Error ? settingsQuery.error.message : 'Please try again.'}</p>
        <button type="button" onClick={() => { void settingsQuery.refetch(); }} className="mt-4 rounded-full bg-brand-700 px-4 py-2 text-sm font-semibold text-white">Retry</button>
      </section>
    );
  }

  const hasPartialReturnTime = Boolean(form.maintenanceDate) !== Boolean(form.maintenanceTime);
  const previewSettings = {
    ...toApiSettings({ ...form, maintenanceDate: form.maintenanceDate && form.maintenanceTime ? form.maintenanceDate : '', maintenanceTime: form.maintenanceDate && form.maintenanceTime ? form.maintenanceTime : '' }),
    maintenanceMode: true
  };
  const previewUrl = `/maintenance-preview?settings=${encodeURIComponent(JSON.stringify(previewSettings))}`;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Maintenance mode</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">Temporarily replace public pages with a maintenance notice. Admin tools and critical integrations remain available.</p>
        </div>
        <span className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ${form.maintenanceMode ? 'bg-amber-50 text-amber-800' : 'bg-emerald-50 text-emerald-800'}`}>
          <span className={`h-2 w-2 rounded-full ${form.maintenanceMode ? 'bg-amber-500' : 'bg-emerald-500'}`} />
          {form.maintenanceMode ? 'Maintenance mode active' : 'Website online'}
        </span>
      </div>

      {errorMessage && <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{errorMessage}</p>}
      {successMessage && <p role="status" className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{successMessage}</p>}

      <form
        className="mt-6 space-y-6"
        onSubmit={(event) => {
          event.preventDefault();
          setErrorMessage('');
          setSuccessMessage('');
          if (hasPartialReturnTime) {
            setErrorMessage('Choose both a return date and time, or clear both fields.');
            return;
          }
          if (form.maintenanceMode && !settingsQuery.data?.maintenanceMode) {
            setConfirmEnable(true);
            return;
          }
          try {
            saveSettings.mutate(toApiSettings(form));
          } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Enter a valid return date and time.');
          }
        }}
      >
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div>
            <p className="font-bold text-slate-900">Maintenance mode</p>
            <p className="mt-1 text-sm text-slate-500">When enabled, public pages show your maintenance notice.</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={form.maintenanceMode}
            aria-label="Maintenance mode"
            onClick={() => setForm({ ...form, maintenanceMode: !form.maintenanceMode })}
            className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition ${form.maintenanceMode ? 'bg-brand-700' : 'bg-slate-300'}`}
          >
            <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${form.maintenanceMode ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Maintenance title</span>
          <input required minLength={3} maxLength={120} value={form.maintenanceTitle} onChange={(event) => setForm({ ...form, maintenanceTitle: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2" />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Maintenance message</span>
          <textarea required minLength={10} maxLength={2000} rows={4} value={form.maintenanceMessage} onChange={(event) => setForm({ ...form, maintenanceMessage: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2" />
        </label>

        <fieldset className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
          <legend className="px-1 text-sm font-semibold text-slate-700">Expected return <span className="font-normal text-slate-500">(optional)</span></legend>
          <p className="mb-4 text-sm text-slate-500">Choose a date and local time. Visitors will see this in their own time zone.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Return date</span>
              <input type="date" value={form.maintenanceDate} onChange={(event) => setForm({ ...form, maintenanceDate: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2" />
            </label>
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Return time</span>
              <input type="time" value={form.maintenanceTime} onChange={(event) => setForm({ ...form, maintenanceTime: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2" />
            </label>
          </div>
          {hasPartialReturnTime && <p className="mt-3 text-sm text-amber-800">Set both the return date and time, or leave both blank.</p>}
        </fieldset>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            {settingsQuery.data?.updatedAt && `Last updated ${new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(settingsQuery.data.updatedAt))}`}
            {settingsQuery.data?.updatedBy?.email && ` by ${settingsQuery.data.updatedBy.email}`}
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link to={previewUrl} target="_blank" rel="noreferrer" className="rounded-full border border-slate-300 px-4 py-2 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50">Preview maintenance page</Link>
            <button type="submit" disabled={saveSettings.isPending} className="rounded-full bg-brand-700 px-5 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
              {saveSettings.isPending ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </div>
      </form>

      {confirmEnable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4" role="presentation">
          <section role="dialog" aria-modal="true" aria-labelledby="maintenance-confirm-title" className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <h3 id="maintenance-confirm-title" className="text-xl font-black text-slate-900">Enable Maintenance Mode?</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">Normal visitors will temporarily be unable to access the website.</p>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setConfirmEnable(false)} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Cancel</button>
              <button
                type="button"
                disabled={saveSettings.isPending}
                onClick={() => {
                  setConfirmEnable(false);
                  setErrorMessage('');
                  setSuccessMessage('');
                  try {
                    if (hasPartialReturnTime) throw new Error('Choose both a return date and time, or clear both fields.');
                    saveSettings.mutate(toApiSettings(form));
                  } catch (error) {
                    setErrorMessage(error instanceof Error ? error.message : 'Enter a valid return date and time.');
                  }
                }}
                className="rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {saveSettings.isPending ? 'Enabling…' : 'Enable Maintenance Mode'}
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
};
