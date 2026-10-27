import type { WeatherData } from '../types/weather';

const timezone = 'America/Sao_Paulo';
const now = new Date();

function localDate(date: Date): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? '';

  return `${part('year')}-${part('month')}-${part('day')}`;
}

function addDays(date: string, count: number): string {
  const [year, month, day] = date.split('-').map(Number);
  const nextDate = new Date(Date.UTC(year, month - 1, day + count));

  return [
    nextDate.getUTCFullYear(),
    String(nextDate.getUTCMonth() + 1).padStart(2, '0'),
    String(nextDate.getUTCDate()).padStart(2, '0'),
  ].join('-');
}

const today = localDate(now);
const dailyValues = [
  { weatherCode: 2, min: 18, max: 25, rain: 10, wind: 14 },
  { weatherCode: 3, min: 17, max: 24, rain: 20, wind: 16 },
  { weatherCode: 61, min: 16, max: 22, rain: 75, wind: 20 },
  { weatherCode: 1, min: 18, max: 26, rain: 5, wind: 12 },
  { weatherCode: 0, min: 19, max: 27, rain: 0, wind: 10 },
];

export const mockWeatherData: WeatherData = {
  city: {
    id: 3448439,
    name: 'São Paulo',
    region: 'São Paulo',
    country: 'Brasil',
    countryCode: 'BR',
    latitude: -23.55,
    longitude: -46.63,
    timezone,
  },
  current: {
    temperatureC: 22.4,
    weatherCode: 2,
    relativeHumidityPercent: 68,
    windSpeedKmh: 12.6,
    pressureMslHpa: 1014.2,
    precipitationMm: 0,
    observedAt: now.toISOString(),
  },
  forecastDays: dailyValues.map((day, index) => ({
    date: addDays(today, index),
    weatherCode: day.weatherCode,
    temperatureMinC: day.min,
    temperatureMaxC: day.max,
    precipitationProbabilityMaxPercent: day.rain,
    windSpeedMaxKmh: day.wind,
  })),
  fetchedAt: now.toISOString(),
};
