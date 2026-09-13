import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { hydrateLanguage, setAppLanguage, type AppLanguage } from '@/lib/i18n';

const changeLanguage = (nextLanguage: AppLanguage) => setAppLanguage(nextLanguage);

export function useAppLanguage() {
  const { i18n } = useTranslation();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let active = true;
    void hydrateLanguage().finally(() => {
      if (active) setIsReady(true);
    });
    return () => {
      active = false;
    };
  }, []);

  const language: AppLanguage = i18n.resolvedLanguage === 'de' ? 'de' : 'en';

  return { language, changeLanguage, isReady };
}
