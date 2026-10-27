interface LoadingStateProps {
  label?: string;
}

export default function LoadingState({
  label = 'Carregando dados meteorológicos…',
}: LoadingStateProps) {
  return (
    <p role="status" className="py-12 text-center text-sm text-slate-400">
      {label}
    </p>
  );
}
