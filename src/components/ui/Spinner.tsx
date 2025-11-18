interface SpinnerProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-8 w-8 border-[3px]',
} as const;

export function Spinner({ label, size = 'md' }: SpinnerProps) {
  return (
    <div className="flex items-center gap-2 text-slate-600">
      <span
        className={`${sizeMap[size]} animate-spin rounded-full border-brand-500 border-t-transparent`}
      />
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
}
