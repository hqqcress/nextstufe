import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { Button, Card, Input, Label, TextField, Typography } from 'heroui-native';
import { router } from 'expo-router';
import { Compass, ShieldCheck } from 'lucide-react-native';
import { useThemeColor } from 'heroui-native';

import { useGuidanceStore } from '@/lib/guidanceStore';
import { routes } from '@/lib/routes';

export default function Home() {
  const profile = useGuidanceStore((state) => state.profile);
  const setProfileField = useGuidanceStore((state) => state.setProfileField);
  const [accent] = useThemeColor(['accent']);
  const studentName = profile.studentName.trim();

  return (
    <KeyboardAvoidingView
      className="bg-background flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerClassName="min-h-full px-5 pb-safe-or-5 pt-safe-or-8"
        keyboardShouldPersistTaps="handled"
      >
        <View className="mx-auto min-h-full w-full max-w-3xl flex-1 justify-between gap-8">
          <View className="gap-7 pt-8">
            <View className="bg-accent-soft h-14 w-14 items-center justify-center rounded-2xl">
              <Compass color={accent} size={28} />
            </View>
            <View className="gap-3">
              <Typography.Paragraph
                className="text-accent font-semibold tracking-widest uppercase"
                type="body-sm"
              >
                Berlin school pathway guide
              </Typography.Paragraph>
              <Typography.Heading type="h1">
                {studentName
                  ? `Let’s make ${studentName}’s next school step clearer.`
                  : 'Let’s make the next school step clearer.'}
              </Typography.Heading>
              <Typography.Paragraph color="muted">
                Start with a first name and Berlin postcode, then compare realistic education
                pathways together.
              </Typography.Paragraph>
            </View>
            <Card className="border-border bg-surface border">
              <Card.Body className="gap-4 p-5">
                <View className="flex-row items-center gap-3">
                  <ShieldCheck color={accent} size={21} />
                  <Typography.Heading type="h4">Tell us who this is for</Typography.Heading>
                </View>
                <TextField>
                  <Label>Student’s first name</Label>
                  <Input
                    value={profile.studentName}
                    onChangeText={(value) => setProfileField('studentName', value)}
                    placeholder="For example, Alex"
                    autoCapitalize="words"
                    autoCorrect={false}
                    textContentType="givenName"
                  />
                </TextField>
                <Typography.Paragraph type="body-sm" color="muted">
                  A first name is enough. It stays in this guidance journey.
                </Typography.Paragraph>
                <View className="bg-border h-px" />
                <TextField>
                  <Label>
                    {studentName ? `${studentName}’s Berlin postcode` : 'Berlin postcode'}
                  </Label>
                  <Input
                    value={profile.postcode}
                    onChangeText={(value) =>
                      setProfileField('postcode', value.replace(/\D/g, '').slice(0, 5))
                    }
                    keyboardType="number-pad"
                    placeholder="e.g. 10115"
                  />
                </TextField>
                <Typography.Paragraph type="body-sm" color="muted">
                  We use the postcode area only for demo sorting. We do not use an exact home
                  location.
                </Typography.Paragraph>
              </Card.Body>
            </Card>
          </View>
          <View className="gap-3">
            <Button
              variant="primary"
              onPress={() => router.push(routes.reality)}
              isDisabled={!studentName || profile.postcode.length !== 5}
            >
              <Button.Label>Start reality check</Button.Label>
            </Button>
            <Typography.Paragraph type="body-sm" color="muted" align="center">
              Demo guidance only. Confirm transition and admission details with the current school
              and each receiving school.
            </Typography.Paragraph>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
