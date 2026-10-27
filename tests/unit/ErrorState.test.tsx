import { fireEvent, render, screen } from '@testing-library/react';
import ErrorState from '../../src/components/states/ErrorState';

describe('ErrorState', () => {
  it('announces the error and invokes manual retry', () => {
    const onRetry = vi.fn();
    render(<ErrorState message="Falha de rede." onRetry={onRetry} />);

    expect(screen.getByRole('alert')).toHaveTextContent('Falha de rede.');
    fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }));
    expect(onRetry).toHaveBeenCalledOnce();
  });
});
