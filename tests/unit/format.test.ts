import {
  formatForecastDate,
  formatNumber,
  formatObservationTime,
  isObservationStale,
} from '../../src/lib/format';

describe('format helpers', () => {
  it('formats forecast dates with a weekday and day/month in pt-BR', () => {
    expect(formatForecastDate('2026-10-27')).toBe('ter., 27/10');
  });

  it('formats observation time in the city timezone using a 24-hour clock', () => {
    expect(formatObservationTime('2026-10-27T09:00:00Z', 'Europe/Berlin')).toBe('10:00');
  });

  it('formats numbers and reports missing values', () => {
    expect(formatNumber(12.5)).toBe('12,5');
    expect(formatNumber(null)).toBe('Indisponível');
  });

  it('marks observations older than two hours as stale', () => {
    const now = Date.parse('2026-10-27T12:00:00Z');

    expect(isObservationStale('2026-10-27T10:00:00Z', now)).toBe(false);
    expect(isObservationStale('2026-10-27T09:59:59Z', now)).toBe(true);
    expect(isObservationStale('invalid', now)).toBe(true);
  });
});
