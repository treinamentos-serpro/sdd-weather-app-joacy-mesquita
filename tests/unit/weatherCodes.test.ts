import { describeWeatherCode } from '../../src/lib/weatherCodes';

describe('describeWeatherCode', () => {
  it('returns a pt-BR description for a known WMO code', () => {
    expect(describeWeatherCode(3)).toBe('Nublado');
  });

  it('returns a fallback for unknown or unavailable codes', () => {
    expect(describeWeatherCode(999)).toBe('Condição não reconhecida');
    expect(describeWeatherCode(null)).toBe('Indisponível');
  });
});
