export const defaultLocale = 'en' as const;
export const locales = ['en', 'fr'] as const;
export type Locale = (typeof locales)[number];

// Currency formatting for XAF
export const formatCurrency = (amount: number, locale: Locale = 'en'): string => {
  return new Intl.NumberFormat(locale === 'fr' ? 'fr-CM' : 'en-CM', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Number formatting
export const formatNumber = (number: number, locale: Locale = 'en'): string => {
  return new Intl.NumberFormat(locale === 'fr' ? 'fr-CM' : 'en-CM').format(number);
};

// Date formatting
export const formatDate = (date: Date | string, locale: Locale = 'en'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale === 'fr' ? 'fr-CM' : 'en-CM', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
};

// Relative time formatting
export const formatRelativeTime = (date: Date | string, locale: Locale = 'en'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  const rtf = new Intl.RelativeTimeFormat(locale === 'fr' ? 'fr-CM' : 'en-CM', {
    numeric: 'auto',
  });

  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, 'second');
  } else if (diffInSeconds < 3600) {
    return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
  } else if (diffInSeconds < 86400) {
    return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
  } else if (diffInSeconds < 2592000) {
    return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
  } else if (diffInSeconds < 31536000) {
    return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month');
  } else {
    return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year');
  }
};
