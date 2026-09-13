import { Button, Card, Typography } from 'heroui-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { JourneyScreen } from '@/components/guidance/JourneyUI';
import { answerLabel } from '@/lib/guidanceData';
import { useGuidanceStore } from '@/lib/guidanceStore';
import { routes } from '@/lib/routes';

function ProfileChip({ label, kind }: { label: string; kind: 'student' | 'parent' }) {
  return (
    <View
      className={
        kind === 'student'
          ? 'bg-accent-soft rounded-full px-3 py-2'
          : 'bg-warning-soft rounded-full px-3 py-2'
      }
    >
      <Typography.Paragraph type="body-sm" className="font-medium">
        {label}
      </Typography.Paragraph>
    </View>
  );
}

export default function ProfileScreen() {
  const { t } = useTranslation();
  const profile = useGuidanceStore((state) => state.profile);
  const studentChips = Object.entries(profile.student)
    .filter(([, value]) => Boolean(value))
    .map(([key, value]) => answerLabel('student', key, value));
  const parentChips = [
    profile.parent.optionsOpen
      ? answerLabel('parent', 'optionsOpen', profile.parent.optionsOpen)
      : '',
    profile.parent.commute === null
      ? ''
      : t('common.commuteMinutes', { count: profile.parent.commute }),
    profile.parent.focus ? answerLabel('parent', 'focus', profile.parent.focus) : '',
    profile.parent.support ? answerLabel('parent', 'support', profile.parent.support) : '',
    profile.parent.hope ? answerLabel('parent', 'hope', profile.parent.hope) : '',
  ].filter(Boolean);
  const agree =
    studentChips.length === 0 || parentChips.length === 0
      ? t('profile.incompleteAgree')
      : profile.student.direction === 'open' || profile.parent.optionsOpen === 'very'
        ? t('profile.openAgree')
        : t('profile.purposeAgree');
  const discuss =
    studentChips.length === 0 || parentChips.length === 0
      ? t('profile.incompleteDiscuss')
      : profile.student.avoid === 'commute' && profile.parent.commute !== null
        ? t('profile.commuteDiscuss', { minutes: profile.parent.commute })
        : t('profile.broadDiscuss');

  return (
    <JourneyScreen
      eyebrow={t('profile.eyebrow')}
      title={
        profile.studentName.trim()
          ? t('profile.titleNamed', { name: profile.studentName.trim() })
          : t('profile.title')
      }
      description={t('profile.description')}
      footer={
        <Button variant="primary" onPress={() => router.push(routes.pathways)}>
          <Button.Label>{t('profile.seePathways')}</Button.Label>
        </Button>
      }
    >
      <Card className="border-border bg-surface border">
        <Card.Body className="gap-4 p-5">
          <Typography.Heading type="h4">
            {profile.studentName.trim()
              ? t('profile.studentNamed', { name: profile.studentName.trim() })
              : t('profile.student')}
          </Typography.Heading>
          <View className="flex-row flex-wrap gap-2">
            {studentChips.length > 0 ? (
              studentChips.map((chip) => <ProfileChip key={chip} label={chip} kind="student" />)
            ) : (
              <Typography.Paragraph type="body-sm" color="muted">
                {t('profile.answerPrompts')}
              </Typography.Paragraph>
            )}
          </View>
        </Card.Body>
      </Card>
      <Card className="border-border bg-surface border">
        <Card.Body className="gap-4 p-5">
          <Typography.Heading type="h4">{t('profile.parent')}</Typography.Heading>
          <View className="flex-row flex-wrap gap-2">
            {parentChips.length > 0 ? (
              parentChips.map((chip) => <ProfileChip key={chip} label={chip} kind="parent" />)
            ) : (
              <Typography.Paragraph type="body-sm" color="muted">
                {t('profile.answerParentPrompts')}
              </Typography.Paragraph>
            )}
          </View>
        </Card.Body>
      </Card>
      <View className="bg-background-secondary gap-3 rounded-2xl p-5">
        <Typography.Heading type="h4">{t('profile.agreeTitle')}</Typography.Heading>
        <Typography.Paragraph>{agree}</Typography.Paragraph>
        <Typography.Heading type="h4" className="mt-2">
          {t('profile.discussTitle')}
        </Typography.Heading>
        <Typography.Paragraph>{discuss}</Typography.Paragraph>
      </View>
      <Button
        variant="ghost"
        onPress={() => router.push(routes.student)}
        className="border-border border"
      >
        <Button.Label>{t('profile.edit')}</Button.Label>
      </Button>
    </JourneyScreen>
  );
}
