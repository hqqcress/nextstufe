import { Button, Card, Typography } from 'heroui-native';
import { router } from 'expo-router';
import { View } from 'react-native';

import { JourneyScreen } from '@/components/guidance/JourneyUI';
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
  const profile = useGuidanceStore((state) => state.profile);
  const studentChips = Object.values(profile.student);
  const parentChips = [
    profile.parent.optionsOpen,
    `${profile.parent.commute} min commute`,
    profile.parent.focus,
    profile.parent.support,
    profile.parent.hope,
  ];
  const agree =
    profile.student.direction === 'open' || profile.parent.optionsOpen === 'very'
      ? 'You both value keeping future options open.'
      : 'You both want the next step to have a clear purpose.';
  const discuss =
    profile.student.avoid === 'commute'
      ? `Discuss whether ${profile.parent.commute} minutes one way feels sustainable every day.`
      : 'Discuss how broad or specialised the next programme should be.';

  return (
    <JourneyScreen
      eyebrow="Step 4 of 4"
      title={
        profile.studentName.trim()
          ? `${profile.studentName.trim()}’s shared profile`
          : 'Your shared profile'
      }
      description="Student and parent priorities stay separate, then meet in a shared comparison."
      footer={
        <Button variant="primary" onPress={() => router.push(routes.pathways)}>
          <Button.Label>See three pathways</Button.Label>
        </Button>
      }
    >
      <Card className="border-border bg-surface border">
        <Card.Body className="gap-4 p-5">
          <Typography.Heading type="h4">
            {profile.studentName.trim()
              ? `${profile.studentName.trim()}’s priorities`
              : 'Student priorities'}
          </Typography.Heading>
          <View className="flex-row flex-wrap gap-2">
            {studentChips.map((chip) => (
              <ProfileChip key={chip} label={chip} kind="student" />
            ))}
          </View>
        </Card.Body>
      </Card>
      <Card className="border-border bg-surface border">
        <Card.Body className="gap-4 p-5">
          <Typography.Heading type="h4">Parent priorities</Typography.Heading>
          <View className="flex-row flex-wrap gap-2">
            {parentChips.map((chip) => (
              <ProfileChip key={chip} label={chip} kind="parent" />
            ))}
          </View>
        </Card.Body>
      </Card>
      <View className="bg-background-secondary gap-3 rounded-2xl p-5">
        <Typography.Heading type="h4">What you agree on</Typography.Heading>
        <Typography.Paragraph>{agree}</Typography.Paragraph>
        <Typography.Heading type="h4" className="mt-2">
          What to discuss
        </Typography.Heading>
        <Typography.Paragraph>{discuss}</Typography.Paragraph>
      </View>
      <Button
        variant="ghost"
        onPress={() => router.push(routes.student)}
        className="border-border border"
      >
        <Button.Label>Edit profile</Button.Label>
      </Button>
    </JourneyScreen>
  );
}
