'use client';

import { useEffect, useState } from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { ko, enUS } from 'date-fns/locale';

interface LocalizedDateProps {
  date: Date | string | number;
  relative?: boolean;
  dateFormat?: string;
  className?: string;
}

export default function LocalizedDate({ date, relative = true, dateFormat = 'PPp', className = '' }: LocalizedDateProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Avoid hydration mismatch by rendering a placeholder or empty string during SSR
    return <span className={className}>...</span>;
  }

  const parsedDate = new Date(date);
  
  // Basic i18n for date formatting (can be extended to use user context later)
  const userLocale = typeof window !== 'undefined' && window.navigator.language.startsWith('ko') ? ko : enUS;

  if (relative) {
    return (
      <span className={className} title={format(parsedDate, dateFormat, { locale: userLocale })}>
        {formatDistanceToNow(parsedDate, { addSuffix: true, locale: userLocale })}
      </span>
    );
  }

  return <span className={className}>{format(parsedDate, dateFormat, { locale: userLocale })}</span>;
}
