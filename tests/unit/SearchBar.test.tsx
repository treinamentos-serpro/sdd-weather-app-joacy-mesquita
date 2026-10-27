import { fireEvent, render, screen } from '@testing-library/react';
import SearchBar from '../../src/components/SearchBar';

describe('SearchBar', () => {
  it('trims the query and does not submit an empty value', () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    const input = screen.getByRole('searchbox', { name: 'Nome da cidade' });
    const form = screen.getByRole('search', { name: 'Buscar cidade' });
    const button = screen.getByRole('button', { name: 'Buscar' });

    expect(button).toBeDisabled();
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.submit(form);
    expect(onSearch).not.toHaveBeenCalled();

    fireEvent.change(input, { target: { value: '  São Paulo  ' } });
    fireEvent.click(button);
    expect(onSearch).toHaveBeenCalledWith('São Paulo');
  });

  it('disables the input and submit button when disabled', () => {
    render(<SearchBar onSearch={vi.fn()} disabled />);

    expect(screen.getByRole('searchbox', { name: 'Nome da cidade' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Buscar' })).toBeDisabled();
    expect(screen.getByRole('status')).toHaveTextContent(
      'Aguarde a consulta da cidade selecionada.',
    );
  });
});
