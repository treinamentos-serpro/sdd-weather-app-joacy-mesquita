const ptBrNumberFormatter = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 1,
});

export function formatForecastDate(date: string): string {
  const [year, month, day] = date.split('-').map(Number);

  if (!year || !month || !day) {
    return 'Data indisponível';
  }

  const utcDate = new Date(Date.UTC(year, month - 1, day, 12));

  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    timeZone: 'UTC',
  }).format(utcDate);
}

export function formatObservationTime(isoTimestamp: string, timezone: string | null): string {
  const date = new Date(isoTimestamp);

  if (Number.isNaN(date.getTime())) {
    return 'Horário indisponível';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: timezone ?? 'UTC',
  }).format(date);
}

export function isObservationStale(isoTimestamp: string, now = Date.now()): boolean {
  const observedAt = Date.parse(isoTimestamp);

  return !Number.isFinite(observedAt) || now - observedAt > 2 * 60 * 60 * 1_000;
}

export function formatNumber(value: number | null): string {
  if (value === null || !Number.isFinite(value)) {
    return 'Indisponível';
  }

  return ptBrNumberFormatter.format(value);
}
