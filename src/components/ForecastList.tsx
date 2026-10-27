import type { ForecastDay, Unit } from '../types/weather';
import ForecastCard from './ForecastCard';

interface ForecastListProps {
  days: ForecastDay[];
  unit: Unit;
}

export default function ForecastList({ days, unit }: ForecastListProps) {
  return (
    <section aria-labelledby="forecast-heading" className="border-t border-white/10 pt-6">
      <div className="mb-2 flex items-baseline justify-between gap-4">
        <h2 id="forecast-heading" className="text-lg font-semibold text-white">
          Próximos dias
        </h2>
        <p className="text-xs text-slate-500">Hoje + 4 dias</p>
      </div>
      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        {days.map((day) => (
          <ForecastCard key={day.date} day={day} unit={unit} />
        ))}
      </ul>
    </section>
  );
}
