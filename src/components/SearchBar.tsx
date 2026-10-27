import { useState } from 'react';

interface SearchBarProps {
  onSearch: (city: string) => void;
  disabled?: boolean;
}

export default function SearchBar({ onSearch, disabled = false }: SearchBarProps) {
  const [city, setCity] = useState('');

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedCity = city.trim();

    if (!trimmedCity || disabled) {
      return;
    }

    onSearch(trimmedCity);
  }

  return (
    <form role="search" aria-label="Buscar cidade" onSubmit={handleSubmit} className="w-full">
      <label htmlFor="city-search" className="mb-2 block text-sm font-medium text-slate-300">
        Nome da cidade
      </label>
      <div className="flex gap-2">
        <input
          id="city-search"
          type="search"
          value={city}
          onChange={(event) => setCity(event.currentTarget.value)}
          placeholder="Digite uma cidade"
          autoComplete="off"
          disabled={disabled}
          aria-describedby="city-search-status"
          className="min-w-0 flex-1 rounded-xl border border-white/10 bg-night-800 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/40"
        />
        <button
          type="submit"
          disabled={disabled || city.trim().length === 0}
          className="rounded-xl bg-accent-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Buscar
        </button>
      </div>
      <p id="city-search-status" className="mt-3 text-xs leading-5 text-slate-400" role="status">
        {disabled
          ? 'Aguarde a consulta da cidade selecionada.'
          : 'Digite uma cidade e pressione Enter para buscar.'}
      </p>
    </form>
  );
}
