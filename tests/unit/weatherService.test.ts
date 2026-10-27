import { fetchWeatherData, searchCities } from '../../src/services/weatherService';

const cityResult = {
  id: 2950159,
  name: 'Berlim',
  latitude: 52.52,
  longitude: 13.41,
  admin1: 'Berlim',
  country: 'Alemanha',
  country_code: 'DE',
  timezone: 'Europe/Berlin',
};

describe('searchCities', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('sends the Open-Meteo geocoding parameters and maps results to City', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ results: [cityResult] }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    const cities = await searchCities('São Paulo');
    const requestUrl = new URL(fetchMock.mock.calls[0]?.[0] as URL);

    expect(requestUrl.origin + requestUrl.pathname).toBe(
      'https://geocoding-api.open-meteo.com/v1/search',
    );
    expect(requestUrl.searchParams.get('name')).toBe('São Paulo');
    expect(requestUrl.searchParams.get('count')).toBe('5');
    expect(requestUrl.searchParams.get('language')).toBe('pt');
    expect(requestUrl.searchParams.get('format')).toBe('json');
    expect(cities).toEqual([
      {
        id: 2950159,
        name: 'Berlim',
        latitude: 52.52,
        longitude: 13.41,
        region: 'Berlim',
        country: 'Alemanha',
        countryCode: 'DE',
        timezone: 'Europe/Berlin',
      },
    ]);
  });

  it('normalizes a successful response without results to an empty list', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status: 200 })));

    await expect(searchCities('Nowhere')).resolves.toEqual([]);
  });

  it('reports rate limiting as an HTTP error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { status: 429 })));

    await expect(searchCities('Berlim')).rejects.toMatchObject({
      kind: 'http',
      statusCode: 429,
    });
  });

  it('aborts the request after ten seconds', async () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      'fetch',
      vi.fn(
        (_input: RequestInfo | URL, init?: RequestInit) =>
          new Promise<Response>((_resolve, reject) => {
            init?.signal?.addEventListener('abort', () =>
              reject(new DOMException('Aborted', 'AbortError')),
            );
          }),
      ),
    );

    const request = searchCities('Berlim');
    const assertion = expect(request).rejects.toMatchObject({ kind: 'timeout' });

    await vi.advanceTimersByTimeAsync(10_000);
    await assertion;
  });
});

describe('fetchWeatherData', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('requests current and daily fields and maps the response to domain data', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          timezone: 'Europe/Berlin',
          utc_offset_seconds: 3600,
          current: {
            time: '2026-10-27T09:00',
            temperature_2m: 12.4,
            weather_code: 3,
            relative_humidity_2m: 65,
            wind_speed_10m: 10.8,
            pressure_msl: 1012.4,
            precipitation: 0,
          },
          daily: {
            time: ['2026-10-27', '2026-10-28', '2026-10-29', '2026-10-30', '2026-10-31'],
            weather_code: [3, 61, 2, 3, 1],
            temperature_2m_min: [8.1, 7.4, 9.0, 8.6, 6.8],
            temperature_2m_max: [14.2, 12.1, 15.0, 13.4, 12.8],
            precipitation_probability_max: [10, 80, 20, 15, 5],
            wind_speed_10m_max: [14.0, 20.5, 12.0, 16.4, 11.2],
          },
        }),
        { status: 200 },
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    const data = await fetchWeatherData({ ...cityResult, region: 'Berlim', countryCode: 'DE' });
    const requestUrl = new URL(fetchMock.mock.calls[0]?.[0] as URL);

    expect(requestUrl.searchParams.get('timezone')).toBe('auto');
    expect(requestUrl.searchParams.get('forecast_days')).toBe('5');
    expect(requestUrl.searchParams.get('temperature_unit')).toBe('celsius');
    expect(requestUrl.searchParams.get('current')).toContain('pressure_msl');
    expect(requestUrl.searchParams.get('daily')).toContain('temperature_2m_min');
    expect(data.current.observedAt).toBe('2026-10-27T08:00:00.000Z');
    expect(data.forecastDays).toHaveLength(5);
    expect(data.forecastDays[0]).toMatchObject({
      date: '2026-10-27',
      temperatureMinC: 8.1,
      temperatureMaxC: 14.2,
    });
    expect(data.city.timezone).toBe('Europe/Berlin');
  });

  it('keeps missing current and daily values unavailable', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            timezone: 'Europe/Berlin',
            utc_offset_seconds: 3600,
            current: { time: '2026-10-27T09:00', temperature_2m: 12 },
            daily: { time: ['2026-10-27'] },
          }),
          { status: 200 },
        ),
      ),
    );

    const data = await fetchWeatherData({ ...cityResult, region: 'Berlim', countryCode: 'DE' });

    expect(data.current.relativeHumidityPercent).toBeNull();
    expect(data.forecastDays).toHaveLength(5);
    expect(data.forecastDays[0]?.temperatureMinC).toBeNull();
    expect(data.forecastDays[4]?.date).toBe('2026-10-31');
    expect(data.forecastDays[4]?.weatherCode).toBeNull();
  });
});
