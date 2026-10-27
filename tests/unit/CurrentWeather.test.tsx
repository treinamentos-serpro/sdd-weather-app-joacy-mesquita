import { render, screen } from '@testing-library/react';
import CurrentWeather from '../../src/components/CurrentWeather';
import type { City, CurrentWeather as CurrentWeatherData } from '../../src/types/weather';

const city: City = {
  id: 1,
  name: 'Berlim',
  region: 'Berlim',
  country: 'Alemanha',
  countryCode: 'DE',
  latitude: 52.52,
  longitude: 13.41,
  timezone: 'Europe/Berlin',
};

function createWeather(observedAt: string): CurrentWeatherData {
  return {
    temperatureC: 20,
    weatherCode: 3,
    relativeHumidityPercent: null,
    windSpeedKmh: 10.5,
    pressureMslHpa: 1012,
    precipitationMm: 0,
    observedAt,
  };
}

describe('CurrentWeather', () => {
  it('renders converted temperature and labels unavailable fields', () => {
    render(
      <CurrentWeather
        city={city}
        current={createWeather(new Date().toISOString())}
        unit="fahrenheit"
      />,
    );

    expect(screen.getByRole('heading', { name: 'Berlim' })).toBeInTheDocument();
    expect(screen.getByText('68 °F')).toBeInTheDocument();
    expect(screen.getByText('Nublado')).toBeInTheDocument();
    expect(screen.getByText('Umidade').parentElement).toHaveTextContent('Indisponível');
    expect(screen.getByText('Vento').parentElement).toHaveTextContent('10,5 km/h');
    expect(screen.getByText('Atualizado')).toBeInTheDocument();
  });

  it('marks observations older than two hours as stale', () => {
    const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1_000).toISOString();
    render(<CurrentWeather city={city} current={createWeather(threeHoursAgo)} unit="celsius" />);

    expect(screen.getByText('Desatualizado')).toBeInTheDocument();
    expect(screen.getByText('20 °C')).toBeInTheDocument();
  });
});
