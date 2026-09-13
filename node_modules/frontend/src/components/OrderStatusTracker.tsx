const steps = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED'];

export const OrderStatusTracker = ({ currentStatus }: { currentStatus: string }) => {
  const currentIndex = steps.indexOf(currentStatus);

  return (
    <div className="flex flex-wrap gap-3 rounded-2xl border border-slate-200 bg-white p-4">
      {steps.map((step, index) => {
        const active = index <= currentIndex;
        return (
          <div key={step} className="flex items-center gap-2">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${active ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
              {index + 1}
            </div>
            <span className={`text-sm ${active ? 'text-slate-800' : 'text-slate-400'}`}>{step}</span>
            {index < steps.length - 1 && <span className="text-slate-400">→</span>}
          </div>
        );
      })}
    </div>
  );
};
