import { Linking, View } from 'react-native';
import { Button, Card, Typography } from 'heroui-native';
import { router } from 'expo-router';
import { Check } from 'lucide-react-native';
import { useThemeColor } from 'heroui-native';

import { JourneyScreen } from '@/components/guidance/JourneyUI';
import { schools } from '@/lib/guidanceData';
import { useGuidanceStore } from '@/lib/guidanceStore';
import { routes } from '@/lib/routes';

type ActionTaskLink = 'requirements' | 'website' | 'detail' | 'reality';

interface ActionTask {
  id: string;
  bucket: string;
  title: string;
  why: string;
  link: ActionTaskLink;
}

const baseTasks: ActionTask[] = [
  {
    id: 'compare',
    bucket: 'Now',
    title: 'Compare the selected school’s official entry requirements',
    why: 'This separates verified requirements from assumptions.',
    link: 'requirements',
  },
  {
    id: 'email',
    bucket: 'This week',
    title: 'Send the German email draft',
    why: 'The school can answer the missing information directly.',
    link: 'detail',
  },
  {
    id: 'event',
    bucket: 'Before an open day',
    title: 'Book or attend an information event',
    why: 'A visit can test the learning environment and commute.',
    link: 'website',
  },
  {
    id: 'counsellor',
    bucket: 'Before the application deadline',
    title: 'Ask the current-school counsellor to confirm the transition status',
    why: 'The app does not decide eligibility or admission.',
    link: 'detail',
  },
  {
    id: 'documents',
    bucket: 'Confirm deadline with the school',
    title: 'Gather documents listed on the official application page',
    why: 'No deadline is shown because the demo record has no verified date.',
    link: 'requirements',
  },
];

const transitionGuidanceTask: ActionTask = {
  id: 'transition-guidance',
  bucket: 'Now',
  title: 'Ask the current school when transition guidance will take place',
  why: 'For Grade 9, not having had this conversation yet is normal. Knowing when it will happen helps the family prepare questions.',
  link: 'reality',
};

export default function ActionPlanScreen() {
  const selectedSchoolId = useGuidanceStore((state) => state.selectedSchoolId);
  const profile = useGuidanceStore((state) => state.profile);
  const completed = useGuidanceStore((state) => state.completedTaskIds);
  const toggleTask = useGuidanceStore((state) => state.toggleTask);
  const [accentForeground] = useThemeColor(['accent-foreground']);
  const school = schools.find((item) => item.id === selectedSchoolId);
  const tasks =
    profile.transitionStatement === 'not-discussed'
      ? [transitionGuidanceTask, ...baseTasks]
      : baseTasks;

  if (!school) {
    return (
      <JourneyScreen
        title="Choose a school first"
        description="Your action plan will use the school you save or view. No school has been selected in this session yet."
      >
        <Button variant="primary" onPress={() => router.replace(routes.pathways)}>
          <Button.Label>Explore pathways</Button.Label>
        </Button>
      </JourneyScreen>
    );
  }

  const openLink = (kind: ActionTaskLink) => {
    if (kind === 'detail') router.push(routes.school(school.id));
    else if (kind === 'reality') router.push(routes.reality);
    else void Linking.openURL(kind === 'website' ? school.websiteUrl : school.requirementsUrl);
  };

  return (
    <JourneyScreen
      eyebrow={school.name}
      title="Your action plan"
      description="A practical sequence with no invented deadlines. Completed tasks stay marked while this app session is open."
    >
      {tasks.map((task) => {
        const done = completed.includes(task.id);
        return (
          <View key={task.id} className="gap-2">
            <Typography.Paragraph
              className="text-accent font-semibold tracking-widest uppercase"
              type="body-sm"
            >
              {task.bucket}
            </Typography.Paragraph>
            <Card className="border-border bg-surface border">
              <Card.Body className="gap-3 p-5">
                <View className="flex-row items-start gap-3">
                  <Button
                    variant={done ? 'primary' : 'ghost'}
                    onPress={() => toggleTask(task.id)}
                    className={
                      done
                        ? 'h-11 w-11 rounded-full px-0'
                        : 'border-border h-11 w-11 rounded-full border px-0'
                    }
                    accessibilityLabel={done ? 'Mark task not done' : 'Mark task done'}
                  >
                    {done ? (
                      <Check color={accentForeground} size={20} />
                    ) : (
                      <Button.Label>○</Button.Label>
                    )}
                  </Button>
                  <View className="min-w-0 flex-1 gap-2">
                    <Typography.Heading
                      type="h4"
                      className={done ? 'text-muted line-through' : undefined}
                    >
                      {task.title}
                    </Typography.Heading>
                    <Typography.Paragraph type="body-sm" color="muted">
                      Why it matters: {task.why}
                    </Typography.Paragraph>
                    <Button
                      variant="ghost"
                      onPress={() => openLink(task.link)}
                      className="self-start px-0"
                    >
                      <Button.Label>Open related information</Button.Label>
                    </Button>
                  </View>
                </View>
              </Card.Body>
            </Card>
          </View>
        );
      })}
      <Button
        variant="ghost"
        onPress={() => router.push(routes.pathways)}
        className="border-border border"
      >
        <Button.Label>Review pathways</Button.Label>
      </Button>
    </JourneyScreen>
  );
}
