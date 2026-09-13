import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { Button, Input, Label, TextArea, TextField, Typography } from 'heroui-native';
import * as Clipboard from 'expo-clipboard';
import { router, useLocalSearchParams } from 'expo-router';

import { JourneyScreen } from '@/components/guidance/JourneyUI';
import { schools } from '@/lib/guidanceData';
import { routes } from '@/lib/routes';

export default function EmailDraftScreen() {
  const params = useLocalSearchParams<{ schoolId?: string | string[] }>();
  const schoolId = Array.isArray(params.schoolId) ? params.schoolId[0] : params.schoolId;
  const school = schools.find((item) => item.id === schoolId);
  const initial = useMemo(
    () =>
      school
        ? {
            subject: `Fragen zum Bildungsgang ${school.programme}`,
            body: `Sehr geehrte Damen und Herren,\n\nmeine Tochter / mein Sohn interessiert sich für den Bildungsgang „${school.programme}“ an Ihrer Schule.\n\nDazu haben wir zwei Fragen:\n1. ${school.missingInformation[0]}\n2. ${school.missingInformation[1]}\n\nKönnten Sie uns bitte auch mitteilen, ob ein Beratungsgespräch oder Tag der offenen Tür geplant ist und welche Unterlagen für die Bewerbung benötigt werden?\n\nVielen Dank für Ihre Unterstützung.\n\nMit freundlichen Grüßen\n[Name]`,
          }
        : { subject: '', body: '' },
    [school],
  );
  const [subject, setSubject] = useState(initial.subject);
  const [body, setBody] = useState(initial.body);
  const [copied, setCopied] = useState(false);

  if (!school)
    return (
      <JourneyScreen
        title="Draft unavailable"
        description="The school record needed for this email is missing."
      >
        <Button variant="primary" onPress={() => router.replace(routes.pathways)}>
          <Button.Label>Back to pathways</Button.Label>
        </Button>
      </JourneyScreen>
    );

  const copy = async () => {
    await Clipboard.setStringAsync(`Betreff: ${subject}\n\n${body}`);
    setCopied(true);
  };

  return (
    <JourneyScreen
      eyebrow="Editable German draft"
      title="Ask the school directly"
      description="This draft uses only questions from the demo school record. Edit names and details before sending."
    >
      <View className="border-border bg-surface gap-5 rounded-2xl border p-5">
        <TextField>
          <Label>Subject</Label>
          <Input value={subject} onChangeText={setSubject} />
        </TextField>
        <TextField>
          <Label>Email</Label>
          <TextArea value={body} onChangeText={setBody} className="min-h-80" />
        </TextField>
      </View>
      {copied ? (
        <Typography.Paragraph className="text-success font-medium">
          Email copied to clipboard.
        </Typography.Paragraph>
      ) : null}
      <Button variant="primary" onPress={() => void copy()}>
        <Button.Label>Copy email</Button.Label>
      </Button>
      <Button
        variant="ghost"
        onPress={() => router.replace(routes.school(school.id))}
        className="border-border border"
      >
        <Button.Label>Back to school</Button.Label>
      </Button>
      <Button variant="ghost" onPress={() => router.push(routes.plan)}>
        <Button.Label>Continue to action plan</Button.Label>
      </Button>
    </JourneyScreen>
  );
}
