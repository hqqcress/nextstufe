import { Button } from 'heroui-native';
import { router } from 'expo-router';

import { JourneyScreen, OptionGrid, QuestionCard } from '@/components/guidance/JourneyUI';
import { parentQuestions } from '@/lib/guidanceData';
import { useGuidanceStore } from '@/lib/guidanceStore';
import { routes } from '@/lib/routes';

export default function ParentPrioritiesScreen() {
  const parent = useGuidanceStore((state) => state.profile.parent);
  const setParentField = useGuidanceStore((state) => state.setParentField);
  const setProfileField = useGuidanceStore((state) => state.setProfileField);

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
      eyebrow="Step 3 of 4"
      title="Parent priorities"
      description="Add the practical hopes and limits that should be visible in the comparison."
      footer={
        <Button variant="primary" onPress={() => router.push(routes.profile)}>
          <Button.Label>Build shared profile</Button.Label>
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
