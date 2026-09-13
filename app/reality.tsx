import { Button, Card, Typography } from 'heroui-native';
import { router } from 'expo-router';
import { View } from 'react-native';

import {
  JourneyScreen,
  OptionGrid,
  QuestionCard,
  StatusPill,
} from '@/components/guidance/JourneyUI';
import { realityCheck } from '@/lib/guidance';
import { realityQuestions } from '@/lib/guidanceData';
import { useGuidanceStore } from '@/lib/guidanceStore';
import { routes } from '@/lib/routes';

export default function RealityScreen() {
  const profile = useGuidanceStore((state) => state.profile);
  const setProfileField = useGuidanceStore((state) => state.setProfileField);
  const result = realityCheck(profile);

  const values: Record<string, string> = {
    schoolType: profile.schoolType,
    transitionStatement: profile.transitionStatement,
    qualification: profile.qualification,
    upperSecondary: profile.upperSecondary,
    maxTravelMinutes: String(profile.maxTravelMinutes),
  };

  const update = (key: string, value: string) => {
    if (key === 'maxTravelMinutes') {
      const minutes = Number(value);
      setProfileField('maxTravelMinutes', minutes);
      setProfileField('parent', { ...profile.parent, commute: minutes });
      return;
    }
    if (key === 'schoolType') setProfileField('schoolType', value);
    if (key === 'transitionStatement') setProfileField('transitionStatement', value);
    if (key === 'qualification') setProfileField('qualification', value);
    if (key === 'upperSecondary') setProfileField('upperSecondary', value);
  };

  return (
    <JourneyScreen
      eyebrow="Step 1 of 4"
      title="Reality check"
      description="Use only information the current school has actually stated. You can choose ‘I’m not sure.’"
      footer={
        <Button variant="primary" onPress={() => router.push(routes.student)}>
          <Button.Label>Continue to student priorities</Button.Label>
        </Button>
      }
    >
      {realityQuestions.map((question, index) => (
        <QuestionCard
          key={question.key}
          index={index + 1}
          title={question.title}
          helper={question.helper}
        >
          <OptionGrid
            options={question.options}
            value={values[question.key]}
            onChange={(value) => update(question.key, value)}
          />
        </QuestionCard>
      ))}
      <Card className="border-accent bg-accent-soft border">
        <Card.Body className="gap-4 p-5">
          <Typography.Paragraph
            className="text-accent font-semibold tracking-widest uppercase"
            type="body-sm"
          >
            Reality check summary
          </Typography.Paragraph>
          <StatusPill status={result.status} />
          <Typography.Paragraph>{result.explanation}</Typography.Paragraph>
          <View className="gap-3">
            {result.checks.map((check) => (
              <View key={check.id} className="bg-background gap-2 rounded-xl p-4">
                <Typography.Heading type="h4">{check.title}</Typography.Heading>
                <StatusPill status={check.status} />
                <Typography.Paragraph type="body-sm">{check.explanation}</Typography.Paragraph>
                <Typography.Paragraph type="body-sm" color="muted">
                  {check.sourceLabel} · {check.sourceDate}
                </Typography.Paragraph>
                {check.verificationQuestion ? (
                  <Typography.Paragraph className="font-medium">
                    Ask: “{check.verificationQuestion}”
                  </Typography.Paragraph>
                ) : null}
              </View>
            ))}
          </View>
          <View className="bg-background gap-2 rounded-xl p-4">
            <Typography.Paragraph type="body-sm" color="muted">
              Source
            </Typography.Paragraph>
            <Typography.Paragraph className="font-medium">
              {result.sourceLabel} · {result.sourceDate}
            </Typography.Paragraph>
            <Typography.Paragraph type="body-sm" color="muted">
              Ask your current school
            </Typography.Paragraph>
            <Typography.Paragraph className="font-medium">
              “{result.verificationQuestion}”
            </Typography.Paragraph>
          </View>
        </Card.Body>
      </Card>
    </JourneyScreen>
  );
}
