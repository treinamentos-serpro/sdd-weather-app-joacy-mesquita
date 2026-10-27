import { convertTemperature, formatTemperature } from '../../src/lib/temperature';

describe('temperature helpers', () => {
  it('converts from the source Celsius value and rounds half away from zero', () => {
    expect(convertTemperature(20, 'fahrenheit')).toBe(68);
    expect(convertTemperature(-40, 'fahrenheit')).toBe(-40);
    expect(convertTemperature(0.5, 'celsius')).toBe(1);
    expect(convertTemperature(-0.5, 'celsius')).toBe(-1);
  });

  it('formats the selected unit and unavailable values', () => {
    expect(formatTemperature(20, 'fahrenheit')).toBe('68 °F');
    expect(formatTemperature(null, 'celsius')).toBe('Indisponível');
  });
});
