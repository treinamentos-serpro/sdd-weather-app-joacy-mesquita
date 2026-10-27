import { fireEvent, render, screen } from '@testing-library/react';
import App from '../../src/App';

describe('Weather App mock flow', () => {
  it('renders the empty state and accessible search on initial load', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Tempo local' })).toBeInTheDocument();
    expect(screen.getByRole('search', { name: 'Buscar cidade' })).toBeInTheDocument();
    expect(screen.getByRole('searchbox', { name: 'Nome da cidade' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Buscar' })).toBeDisabled();
    expect(screen.getByRole('heading', { name: 'Clima local à sua espera' })).toBeInTheDocument();
  });

  it('loads the sample city and derives Fahrenheit during rendering', async () => {
    render(<App />);

    fireEvent.change(screen.getByRole('searchbox', { name: 'Nome da cidade' }), {
      target: { value: '  São Paulo  ' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(await screen.findByRole('heading', { name: 'São Paulo' })).toBeInTheDocument();
    expect(screen.getByText('22 °C')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(5);

    fireEvent.click(screen.getByRole('button', { name: '°F' }));

    expect(screen.getByText('72 °F')).toBeInTheDocument();
  });

  it('shows empty and error states from the local mock service', async () => {
    const { rerender } = render(<App />);
    const input = screen.getByRole('searchbox', { name: 'Nome da cidade' });

    fireEvent.change(input, { target: { value: 'Rio de Janeiro' } });
    fireEvent.click(screen.getByRole('button', { name: 'Buscar' }));
    expect(
      await screen.findByRole('heading', { name: 'Cidade não encontrada' }),
    ).toBeInTheDocument();

    rerender(<App />);
    fireEvent.change(screen.getByRole('searchbox', { name: 'Nome da cidade' }), {
      target: { value: 'falha' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Buscar' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível consultar os dados meteorológicos.',
    );
  });
});
