import { useRef, useState } from 'react';
import CurrentWeather from './components/CurrentWeather';
import ForecastList from './components/ForecastList';
import SearchBar from './components/SearchBar';
import EmptyState from './components/states/EmptyState';
import ErrorState from './components/states/ErrorState';
import LoadingState from './components/states/LoadingState';
import UnitToggle from './components/UnitToggle';
import { findMockWeather } from './services/mockWeatherService';
import type { RequestState, Unit, WeatherData } from './types/weather';

export default function App() {
  const [weatherState, setWeatherState] = useState<RequestState<WeatherData>>({ status: 'idle' });
  const [unit, setUnit] = useState<Unit>('celsius');
  const lastSearch = useRef('');
  const requestId = useRef(0);

  async function searchCity(city: string) {
    lastSearch.current = city;
    const currentRequestId = ++requestId.current;
    setWeatherState({ status: 'loading' });

    try {
      const data = await findMockWeather(city);

      if (currentRequestId !== requestId.current) {
        return;
      }

      setWeatherState(data ? { status: 'success', data } : { status: 'empty' });
    } catch (error) {
      if (currentRequestId !== requestId.current) {
        return;
      }

      setWeatherState({
        status: 'error',
        kind: 'network',
        message: error instanceof Error ? error.message : 'Não foi possível consultar os dados.',
      });
    }
  }

  function retrySearch() {
    if (lastSearch.current) {
      void searchCity(lastSearch.current);
    }
  }

  return (
    <main className="min-h-screen bg-night-900 px-4 py-8 text-slate-100 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 grid gap-6 border-b border-white/10 pb-8 sm:mb-14 sm:pb-10 lg:grid-cols-[auto_minmax(18rem,1fr)_auto] lg:items-end">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sun">Weather App</p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-4xl">
              Tempo local
            </h1>
            <p className="mt-2 text-sm text-slate-400">Clima atual e próximos cinco dias</p>
          </div>
          <SearchBar onSearch={searchCity} disabled={weatherState.status === 'loading'} />
          <div className="flex justify-start lg:justify-end">
            <UnitToggle unit={unit} onChange={setUnit} />
          </div>
        </header>

        <section
          aria-label="Condições meteorológicas"
          className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-glass backdrop-blur-md sm:p-7"
        >
          {weatherState.status === 'idle' && (
            <EmptyState
              title="Clima local à sua espera"
              description="Busque São Paulo para visualizar o exemplo de clima e previsão incluído nesta versão."
            />
          )}
          {weatherState.status === 'loading' && (
            <LoadingState label="Consultando o exemplo local…" />
          )}
          {weatherState.status === 'empty' && (
            <EmptyState
              title="Cidade não encontrada"
              description="O exemplo local disponível é São Paulo. Tente buscar essa cidade."
            />
          )}
          {weatherState.status === 'error' && (
            <ErrorState message={weatherState.message} onRetry={retrySearch} />
          )}
          {weatherState.status === 'success' && (
            <div className="space-y-7">
              <CurrentWeather
                city={weatherState.data.city}
                current={weatherState.data.current}
                unit={unit}
              />
              <ForecastList days={weatherState.data.forecastDays} unit={unit} />
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
