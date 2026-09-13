import { Button } from 'heroui-native';
import { router } from 'expo-router';

import { JourneyScreen, OptionGrid, QuestionCard } from '@/components/guidance/JourneyUI';
import { studentQuestions } from '@/lib/guidanceData';
import { useGuidanceStore } from '@/lib/guidanceStore';
import { routes } from '@/lib/routes';

export default function StudentPrioritiesScreen() {
  const student = useGuidanceStore((state) => state.profile.student);
  const storedStudentName = useGuidanceStore((state) => state.profile.studentName);
  const studentName = storedStudentName.trim();
  const setStudentField = useGuidanceStore((state) => state.setStudentField);

  return (
    <JourneyScreen
      eyebrow="Step 2 of 4"
      title={studentName ? `${studentName}’s priorities` : 'Student priorities'}
      description={`Five quick choices${studentName ? ` for ${studentName}` : ''}. Pick what feels closest today; this is not a permanent decision.`}
      footer={
        <Button variant="primary" onPress={() => router.push(routes.parent)}>
          <Button.Label>Continue to parent priorities</Button.Label>
        </Button>
      }
    >
      {studentQuestions.map((question, index) => (
        <QuestionCard
          key={question.key}
          index={index + 1}
          title={question.title}
          helper={question.helper}
        >
          <OptionGrid
            options={question.options}
            value={student[question.key]}
            onChange={(value) => setStudentField(question.key, value)}
          />
        </QuestionCard>
      ))}
    </JourneyScreen>
  );
}
