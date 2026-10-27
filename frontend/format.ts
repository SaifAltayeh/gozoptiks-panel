const currency = {
  code: "JOD",
  symbol: "JOD",
  locale: "en",
};

export function formatPrice(amount: number, next = currency): string {
  const hasFraction = Math.round(amount * 100) % 100 !== 0;
  const value = amount.toLocaleString(next.locale, {
    minimumFractionDigits: hasFraction ? 2 : 0,
    maximumFractionDigits: 2,
  });
  return `${value} ${next.code}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
