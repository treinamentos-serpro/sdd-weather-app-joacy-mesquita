export type SearchTermError = 'too-short' | 'too-long' | 'missing-alphanumeric';

export type SearchTermValidation =
  | { valid: true; query: string; key: string }
  | { valid: false; reason: SearchTermError };

export function normalizeSearchKey(value: string): string {
  return value
    .trim()
    .replace(/\s+/gu, ' ')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('pt-BR');
}

export function validateSearchTerm(value: string): SearchTermValidation {
  const query = value.trim().replace(/\s+/gu, ' ');
  const codePointLength = Array.from(query).length;

  if (codePointLength < 2) {
    return { valid: false, reason: 'too-short' };
  }

  if (codePointLength > 80) {
    return { valid: false, reason: 'too-long' };
  }

  const alphanumericCount = query.match(/[\p{L}\p{N}]/gu)?.length ?? 0;

  if (alphanumericCount < 2) {
    return { valid: false, reason: 'missing-alphanumeric' };
  }

  return { valid: true, query, key: normalizeSearchKey(query) };
}
