interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div role="alert" className="py-10 text-center">
      <h2 className="text-lg font-semibold text-white">Não foi possível carregar o clima</h2>
      <p className="mt-2 text-sm text-slate-400">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-white hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-400"
      >
        Tentar novamente
      </button>
    </div>
  );
}
