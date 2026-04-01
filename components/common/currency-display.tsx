interface CurrencyDisplayProps {
  amount: number;
  showSymbol?: boolean;
  className?: string;
}

export function CurrencyDisplay({
  amount,
  showSymbol = true,
  className = '',
}: CurrencyDisplayProps) {
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  return (
    <span className={className}>
      {showSymbol && <span className="font-semibold">ETB </span>}
      {formatted}
    </span>
  );
}
