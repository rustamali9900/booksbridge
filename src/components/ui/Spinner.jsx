export default function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      <p className="text-xs font-bold tracking-[0.3em] text-slate-500 uppercase italic">
        Loading Marketplace...
      </p>
    </div>
  );
}
