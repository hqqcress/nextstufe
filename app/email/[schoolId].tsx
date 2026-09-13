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
import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

import { useBerlinSchoolDirectory } from '@/hooks/useBerlinSchoolDirectory';
import { getSchoolPathway, toRecommendedSchool, type RecommendedSchool } from '@/lib/berlinSchools';
import { useGuidanceStore } from '@/lib/guidanceStore';
import { routes } from '@/lib/routes';

function buildDraft(school: RecommendedSchool, studentName: string) {
  return {
    subject: `Questions about transition options at ${school.name}`,
    body: `Dear ${school.name} team,\n\nWe are exploring options after Grade 10 for ${studentName || 'our child'} and found your school in the official Berlin school directory.\n\nCould you please tell us:\n\n${school.missingInformation.map((item) => `- ${item}`).join('\n')}\n\nWe understand that the directory listing does not confirm programme availability or admission.\n\nKind regards`,
  };
}

export default function EmailDraftScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ schoolId?: string }>();
  const profile = useGuidanceStore((state) => state.profile);
  const selectedPathwayId = useGuidanceStore((state) => state.selectedPathwayId);
  const { schools, status, retry } = useBerlinSchoolDirectory();
  const schoolRecord = schools.find((item) => item.id === params.schoolId);
  const pathwayId = schoolRecord
    ? (selectedPathwayId ?? getSchoolPathway(schoolRecord))
    : undefined;
  const school =
    schoolRecord && pathwayId ? toRecommendedSchool(schoolRecord, pathwayId, profile) : undefined;

  if (status === 'loading') {
    return (
      <View className="bg-background flex-1 items-center justify-center gap-3 p-6">
        <Spinner />
        <Typography.Paragraph color="muted">Loading the selected school…</Typography.Paragraph>
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View className="bg-background flex-1 items-center justify-center gap-4 p-6">
        <Typography.Heading type="h3" className="text-center">
          The official school directory is unavailable
        </Typography.Heading>
        <Button onPress={retry}>
          <Button.Label>Try again</Button.Label>
        </Button>
      </View>
    );
  }

  if (!school) {
    return (
      <View className="bg-background flex-1 items-center justify-center gap-4 p-6">
        <Typography.Heading type="h3">School not found</Typography.Heading>
        <Typography.Paragraph color="muted" className="text-center">
          Choose a school from the official recommendation list before drafting an email.
        </Typography.Paragraph>
        <Button onPress={() => router.replace(routes.pathways)}>
          <Button.Label>Back to pathways</Button.Label>
        </Button>
      </View>
    );
  }

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
  const initial = useMemo(() => buildDraft(school, studentName), [school, studentName]);
  const [subject, setSubject] = useState(initial.subject);
  const [body, setBody] = useState(initial.body);
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
          Step 5 of 5
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
            Editable template
          </Typography.Paragraph>
          <Typography.Heading type="h1">Ask {school.name}</Typography.Heading>
          <Typography.Paragraph color="muted">
            Edit this before sending. The questions focus on facts that the public directory cannot
            confirm.
          </Typography.Paragraph>
        </View>
        <Card>
          <Card.Body className="gap-4 p-5">
            <TextField isRequired>
              <Label>Subject</Label>
              <Input value={subject} onChangeText={setSubject} />
            </TextField>
            <TextField isRequired>
              <Label>Message</Label>
              <TextArea value={body} onChangeText={setBody} className="min-h-80" />
            </TextField>
          </Card.Body>
        </Card>
        <Card className="bg-warning-soft">
          <Card.Body className="p-4">
            <Typography.Paragraph className="text-warning-soft-foreground">
              The app does not send emails. Copy the draft and send it using your preferred email
              app after checking the wording.
            </Typography.Paragraph>
          </Card.Body>
        </Card>
        <View className="flex-row gap-3">
          <Button
            variant="ghost"
            className="border-border flex-1 border"
            onPress={() => void copyDraft()}
          >
            <Button.Label>{copied ? 'Copied' : 'Copy draft'}</Button.Label>
          </Button>
          <Button className="flex-1" onPress={onContinue}>
            <Button.Label>Build action plan</Button.Label>
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
