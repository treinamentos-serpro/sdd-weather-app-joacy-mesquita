import { act, renderHook } from '@testing-library/react';
import { useWeather } from '../../src/hooks/useWeather';
import type { City, WeatherData } from '../../src/types/weather';

const serviceMocks = vi.hoisted(() => ({
  searchCities: vi.fn(),
  fetchWeatherData: vi.fn(),
}));

vi.mock('../../src/services/weatherService', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../src/services/weatherService')>()),
  ...serviceMocks,
}));

const berlin: City = {
  id: 2950159,
  name: 'Berlim',
  region: 'Berlim',
  country: 'Alemanha',
  countryCode: 'DE',
  latitude: 52.52,
  longitude: 13.41,
  timezone: 'Europe/Berlin',
};

const weatherData: WeatherData = {
  city: berlin,
  current: {
    temperatureC: 12,
    weatherCode: 3,
    relativeHumidityPercent: 65,
    windSpeedKmh: 10,
    pressureMslHpa: 1012,
    precipitationMm: 0,
    observedAt: '2026-10-27T08:00:00.000Z',
  },
  forecastDays: [],
  fetchedAt: '2026-10-27T08:00:00.000Z',
};

describe('useWeather', () => {
  beforeEach(() => {
    serviceMocks.searchCities.mockReset();
    serviceMocks.fetchWeatherData.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('debounces suggestion requests by 300 ms', async () => {
    vi.useFakeTimers();
    serviceMocks.searchCities.mockResolvedValue([berlin]);
    const { result } = renderHook(() => useWeather());

    act(() => result.current.setQuery('Berlim'));
    expect(serviceMocks.searchCities).not.toHaveBeenCalled();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(299);
    });
    expect(serviceMocks.searchCities).not.toHaveBeenCalled();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1);
    });
    expect(serviceMocks.searchCities).toHaveBeenCalledWith('Berlim', expect.any(AbortSignal));
    expect(result.current.searchState).toEqual({ status: 'success', data: [berlin] });
  });

  it('loads one weather snapshot on selection and does not refetch when unit changes', async () => {
    serviceMocks.fetchWeatherData.mockResolvedValue(weatherData);
    const { result } = renderHook(() => useWeather());

    await act(async () => {
      result.current.selectCity(berlin);
      await Promise.resolve();
    });

    expect(result.current.weatherState).toEqual({ status: 'success', data: weatherData });
    expect(serviceMocks.fetchWeatherData).toHaveBeenCalledTimes(1);

    act(() => result.current.setUnit('fahrenheit'));

    expect(result.current.unit).toBe('fahrenheit');
    expect(result.current.weatherState).toEqual({ status: 'success', data: weatherData });
    expect(serviceMocks.fetchWeatherData).toHaveBeenCalledTimes(1);
  });

  it('cancels the previous city request so its late response cannot replace the latest selection', async () => {
    let resolveFirst: ((data: WeatherData) => void) | undefined;
    serviceMocks.fetchWeatherData
      .mockImplementationOnce(
        () =>
          new Promise<WeatherData>((resolve) => {
            resolveFirst = resolve;
          }),
      )
      .mockResolvedValueOnce({ ...weatherData, city: { ...berlin, id: 1, name: 'Outra cidade' } });

    const { result } = renderHook(() => useWeather());
    const otherCity = { ...berlin, id: 1, name: 'Outra cidade' };

    await act(async () => {
      result.current.selectCity(berlin);
      result.current.selectCity(otherCity);
      await Promise.resolve();
    });

    resolveFirst?.(weatherData);
    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.selectedCity).toEqual(otherCity);
    expect(result.current.weatherState).toMatchObject({
      status: 'success',
      data: { city: otherCity },
    });
    expect(serviceMocks.fetchWeatherData).toHaveBeenCalledTimes(2);
  });
});
