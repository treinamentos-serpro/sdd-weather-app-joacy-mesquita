import { formatForecastDate, formatNumber } from '../lib/format';
import { formatTemperature } from '../lib/temperature';
import { describeWeatherCode, getWeatherIcon } from '../lib/weatherCodes';
import type { ForecastDay, Unit } from '../types/weather';

interface ForecastCardProps {
  day: ForecastDay;
  unit: Unit;
}

export default function ForecastCard({ day, unit }: ForecastCardProps) {
  return (
    <li className="min-w-0 border-t border-white/10 py-4 first:border-t-0 sm:border-t-0 sm:border-l sm:pl-4 sm:first:border-l-0 sm:first:pl-0">
      <time dateTime={day.date} className="text-xs font-medium text-slate-300">
        {formatForecastDate(day.date)}
      </time>
      <div className="mt-3 flex items-center gap-2">
        <span aria-hidden="true" className="text-2xl text-sun">
          {getWeatherIcon(day.weatherCode)}
        </span>
        <p className="text-sm text-slate-400">{describeWeatherCode(day.weatherCode)}</p>
      </div>
      <p className="mt-2 text-sm font-semibold text-white">
        {formatTemperature(day.temperatureMinC, unit)} /{' '}
        {formatTemperature(day.temperatureMaxC, unit)}
      </p>
      <dl className="mt-3 space-y-1 text-xs text-slate-500">
        <div className="flex justify-between gap-2">
          <dt>Chuva</dt>
          <dd>
            {formatNumber(day.precipitationProbabilityMaxPercent)}
            {day.precipitationProbabilityMaxPercent === null ? '' : '%'}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt>Vento</dt>
          <dd>
            {formatNumber(day.windSpeedMaxKmh)}
            {day.windSpeedMaxKmh === null ? '' : ' km/h'}
          </dd>
        </div>
      </dl>
    </li>
  );
}
