import type { City, CurrentWeather, ForecastDay, WeatherData } from '../types/weather';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const REQUEST_TIMEOUT_MS = 10_000;

export type WeatherServiceErrorKind =
  | 'network'
  | 'http'
  | 'timeout'
  | 'invalid-response'
  | 'aborted';

export class WeatherServiceError extends Error {
  constructor(
    readonly kind: WeatherServiceErrorKind,
    message: string,
    readonly statusCode?: number,
  ) {
    super(message);
    this.name = 'WeatherServiceError';
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function mapCity(value: unknown): City | null {
  if (!isRecord(value)) {
    return null;
  }

  const { id, name, latitude, longitude } = value;

  if (
    typeof id !== 'number' ||
    typeof name !== 'string' ||
    typeof latitude !== 'number' ||
    typeof longitude !== 'number'
  ) {
    return null;
  }

  return {
    id,
    name,
    latitude,
    longitude,
    region: typeof value.admin1 === 'string' ? value.admin1 : null,
    country: typeof value.country === 'string' ? value.country : null,
    countryCode: typeof value.country_code === 'string' ? value.country_code : null,
    timezone: typeof value.timezone === 'string' ? value.timezone : null,
  };
}

async function requestJson(url: URL, signal?: AbortSignal): Promise<unknown> {
  const controller = new AbortController();
  let timedOut = false;
  const timeoutId = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, REQUEST_TIMEOUT_MS);
  const abortRequest = () => controller.abort();

  if (signal?.aborted) {
    clearTimeout(timeoutId);
    throw new WeatherServiceError('aborted', 'Busca cancelada.');
  }

  signal?.addEventListener('abort', abortRequest, { once: true });

  try {
    const response = await fetch(url, { signal: controller.signal });

    if (!response.ok) {
      if (response.status === 429) {
        throw new WeatherServiceError('http', 'O serviço está temporariamente limitado.', 429);
      }

      throw new WeatherServiceError(
        'http',
        'Não foi possível consultar os dados.',
        response.status,
      );
    }

    let payload: unknown;

    try {
      payload = await response.json();
    } catch {
      throw new WeatherServiceError('invalid-response', 'A resposta de busca é inválida.');
    }

    return payload;
  } catch (error) {
    if (error instanceof WeatherServiceError) {
      throw error;
    }

    if (timedOut) {
      throw new WeatherServiceError('timeout', 'A busca excedeu o tempo limite de 10 segundos.');
    }

    if (signal?.aborted) {
      throw new WeatherServiceError('aborted', 'Busca cancelada.');
    }

    throw new WeatherServiceError('network', 'Não foi possível conectar ao serviço de busca.');
  } finally {
    clearTimeout(timeoutId);
    signal?.removeEventListener('abort', abortRequest);
  }
}

export async function searchCities(query: string, signal?: AbortSignal): Promise<City[]> {
  const url = new URL(GEOCODING_URL);
  url.searchParams.set('name', query);
  url.searchParams.set('count', '5');
  url.searchParams.set('language', 'pt');
  url.searchParams.set('format', 'json');

  const payload = await requestJson(url, signal);

  if (!isRecord(payload)) {
    throw new WeatherServiceError('invalid-response', 'A resposta de busca é inválida.');
  }

  if (payload.results === undefined) {
    return [];
  }

  if (!Array.isArray(payload.results)) {
    throw new WeatherServiceError('invalid-response', 'A lista de cidades é inválida.');
  }

  return payload.results.map(mapCity).filter((city): city is City => city !== null);
}

function finiteOrNull(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function stringOrNull(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null;
}

function getSeriesValue(series: unknown, index: number): number | null {
  return Array.isArray(series) ? finiteOrNull(series[index]) : null;
}

function toObservedAtUtc(localTime: string, offsetSeconds: number): string {
  const hasTimezone = /(?:Z|[+-]\d{2}:\d{2})$/u.test(localTime);
  const normalizedTime = hasTimezone ? localTime : `${localTime}:00Z`;
  const parsedTime = Date.parse(normalizedTime);

  if (!Number.isFinite(parsedTime)) {
    throw new WeatherServiceError('invalid-response', 'O horário da observação é inválido.');
  }

  const utcTime = hasTimezone ? parsedTime : parsedTime - offsetSeconds * 1_000;
  return new Date(utcTime).toISOString();
}

function addLocalDays(date: string, offset: number): string {
  const [year, month, day] = date.split('-').map(Number);
  const value = new Date(Date.UTC(year, month - 1, day + offset));

  return [
    value.getUTCFullYear(),
    String(value.getUTCMonth() + 1).padStart(2, '0'),
    String(value.getUTCDate()).padStart(2, '0'),
  ].join('-');
}

function mapCurrentWeather(value: unknown, utcOffsetSeconds: number): CurrentWeather {
  if (!isRecord(value)) {
    throw new WeatherServiceError('invalid-response', 'Os dados atuais estão ausentes.');
  }

  const observedAtLocal = stringOrNull(value.time);

  if (!observedAtLocal) {
    throw new WeatherServiceError('invalid-response', 'O horário da observação está ausente.');
  }

  return {
    temperatureC: finiteOrNull(value.temperature_2m),
    weatherCode: finiteOrNull(value.weather_code),
    relativeHumidityPercent: finiteOrNull(value.relative_humidity_2m),
    windSpeedKmh: finiteOrNull(value.wind_speed_10m),
    pressureMslHpa: finiteOrNull(value.pressure_msl),
    precipitationMm: finiteOrNull(value.precipitation),
    observedAt: toObservedAtUtc(observedAtLocal, utcOffsetSeconds),
  };
}

function mapForecastDays(value: unknown, firstLocalDate: string): ForecastDay[] {
  if (!isRecord(value)) {
    throw new WeatherServiceError('invalid-response', 'A previsão diária está ausente.');
  }

  const dates = Array.isArray(value.time) ? value.time : [];
  const dateIndexes = new Map<string, number>();

  dates.forEach((date, index) => {
    if (typeof date === 'string') {
      dateIndexes.set(date, index);
    }
  });

  return Array.from({ length: 5 }, (_, dayOffset) => {
    const date = addLocalDays(firstLocalDate, dayOffset);
    const index = dateIndexes.get(date);

    if (index === undefined) {
      return {
        date,
        weatherCode: null,
        temperatureMinC: null,
        temperatureMaxC: null,
        precipitationProbabilityMaxPercent: null,
        windSpeedMaxKmh: null,
      };
    }

    return {
      date,
      weatherCode: getSeriesValue(value.weather_code, index),
      temperatureMinC: getSeriesValue(value.temperature_2m_min, index),
      temperatureMaxC: getSeriesValue(value.temperature_2m_max, index),
      precipitationProbabilityMaxPercent: getSeriesValue(
        value.precipitation_probability_max,
        index,
      ),
      windSpeedMaxKmh: getSeriesValue(value.wind_speed_10m_max, index),
    };
  });
}

export async function fetchWeatherData(city: City, signal?: AbortSignal): Promise<WeatherData> {
  const url = new URL(FORECAST_URL);
  url.searchParams.set('latitude', String(city.latitude));
  url.searchParams.set('longitude', String(city.longitude));
  url.searchParams.set('timezone', 'auto');
  url.searchParams.set('forecast_days', '5');
  url.searchParams.set('temperature_unit', 'celsius');
  url.searchParams.set('wind_speed_unit', 'kmh');
  url.searchParams.set('precipitation_unit', 'mm');
  url.searchParams.set(
    'current',
    'temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m,pressure_msl,precipitation',
  );
  url.searchParams.set(
    'daily',
    'weather_code,temperature_2m_min,temperature_2m_max,precipitation_probability_max,wind_speed_10m_max',
  );

  const payload = await requestJson(url, signal);

  if (!isRecord(payload) || !isRecord(payload.current) || !isRecord(payload.daily)) {
    throw new WeatherServiceError('invalid-response', 'A resposta meteorológica é inválida.');
  }

  const timezone = stringOrNull(payload.timezone) ?? city.timezone;
  const utcOffsetSeconds = finiteOrNull(payload.utc_offset_seconds);
  const localCurrentTime = stringOrNull(payload.current.time);

  if (!timezone || utcOffsetSeconds === null || !localCurrentTime) {
    throw new WeatherServiceError(
      'invalid-response',
      'Faltam fuso ou horário nos dados meteorológicos.',
    );
  }

  const current = mapCurrentWeather(payload.current, utcOffsetSeconds);
  const currentLocalDate = localCurrentTime.slice(0, 10);
  const forecastDays = mapForecastDays(payload.daily, currentLocalDate);

  return {
    city: { ...city, timezone },
    current,
    forecastDays,
    fetchedAt: new Date().toISOString(),
  };
}
