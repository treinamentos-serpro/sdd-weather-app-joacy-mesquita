export type Unit = 'celsius' | 'fahrenheit';

export interface City {
  id: number;
  name: string;
  region: string | null;
  country: string | null;
  countryCode: string | null;
  latitude: number;
  longitude: number;
  timezone: string | null;
}

export interface CurrentWeather {
  temperatureC: number | null;
  weatherCode: number | null;
  relativeHumidityPercent: number | null;
  windSpeedKmh: number | null;
  pressureMslHpa: number | null;
  precipitationMm: number | null;
  observedAt: string;
}

export interface ForecastDay {
  date: string;
  weatherCode: number | null;
  temperatureMinC: number | null;
  temperatureMaxC: number | null;
  precipitationProbabilityMaxPercent: number | null;
  windSpeedMaxKmh: number | null;
}

export interface WeatherData {
  city: City;
  current: CurrentWeather;
  forecastDays: ForecastDay[];
  fetchedAt: string;
}

export type RequestState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'empty' }
  | { status: 'error'; kind: 'network' | 'http' | 'timeout' | 'invalid-response'; message: string };
