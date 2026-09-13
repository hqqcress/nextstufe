import { useTranslation } from 'react-i18next';

import type { RecommendedSchool } from '@/lib/berlinSchools';
import i18n, { type AppLanguage } from '@/lib/i18n';

export function useI18nData() {
  const { t } = useTranslation();

  function recommendedSchoolText(school: RecommendedSchool, language?: AppLanguage) {
    const translate = language ? i18n.getFixedT(language) : t;
    const category = school.schoolType || school.schoolCategory;
    const homePostcode = school.matches[1]?.match(/as (\d{5})\.$/)?.[1];
    const translatedQuestions = translate(`recommendation.questions.${school.pathwayId}`, {
      returnObjects: true,
    });
    const questions = Array.isArray(translatedQuestions)
      ? translatedQuestions.filter((question): question is string => typeof question === 'string')
      : [];

    return {
      programme: translate(`recommendation.programme.${school.pathwayId}`),
      sourceDate: school.schoolYear
        ? translate('recommendation.sourceYear', { year: school.schoolYear })
        : translate('recommendation.source'),
      matches: [
        translate('recommendation.classified', { category }),
        homePostcode
          ? translate('recommendation.samePostcode', { postcode: homePostcode })
          : translate('recommendation.proximity'),
      ],
      mismatches: [translate('recommendation.limitation')],
      missingInformation: questions,
    };
  }

  return { recommendedSchoolText };
}
