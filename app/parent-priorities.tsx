import { Button } from 'heroui-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { JourneyScreen, OptionGrid, QuestionCard } from '@/components/guidance/JourneyUI';
import { getParentQuestions } from '@/lib/guidanceData';
import { useGuidanceStore } from '@/lib/guidanceStore';
import { routes } from '@/lib/routes';

export default function ParentPrioritiesScreen() {
  const { t } = useTranslation();
  const parent = useGuidanceStore((state) => state.profile.parent);
  const setParentField = useGuidanceStore((state) => state.setParentField);
  const setProfileField = useGuidanceStore((state) => state.setProfileField);
  const parentQuestions = getParentQuestions();

  const valueFor = (key: keyof typeof parent) =>
    key === 'commute' ? (parent.commute === null ? '' : String(parent.commute)) : parent[key];
  const update = (key: keyof typeof parent, value: string) => {
    if (key === 'commute') {
      const minutes = Number(value);
      setParentField('commute', minutes);
      setProfileField('maxTravelMinutes', minutes);
    } else setParentField(key, value);
  };

  return (
    <JourneyScreen
      eyebrow={t('parent.eyebrow')}
      title={t('parent.title')}
      description={t('parent.description')}
      footer={
        <Button variant="primary" onPress={() => router.push(routes.profile)}>
          <Button.Label>{t('parent.continue')}</Button.Label>
        </Button>
      }
    >
      {parentQuestions.map((question, index) => (
        <QuestionCard
          key={question.key}
          index={index + 1}
          title={question.title}
          helper={question.helper}
        >
          <OptionGrid
            options={question.options}
            value={valueFor(question.key)}
            onChange={(value) => update(question.key, value)}
          />
        </QuestionCard>
      ))}
    </JourneyScreen>
  );
}
