import { Button } from 'heroui-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { JourneyScreen, OptionGrid, QuestionCard } from '@/components/guidance/JourneyUI';
import { getStudentQuestions } from '@/lib/guidanceData';
import { useGuidanceStore } from '@/lib/guidanceStore';
import { routes } from '@/lib/routes';

export default function StudentPrioritiesScreen() {
  const { t } = useTranslation();
  const student = useGuidanceStore((state) => state.profile.student);
  const storedStudentName = useGuidanceStore((state) => state.profile.studentName);
  const studentName = storedStudentName.trim();
  const setStudentField = useGuidanceStore((state) => state.setStudentField);
  const studentQuestions = getStudentQuestions();

  return (
    <JourneyScreen
      eyebrow={t('student.eyebrow')}
      title={studentName ? t('student.titleNamed', { name: studentName }) : t('student.title')}
      description={
        studentName
          ? t('student.descriptionNamed', { name: studentName })
          : t('student.description')
      }
      footer={
        <Button variant="primary" onPress={() => router.push(routes.parent)}>
          <Button.Label>{t('student.continue')}</Button.Label>
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
