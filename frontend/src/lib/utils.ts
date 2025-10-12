import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format large numbers with K/M/B suffixes for better readability
 * @param num - The number to format
 * @param precision - Number of decimal places (default: 1)
 * @returns Formatted string (e.g., 1000 -> "1K", 1500 -> "1.5K")
 */
export function formatNumber(num: number, precision: number = 1): string {
  if (num < 1000) {
    return num.toString();
  }

  const units = [
    { value: 1e12, suffix: 'T' }, // Trillion
    { value: 1e9, suffix: 'B' }, // Billion
    { value: 1e6, suffix: 'M' }, // Million
    { value: 1e3, suffix: 'K' }, // Thousand
  ];

  for (const unit of units) {
    if (num >= unit.value) {
      const formatted = (num / unit.value).toFixed(precision);
      // Remove trailing zeros and decimal point if not needed
      return parseFloat(formatted).toString() + unit.suffix;
    }
  }

  return num.toString();
}

/**
 * Format vote counts with proper pluralization
 * @param count - Number of votes
 * @param showZero - Whether to show "0 votes" or "No votes" (default: false)
 * @returns Formatted string (e.g., "1 vote", "1.2K votes")
 */
export function formatVoteCount(count: number, showZero: boolean = false): string {
  if (count === 0 && !showZero) {
    return 'No votes';
  }

  const formattedNumber = formatNumber(count);
  return `${formattedNumber} ${count === 1 ? 'vote' : 'votes'}`;
}

/**
 * Format percentage with proper rounding
 * @param value - The percentage value (0-100)
 * @param precision - Number of decimal places (default: 1)
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, precision: number = 1): string {
  if (value === 0) return '0%';
  if (value < 0.1 && precision >= 1) return '<0.1%';
  return `${value.toFixed(precision)}%`;
}
