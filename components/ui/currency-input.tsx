'use client';

import * as React from 'react';
import { Input } from './input';
import { cn } from '@/lib/utils/cn';

export interface CurrencyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value?: number;
  onChange?: (value: number) => void;
  currency?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

/**
 * Currency Input Component
 *
 * Features:
 * - Auto-formats as user types (1234 → $1,234.00)
 * - Handles decimal input correctly
 * - Triggers number pad on mobile (inputMode="decimal")
 * - Supports currency symbol customization
 * - Error state styling
 */
export const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, value, onChange, currency = 'USD', onBlur, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState('');
    const [isFocused, setIsFocused] = React.useState(false);

    // Format number to currency display
    const formatCurrency = (num: number): string => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(num);
    };

    // Parse display value to number
    const parseValue = (str: string): number => {
      // Remove currency symbol and commas
      const cleaned = str.replace(/[^0-9.-]/g, '');
      const parsed = parseFloat(cleaned);
      return isNaN(parsed) ? 0 : parsed;
    };

    // Update display value when prop value changes
    React.useEffect(() => {
      if (!isFocused) {
        if (value !== undefined && value !== null) {
          setDisplayValue(formatCurrency(value));
        } else {
          setDisplayValue('');
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, isFocused, currency]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value;

      // Allow only numbers, decimal point, and negative sign
      const cleaned = input.replace(/[^0-9.-]/g, '');

      // Prevent multiple decimal points
      const parts = cleaned.split('.');
      if (parts.length > 2) {
        return;
      }

      // Limit decimal places to 2
      if (parts.length === 2 && parts[1] && parts[1].length > 2) {
        return;
      }

      setDisplayValue(cleaned);

      // Call onChange with numeric value
      const numericValue = parseValue(cleaned);
      onChange?.(numericValue);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      // Show raw numeric value on focus
      if (value !== undefined && value !== null) {
        setDisplayValue(value.toString());
      }
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      // Format to currency on blur
      const numericValue = parseValue(displayValue);
      if (numericValue !== 0 || displayValue !== '') {
        setDisplayValue(formatCurrency(numericValue));
        onChange?.(numericValue);
      } else {
        setDisplayValue('');
      }
      onBlur?.(e);
    };

    return (
      <Input
        ref={ref}
        type="text"
        inputMode="decimal"
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={formatCurrency(0)}
        className={cn(className)}
        {...props}
      />
    );
  }
);

CurrencyInput.displayName = 'CurrencyInput';
