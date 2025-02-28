import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import ColorSpectrumSelector from '@/components/core/custom-page-themes/ColorSpectrumSelector';

describe('ColorSpectrumSelector', () => {
  const mockOnChange = jest.fn();
  const initialColor = '#FF0000';

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders with initial color', () => {
    render(
      <ColorSpectrumSelector
        initialColor={initialColor}
        onChange={mockOnChange}
        label="Test Color"
      />
    );

    const input = screen.getByTitle('Color hex value');
    expect(input).toHaveValue(initialColor);
  });

  it('displays label when provided', () => {
    const label = 'Test Color Label';
    render(
      <ColorSpectrumSelector
        initialColor={initialColor}
        onChange={mockOnChange}
        label={label}
      />
    );

    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it('updates color preview when hex input changes', () => {
    render(
      <ColorSpectrumSelector
        initialColor={initialColor}
        onChange={mockOnChange}
        label="Test Color"
      />
    );

    const input = screen.getByTitle('Color hex value');
    const preview = screen.getByTitle('Current color');

    fireEvent.change(input, { target: { value: '#00FF00' } });

    expect(preview).toHaveStyle({ backgroundColor: '#00FF00' });
  });

  it('validates hex input format', () => {
    render(
      <ColorSpectrumSelector
        initialColor={initialColor}
        onChange={mockOnChange}
        label="Test Color"
      />
    );

    const input = screen.getByTitle('Color hex value');

    // Valid hex input
    fireEvent.change(input, { target: { value: '#123456' } });
    expect(mockOnChange).toHaveBeenCalledWith('#123456');

    // Invalid hex input should not trigger onChange
    fireEvent.change(input, { target: { value: 'invalid' } });
    expect(mockOnChange).toHaveBeenCalledTimes(1); // Still only called once from valid input
  });

  it('debounces color changes', () => {
    jest.useFakeTimers();

    render(
      <ColorSpectrumSelector
        initialColor={initialColor}
        onChange={mockOnChange}
        label="Test Color"
      />
    );

    const input = screen.getByTitle('Color hex value');

    // Rapid changes
    fireEvent.change(input, { target: { value: '#111111' } });
    fireEvent.change(input, { target: { value: '#222222' } });
    fireEvent.change(input, { target: { value: '#333333' } });

    expect(mockOnChange).not.toHaveBeenCalled();

    // Fast forward debounce timer
    jest.runAllTimers();

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith('#333333');

    jest.useRealTimers();
  });
});
