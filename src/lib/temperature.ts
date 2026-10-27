import type { Unit } from '../types/weather';

export function convertTemperature(temperatureC: number | null, unit: Unit): number | null {
  if (temperatureC === null || !Number.isFinite(temperatureC)) {
    return null;
  }

  const converted = unit === 'fahrenheit' ? (temperatureC * 9) / 5 + 32 : temperatureC;
  const magnitude = Math.floor(Math.abs(converted)) + (Math.abs(converted) % 1 >= 0.5 ? 1 : 0);

  return Math.sign(converted) * magnitude;
}

export function formatTemperature(temperatureC: number | null, unit: Unit): string {
  const value = convertTemperature(temperatureC, unit);

  if (value === null) {
    return 'Indisponível';
  }

  const symbol = unit === 'celsius' ? '°C' : '°F';
  return `${value} ${symbol}`;
}
