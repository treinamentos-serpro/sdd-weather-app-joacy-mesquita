import { useEffect, useRef, useState } from 'react';
import { validateSearchTerm } from '../lib/search';
import { fetchWeatherData, searchCities, WeatherServiceError } from '../services/weatherService';
import type { City, RequestState, Unit, WeatherData } from '../types/weather';

interface UseWeatherResult {
  query: string;
  searchState: RequestState<City[]>;
  selectedCity: City | null;
  weatherState: RequestState<WeatherData>;
  unit: Unit;
  setQuery: (value: string) => void;
  submitSearch: () => void;
  selectCity: (city: City) => void;
  setUnit: (unit: Unit) => void;
  retryWeather: () => void;
}

export function useWeather(): UseWeatherResult {
  const [query, setQuery] = useState('');
  const [searchState, setSearchState] = useState<RequestState<City[]>>({ status: 'idle' });
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [weatherState, setWeatherState] = useState<RequestState<WeatherData>>({ status: 'idle' });
  const [unit, setUnit] = useState<Unit>('celsius');
  const [searchRevision, setSearchRevision] = useState(0);
  const processedRevision = useRef(0);
  const submittedQuery = useRef<string | null>(null);
  const weatherController = useRef<AbortController | null>(null);

  useEffect(() => {
    const validation = validateSearchTerm(query);

    if (!validation.valid) {
      setSearchState({ status: 'idle' });
      return;
    }

    const controller = new AbortController();
    let active = true;
    const submittedImmediately =
      searchRevision !== processedRevision.current && submittedQuery.current === validation.query;
    processedRevision.current = searchRevision;

    if (submittedImmediately) {
      submittedQuery.current = null;
    }

    const delay = submittedImmediately ? 0 : 300;

    const timeoutId = setTimeout(() => {
      setSearchState({ status: 'loading' });

      void searchCities(validation.query, controller.signal)
        .then((cities) => {
          if (!active) {
            return;
          }

          setSearchState(
            cities.length > 0 ? { status: 'success', data: cities } : { status: 'empty' },
          );
        })
        .catch((error: unknown) => {
          if (!active || (error instanceof WeatherServiceError && error.kind === 'aborted')) {
            return;
          }

          const serviceError =
            error instanceof WeatherServiceError
              ? error
              : new WeatherServiceError('network', 'Não foi possível buscar cidades.');

          setSearchState({
            status: 'error',
            kind: serviceError.kind === 'aborted' ? 'network' : serviceError.kind,
            message: serviceError.message,
          });
        });
    }, delay);

    return () => {
      active = false;
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query, searchRevision]);

  useEffect(() => () => weatherController.current?.abort(), []);

  function submitSearch() {
    const validation = validateSearchTerm(query);

    if (!validation.valid) {
      setSearchState({ status: 'idle' });
      return;
    }

    submittedQuery.current = validation.query;
    setSearchRevision((revision) => revision + 1);
  }

  function selectCity(city: City) {
    setSelectedCity(city);
    setSearchState({ status: 'idle' });
    loadWeather(city);
  }

  function loadWeather(city: City) {
    weatherController.current?.abort();
    const controller = new AbortController();
    weatherController.current = controller;
    setWeatherState({ status: 'loading' });

    void fetchWeatherData(city, controller.signal)
      .then((data) => {
        if (controller.signal.aborted) {
          return;
        }

        setSelectedCity(data.city);
        setWeatherState({ status: 'success', data });
      })
      .catch((error: unknown) => {
        if (
          controller.signal.aborted ||
          (error instanceof WeatherServiceError && error.kind === 'aborted')
        ) {
          return;
        }

        const serviceError =
          error instanceof WeatherServiceError
            ? error
            : new WeatherServiceError('network', 'Não foi possível consultar o clima.');

        setWeatherState({
          status: 'error',
          kind: serviceError.kind === 'aborted' ? 'network' : serviceError.kind,
          message: serviceError.message,
        });
      });
  }

  function retryWeather() {
    if (selectedCity) {
      loadWeather(selectedCity);
    }
  }

  return {
    query,
    searchState,
    selectedCity,
    weatherState,
    unit,
    setQuery,
    submitSearch,
    selectCity,
    setUnit,
    retryWeather,
  };
}
