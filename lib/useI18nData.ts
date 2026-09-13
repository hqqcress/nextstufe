import { useTranslation } from 'react-i18next';

import type { RecommendedSchool } from '@/lib/berlinSchools';

export function useI18nData() {
  const { t } = useTranslation();

  function recommendedSchoolText(school: RecommendedSchool) {
    const category = school.schoolType || school.schoolCategory;
    const homePostcode = school.matches[1]?.match(/as (\d{5})\.$/)?.[1];
    const translatedQuestions = t(`recommendation.questions.${school.pathwayId}`, {
      returnObjects: true,
    });
    const questions = Array.isArray(translatedQuestions)
      ? translatedQuestions.filter((question): question is string => typeof question === 'string')
      : [];

    return {
      programme: t(`recommendation.programme.${school.pathwayId}`),
      sourceDate: school.schoolYear
        ? t('recommendation.sourceYear', { year: school.schoolYear })
        : t('recommendation.source'),
      matches: [
        t('recommendation.classified', { category }),
        homePostcode
          ? t('recommendation.samePostcode', { postcode: homePostcode })
          : t('recommendation.proximity'),
      ],
      mismatches: [t('recommendation.limitation')],
      missingInformation: questions,
    };
  }

  return { recommendedSchoolText };
}
