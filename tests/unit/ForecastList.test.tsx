import { render, screen } from '@testing-library/react';
import ForecastList from '../../src/components/ForecastList';
import type { ForecastDay } from '../../src/types/weather';

const forecastDays: ForecastDay[] = [
  {
    date: '2026-10-27',
    weatherCode: 3,
    temperatureMinC: 8,
    temperatureMaxC: 14,
    precipitationProbabilityMaxPercent: 10,
    windSpeedMaxKmh: 14,
  },
  {
    date: '2026-10-28',
    weatherCode: 61,
    temperatureMinC: 7,
    temperatureMaxC: 12,
    precipitationProbabilityMaxPercent: 80,
    windSpeedMaxKmh: 20,
  },
  {
    date: '2026-10-29',
    weatherCode: 2,
    temperatureMinC: 9,
    temperatureMaxC: 15,
    precipitationProbabilityMaxPercent: 20,
    windSpeedMaxKmh: 12,
  },
  {
    date: '2026-10-30',
    weatherCode: 3,
    temperatureMinC: 8,
    temperatureMaxC: 13,
    precipitationProbabilityMaxPercent: 15,
    windSpeedMaxKmh: 16,
  },
  {
    date: '2026-10-31',
    weatherCode: 1,
    temperatureMinC: 6,
    temperatureMaxC: 12,
    precipitationProbabilityMaxPercent: 5,
    windSpeedMaxKmh: 11,
  },
];

describe('ForecastList', () => {
  it('renders five local forecast days with temperatures in the selected unit', () => {
    render(<ForecastList days={forecastDays} unit="fahrenheit" />);

    expect(screen.getByRole('heading', { name: 'Próximos dias' })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(5);
    expect(screen.getByText('46 °F / 57 °F')).toBeInTheDocument();
    expect(screen.getByText('80%')).toBeInTheDocument();
  });
});
