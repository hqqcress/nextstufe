import { Button, Card, Checkbox, Spinner, Typography } from 'heroui-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { JourneyScreen } from '@/components/guidance/JourneyUI';
import { useBerlinSchoolDirectory } from '@/hooks/useBerlinSchoolDirectory';
import { getSchoolPathway, toRecommendedSchool, type RecommendedSchool } from '@/lib/berlinSchools';
import { useGuidanceStore } from '@/lib/guidanceStore';
import { routes } from '@/lib/routes';

type Translate = ReturnType<typeof useTranslation>['t'];
interface ActionTask {
  id: string;
  title: string;
  reason: string;
  owner: string;
  linkLabel: string;
  route: ReturnType<typeof routes.email> | '/reality';
}
function buildActions(
  school: RecommendedSchool,
  needsGuidance: boolean,
  t: Translate,
): ActionTask[] {
  const actions: ActionTask[] = [];
  if (needsGuidance)
    actions.push({
      id: 'ask-transition-guidance',
      title: t('plan.transition.title'),
      reason: t('plan.transition.reason'),
      owner: t('plan.owners.both'),
      linkLabel: t('plan.transition.link'),
      route: '/reality',
    });
  actions.push(
    {
      id: 'contact-school',
      title: t('plan.contact.title', { school: school.name }),
      reason: t('plan.contact.reason'),
      owner: t('plan.owners.parent'),
      linkLabel: t('plan.contact.link'),
      route: routes.email(school.id),
    },
    {
      id: 'visit-school',
      title: t('plan.visit.title', { school: school.name }),
      reason: t('plan.visit.reason', { place: school.locality || school.borough }),
      owner: t('plan.owners.student'),
      linkLabel: t('plan.visit.link'),
      route: routes.school(school.id),
    },
    {
      id: 'confirm-requirements',
      title: t('plan.requirements.title'),
      reason: t('plan.requirements.reason'),
      owner: t('plan.owners.both'),
      linkLabel: t('plan.requirements.link'),
      route: routes.school(school.id),
    },
  );
  return actions;
}

export default function ActionPlanScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const profile = useGuidanceStore((state) => state.profile);
  const selectedSchoolId = useGuidanceStore((state) => state.selectedSchoolId);
  const selectedPathwayId = useGuidanceStore((state) => state.selectedPathwayId);
  const completedTaskIds = useGuidanceStore((state) => state.completedTaskIds);
  const toggleTask = useGuidanceStore((state) => state.toggleTask);
  const { schools, status, retry } = useBerlinSchoolDirectory();
  const record = schools.find((item) => item.id === selectedSchoolId);
  const pathwayId = record ? (selectedPathwayId ?? getSchoolPathway(record)) : undefined;
  const school = record && pathwayId ? toRecommendedSchool(record, pathwayId, profile) : undefined;
  const needsGuidance = profile.transitionStatement === 'not-discussed';
  const actions = school ? buildActions(school, needsGuidance, t) : [];
  const completed = actions.filter((task) => completedTaskIds.includes(task.id)).length;
  if (status === 'loading')
    return (
      <JourneyScreen title={t('plan.loading')}>
        <Card>
          <Card.Body className="items-center gap-3 p-6">
            <Spinner />
          </Card.Body>
        </Card>
      </JourneyScreen>
    );
  if (status === 'error')
    return (
      <JourneyScreen title={t('common.directoryUnavailable')} description={t('plan.errorText')}>
        <Button onPress={retry}>
          <Button.Label>{t('common.tryAgain')}</Button.Label>
        </Button>
      </JourneyScreen>
    );
  if (!school)
    return (
      <JourneyScreen
        eyebrow={t('plan.needed')}
        title={t('plan.chooseFirst')}
        description={t('plan.chooseText')}
        footer={
          <Button onPress={() => router.replace(routes.pathways)}>
            <Button.Label>{t('plan.choose')}</Button.Label>
          </Button>
        }
      />
    );
  return (
    <JourneyScreen
      eyebrow={t('plan.eyebrow')}
      title={t('plan.title')}
      description={t('plan.progress', { completed, total: actions.length })}
      footer={
        <Button onPress={() => router.replace(routes.home)}>
          <Button.Label>{t('plan.return')}</Button.Label>
        </Button>
      }
    >
      <Card className="bg-accent/10">
        <Card.Body className="gap-2 p-5">
          <Typography.Paragraph
            type="body-sm"
            className="text-accent font-semibold tracking-wide uppercase"
          >
            {t('plan.selected')}
          </Typography.Paragraph>
          <Typography.Heading type="h3">{school.name}</Typography.Heading>
          <Typography.Paragraph color="muted">{school.address}</Typography.Paragraph>
        </Card.Body>
      </Card>
      <View className="gap-4">
        {actions.map((task, index) => {
          const done = completedTaskIds.includes(task.id);
          return (
            <Card key={task.id} className={done ? 'border-success/40 bg-success-soft border' : ''}>
              <Card.Body className="gap-4 p-5">
                <View className="flex-row items-start gap-4">
                  <Checkbox
                    isSelected={done}
                    onSelectedChange={() => toggleTask(task.id)}
                    accessibilityLabel={t('plan.markComplete', { title: task.title })}
                  />
                  <View className="min-w-0 flex-1 gap-2">
                    <Typography.Paragraph
                      type="body-sm"
                      className="text-accent font-semibold tracking-wide uppercase"
                    >
                      {t('plan.stepOwner', { step: index + 1, owner: task.owner })}
                    </Typography.Paragraph>
                    <Typography.Heading type="h4" className={done ? 'line-through opacity-60' : ''}>
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
            {t('plan.boundary')}
          </Typography.Paragraph>
          <Typography.Paragraph color="muted">{t('plan.boundaryText')}</Typography.Paragraph>
        </Card.Body>
      </Card>
    </JourneyScreen>
  );
}
