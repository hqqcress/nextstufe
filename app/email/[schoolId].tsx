import {
  Button,
  Card,
  Input,
  Label,
  Spinner,
  TextArea,
  TextField,
  Typography,
} from 'heroui-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

import { useBerlinSchoolDirectory } from '@/hooks/useBerlinSchoolDirectory';
import { getSchoolPathway, toRecommendedSchool, type RecommendedSchool } from '@/lib/berlinSchools';
import { useGuidanceStore } from '@/lib/guidanceStore';
import { routes } from '@/lib/routes';
import { useI18nData } from '@/lib/useI18nData';

export default function EmailDraftScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{ schoolId?: string }>();
  const profile = useGuidanceStore((state) => state.profile);
  const selectedPathwayId = useGuidanceStore((state) => state.selectedPathwayId);
  const { schools, status, retry } = useBerlinSchoolDirectory();
  const record = schools.find((item) => item.id === params.schoolId);
  const pathwayId = record ? (selectedPathwayId ?? getSchoolPathway(record)) : undefined;
  const school = record && pathwayId ? toRecommendedSchool(record, pathwayId, profile) : undefined;
  if (status === 'loading')
    return (
      <View className="bg-background flex-1 items-center justify-center gap-3 p-6">
        <Spinner />
        <Typography.Paragraph color="muted">{t('email.loading')}</Typography.Paragraph>
      </View>
    );
  if (status === 'error')
    return (
      <View className="bg-background flex-1 items-center justify-center gap-4 p-6">
        <Typography.Heading type="h3" className="text-center">
          {t('common.directoryUnavailable')}
        </Typography.Heading>
        <Button onPress={retry}>
          <Button.Label>{t('common.tryAgain')}</Button.Label>
        </Button>
      </View>
    );
  if (!school)
    return (
      <View className="bg-background flex-1 items-center justify-center gap-4 p-6">
        <Typography.Heading type="h3">{t('common.schoolNotFound')}</Typography.Heading>
        <Typography.Paragraph color="muted" className="text-center">
          {t('email.notFoundText')}
        </Typography.Paragraph>
        <Button onPress={() => router.replace(routes.pathways)}>
          <Button.Label>{t('common.backToPathways')}</Button.Label>
        </Button>
      </View>
    );
  return (
    <EmailComposer
      school={school}
      studentName={profile.studentName}
      onContinue={() => router.push(routes.plan)}
    />
  );
}

function EmailComposer({
  school,
  studentName,
  onContinue,
}: {
  school: RecommendedSchool;
  studentName: string;
  onContinue: () => void;
}) {
  const { t } = useTranslation();
  const { t: germanT } = useTranslation(undefined, { lng: 'de' });
  const { recommendedSchoolText } = useI18nData();
  const questions = recommendedSchoolText(school, 'de')
    .missingInformation.map((item) => `- ${item}`)
    .join('\n');
  const draft = {
    subject: germanT('email.subject', { school: school.name }),
    body: germanT('email.body', {
      school: school.name,
      student: studentName || germanT('email.child'),
      questions,
    }),
  };
  const [subject, setSubject] = useState(draft.subject);
  const [body, setBody] = useState(draft.body);
  const [copied, setCopied] = useState(false);
  async function copyDraft() {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(`${subject}\n\n${body}`);
      setCopied(true);
    }
  }
  return (
    <KeyboardAvoidingView
      className="bg-background flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View className="border-border bg-background pt-safe-or-4 border-b px-6 pb-4">
        <Typography.Paragraph type="body-sm" color="muted">
          {t('email.step')}
        </Typography.Paragraph>
      </View>
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-5 px-6 py-6 pb-36"
        keyboardShouldPersistTaps="handled"
      >
        <View className="gap-2">
          <Typography.Paragraph
            type="body-sm"
            className="text-accent font-semibold tracking-widest uppercase"
          >
            {t('email.eyebrow')}
          </Typography.Paragraph>
          <Typography.Heading type="h1">
            {t('email.title', { school: school.name })}
          </Typography.Heading>
          <Typography.Paragraph color="muted">{t('email.description')}</Typography.Paragraph>
        </View>
        <Card>
          <Card.Body className="gap-4 p-5">
            <TextField isRequired>
              <Label>{t('email.subjectLabel')}</Label>
              <Input value={subject} onChangeText={setSubject} />
            </TextField>
            <TextField isRequired>
              <Label>{t('email.messageLabel')}</Label>
              <TextArea value={body} onChangeText={setBody} className="min-h-80" />
            </TextField>
          </Card.Body>
        </Card>
        <Card className="bg-warning-soft">
          <Card.Body className="p-4">
            <Typography.Paragraph className="text-warning-soft-foreground">
              {t('email.warning')}
            </Typography.Paragraph>
          </Card.Body>
        </Card>
        <View className="flex-row gap-3">
          <Button
            variant="ghost"
            className="border-border flex-1 border"
            onPress={() => void copyDraft()}
          >
            <Button.Label>{t(copied ? 'email.copied' : 'email.copy')}</Button.Label>
          </Button>
          <Button className="flex-1" onPress={onContinue}>
            <Button.Label>{t('email.actionPlan')}</Button.Label>
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
