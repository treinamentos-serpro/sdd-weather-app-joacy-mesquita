import { normalizeSearchKey } from '../lib/search';
import { mockWeatherData } from '../mocks/weatherData';
import type { WeatherData } from '../types/weather';

const SIMULATED_DELAY_MS = 250;

export async function findMockWeather(cityQuery: string): Promise<WeatherData | null> {
  await new Promise<void>((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));

  const normalizedQuery = normalizeSearchKey(cityQuery);

  if (normalizedQuery === 'falha') {
    throw new Error('Não foi possível consultar os dados meteorológicos.');
  }

  const normalizedCity = normalizeSearchKey(mockWeatherData.city.name);
  return normalizedQuery && normalizedCity.includes(normalizedQuery) ? mockWeatherData : null;
}
