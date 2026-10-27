import { fireEvent, render, screen } from '@testing-library/react';
import UnitToggle from '../../src/components/UnitToggle';

describe('UnitToggle', () => {
  it('announces the selected unit and emits changes', () => {
    const onChange = vi.fn();
    render(<UnitToggle unit="celsius" onChange={onChange} />);

    expect(screen.getByRole('button', { name: '°C' })).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(screen.getByRole('button', { name: '°F' }));
    expect(onChange).toHaveBeenCalledWith('fahrenheit');
  });
});
