import { formatNumber, formatObservationTime, isObservationStale } from '../lib/format';
import { formatTemperature } from '../lib/temperature';
import { describeWeatherCode, getWeatherIcon } from '../lib/weatherCodes';
import type { City, CurrentWeather as CurrentWeatherData, Unit } from '../types/weather';

interface CurrentWeatherProps {
  city: City;
  current: CurrentWeatherData;
  unit: Unit;
}

export default function CurrentWeather({ city, current, unit }: CurrentWeatherProps) {
  const stale = isObservationStale(current.observedAt);
  const measures = [
    { label: 'Umidade', value: formatNumber(current.relativeHumidityPercent), unit: '%' },
    { label: 'Vento', value: formatNumber(current.windSpeedKmh), unit: 'km/h' },
    { label: 'Pressão', value: formatNumber(current.pressureMslHpa), unit: 'hPa' },
    { label: 'Precipitação', value: formatNumber(current.precipitationMm), unit: 'mm' },
  ];

  return (
    <section aria-labelledby="current-weather-heading">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2
            id="current-weather-heading"
            className="text-sm font-medium uppercase tracking-[0.14em] text-slate-400"
          >
            {city.name}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            {[city.region, city.country].filter(Boolean).join(' · ')}
          </p>
        </div>
        <div className="text-right text-xs text-slate-400">
          <p>{stale ? 'Desatualizado' : 'Atualizado'}</p>
          <time dateTime={current.observedAt}>
            {formatObservationTime(current.observedAt, city.timezone)}
          </time>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
        <p className="text-6xl font-semibold leading-none tracking-tight text-white sm:text-7xl">
          {formatTemperature(current.temperatureC, unit)}
        </p>
        <div className="flex items-center gap-3 pb-1">
          <span aria-hidden="true" className="text-4xl text-sun">
            {getWeatherIcon(current.weatherCode)}
          </span>
          <p className="text-lg text-slate-300">{describeWeatherCode(current.weatherCode)}</p>
        </div>
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-x-6 border-t border-white/10 sm:grid-cols-4">
        {measures.map((measure) => (
          <div key={measure.label} className="border-b border-white/10 py-4">
            <dt className="text-xs text-slate-500">{measure.label}</dt>
            <dd className="mt-1 text-sm font-medium text-slate-200">
              {measure.value === 'Indisponível'
                ? measure.value
                : `${measure.value} ${measure.unit}`}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
