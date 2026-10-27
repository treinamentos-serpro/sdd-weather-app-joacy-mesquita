import { normalizeSearchKey, validateSearchTerm } from '../../src/lib/search';

describe('search term helpers', () => {
  it('trims and collapses whitespace while preserving the query spelling', () => {
    expect(validateSearchTerm('  São   Paulo ')).toEqual({
      valid: true,
      query: 'São Paulo',
      key: 'sao paulo',
    });
  });

  it('normalizes case and diacritics for matching', () => {
    expect(normalizeSearchKey('  SÃO   PAULO ')).toBe('sao paulo');
    expect(normalizeSearchKey("L'Haÿ-les-Roses")).toBe("l'hay-les-roses");
  });

  it('rejects terms outside the code point and alphanumeric limits', () => {
    expect(validateSearchTerm(' ')).toEqual({ valid: false, reason: 'too-short' });
    expect(validateSearchTerm('!!')).toEqual({ valid: false, reason: 'missing-alphanumeric' });
    expect(validateSearchTerm('a'.repeat(81))).toEqual({ valid: false, reason: 'too-long' });
    expect(validateSearchTerm('São')).toMatchObject({ valid: true, query: 'São' });
  });
});
