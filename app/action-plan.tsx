import { Button, Card, Checkbox, Spinner, Typography } from 'heroui-native';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { View } from 'react-native';

import { JourneyScreen } from '@/components/guidance/JourneyUI';
import { useBerlinSchoolDirectory } from '@/hooks/useBerlinSchoolDirectory';
import { getSchoolPathway, toRecommendedSchool, type RecommendedSchool } from '@/lib/berlinSchools';
import { useGuidanceStore } from '@/lib/guidanceStore';
import { routes } from '@/lib/routes';

interface ActionTask {
  id: string;
  title: string;
  reason: string;
  owner: string;
  linkLabel: string;
  route: ReturnType<typeof routes.email> | '/reality';
}

function buildActions(school: RecommendedSchool, needsTransitionGuidance: boolean): ActionTask[] {
  const actions: ActionTask[] = [];

  if (needsTransitionGuidance) {
    actions.push({
      id: 'ask-transition-guidance',
      title: 'Ask the current school when transition guidance will take place.',
      reason:
        'For Grade 9, not having had this conversation yet can be normal. Asking now clarifies the next step without treating it as a negative result.',
      owner: 'Parent and student',
      linkLabel: 'Review reality check',
      route: '/reality',
    });
  }

  actions.push(
    {
      id: 'contact-school',
      title: `Contact ${school.name}`,
      reason:
        'Confirm current programme availability and admission directly; the official directory does not publish or guarantee these details.',
      owner: 'Parent',
      linkLabel: 'Open email draft',
      route: routes.email(school.id),
    },
    {
      id: 'visit-school',
      title: `Plan a visit to ${school.name}`,
      reason: `Use the visit to verify the environment and route to ${school.locality || school.borough}.`,
      owner: 'Student',
      linkLabel: 'Review school',
      route: routes.school(school.id),
    },
    {
      id: 'confirm-requirements',
      title: 'Confirm pathway requirements',
      reason:
        'Ask the current school and the recommended school which certificates, grades, deadlines, and documents apply to this student.',
      owner: 'Parent and student',
      linkLabel: 'Review school questions',
      route: routes.school(school.id),
    },
  );

  return actions;
}

export default function ActionPlanScreen() {
  const router = useRouter();
  const profile = useGuidanceStore((state) => state.profile);
  const selectedSchoolId = useGuidanceStore((state) => state.selectedSchoolId);
  const selectedPathwayId = useGuidanceStore((state) => state.selectedPathwayId);
  const completedTaskIds = useGuidanceStore((state) => state.completedTaskIds);
  const toggleTask = useGuidanceStore((state) => state.toggleTask);
  const { schools, status, retry } = useBerlinSchoolDirectory();
  const schoolRecord = schools.find((item) => item.id === selectedSchoolId);
  const pathwayId = schoolRecord
    ? (selectedPathwayId ?? getSchoolPathway(schoolRecord))
    : undefined;
  const school =
    schoolRecord && pathwayId ? toRecommendedSchool(schoolRecord, pathwayId, profile) : undefined;
  const needsTransitionGuidance = profile.transitionStatement === 'not-discussed';
  const actions = useMemo(
    () => (school ? buildActions(school, needsTransitionGuidance) : []),
    [needsTransitionGuidance, school],
  );
  const completed = actions.filter((task) => completedTaskIds.includes(task.id)).length;

  if (status === 'loading') {
    return (
      <JourneyScreen title="Building your action plan">
        <Card>
          <Card.Body className="items-center gap-3 p-6">
            <Spinner />
          </Card.Body>
        </Card>
      </JourneyScreen>
    );
  }

  if (status === 'error') {
    return (
      <JourneyScreen
        title="The official school directory is unavailable"
        description="Your selected school cannot be verified right now."
      >
        <Button onPress={retry}>
          <Button.Label>Try again</Button.Label>
        </Button>
      </JourneyScreen>
    );
  }

  if (!school) {
    return (
      <JourneyScreen
        eyebrow="One step needed"
        title="Choose a real school first"
        description="Select a school from the official Berlin directory so the plan can use the correct name, address, and follow-up questions."
        footer={
          <Button onPress={() => router.replace(routes.pathways)}>
            <Button.Label>Choose a pathway and school</Button.Label>
          </Button>
        }
      />
    );
  }

  return (
    <JourneyScreen
      eyebrow="Your next steps"
      title="A practical action plan"
      description={`${completed} of ${actions.length} complete. This plan is saved for the current session.`}
      footer={
        <Button onPress={() => router.replace(routes.home)}>
          <Button.Label>Return to overview</Button.Label>
        </Button>
      }
    >
      <Card className="bg-accent/10">
        <Card.Body className="gap-2 p-5">
          <Typography.Paragraph
            type="body-sm"
            className="text-accent font-semibold tracking-wide uppercase"
          >
            Selected official school
          </Typography.Paragraph>
          <Typography.Heading type="h3">{school.name}</Typography.Heading>
          <Typography.Paragraph color="muted">{school.address}</Typography.Paragraph>
        </Card.Body>
      </Card>

      <View className="gap-4">
        {actions.map((task, index) => {
          const isDone = completedTaskIds.includes(task.id);
          return (
            <Card
              key={task.id}
              className={isDone ? 'border-success/40 bg-success-soft border' : ''}
            >
              <Card.Body className="gap-4 p-5">
                <View className="flex-row items-start gap-4">
                  <Checkbox
                    isSelected={isDone}
                    onSelectedChange={() => toggleTask(task.id)}
                    accessibilityLabel={`Mark ${task.title} complete`}
                  />
                  <View className="min-w-0 flex-1 gap-2">
                    <Typography.Paragraph
                      type="body-sm"
                      className="text-accent font-semibold tracking-wide uppercase"
                    >
                      Step {index + 1} · {task.owner}
                    </Typography.Paragraph>
                    <Typography.Heading
                      type="h4"
                      className={isDone ? 'line-through opacity-60' : ''}
                    >
                      {task.title}
                    </Typography.Heading>
                    <Typography.Paragraph color="muted">{task.reason}</Typography.Paragraph>
                  </View>
                </View>
                <Button variant="ghost" onPress={() => router.push(task.route)}>
                  <Button.Label>{task.linkLabel}</Button.Label>
                </Button>
              </Card.Body>
            </Card>
          );
        })}
      </View>

      <Card className="bg-muted/40">
        <Card.Body className="gap-2 p-4">
          <Typography.Paragraph type="body-sm" className="font-semibold">
            Important boundary
          </Typography.Paragraph>
          <Typography.Paragraph color="muted">
            The shortlist and plan support research. They do not determine eligibility, admission,
            programme availability, or deadlines.
          </Typography.Paragraph>
        </Card.Body>
      </Card>
    </JourneyScreen>
  );
}
