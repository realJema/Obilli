"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider, useTheme as useNextTheme } from "next-themes";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { Locale, defaultLocale, formatCurrency, formatDate, formatRelativeTime } from "./i18n/config";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

// Import translation files
import enStrings from "./i18n/strings.en.json";
import frStrings from "./i18n/strings.fr.json";

const translations = {
  en: enStrings,
  fr: frStrings,
};

// Create a client
const queryClient = new QueryClient()

// I18n Context
interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  formatCurrency: (amount: number) => string;
  formatDate: (date: Date | string) => string;
  formatRelativeTime: (date: Date | string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
};

function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>(defaultLocale);

  useEffect(() => {
    const stored = localStorage.getItem("locale") as Locale;
    if (stored && (stored === "en" || stored === "fr")) {
      setLocale(stored);
    }
  }, []);

  const changeLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem("locale", newLocale);
  };

  const t = (key: string) => {
    const keys = key.split(".");
    let value: unknown = translations[locale];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && value !== null && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        value = undefined;
        break;
      }
    }
    
    return (typeof value === 'string' ? value : key);
  };

  return (
    <I18nContext.Provider value={{ 
      locale, 
      setLocale: changeLocale, 
      t,
      formatCurrency: (amount: number) => formatCurrency(amount, locale),
      formatDate: (date: Date | string) => formatDate(date, locale),
      formatRelativeTime: (date: Date | string) => formatRelativeTime(date, locale)
    }}>
      {children}
    </I18nContext.Provider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [supabaseClient] = useState(() =>
    createClientComponentClient({
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    })
  );

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={null}
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <I18nProvider>
            {children}
          </I18nProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </SessionContextProvider>
  );
}

// Theme hook for convenience
export const useTheme = () => {
  // Re-export from next-themes but with better typing
  const { theme, setTheme, systemTheme } = useNextTheme();
  return { theme, setTheme, systemTheme };
};