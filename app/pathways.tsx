import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Button, Card, Spinner, Typography } from 'heroui-native';
import { router } from 'expo-router';

import { JourneyScreen, StatusPill } from '@/components/guidance/JourneyUI';
import { guidanceService, realityCheck, type GuidancePathway } from '@/lib/guidance';
import { pathways, schools } from '@/lib/guidanceData';
import { useGuidanceStore } from '@/lib/guidanceStore';
import { routes } from '@/lib/routes';

export default function PathwaysScreen() {
  const profile = useGuidanceStore((state) => state.profile);
  const [items, setItems] = useState<GuidancePathway[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let active = true;

    const loadGuidance = async () => {
      await Promise.resolve();
      if (!active) return;

      setState('loading');
      try {
        const result = await guidanceService.generateGuidance(
          profile,
          realityCheck(profile),
          pathways,
          schools,
        );
        if (!active) return;
        setItems(result.pathways.slice(0, 3));
        setState('ready');
      } catch {
        if (active) setState('error');
      }
    };

    void loadGuidance();
    return () => {
      active = false;
    };
  }, [profile]);

  return (
    <JourneyScreen
      eyebrow="Comparison"
      title="Three pathways"
      description="Exactly three routes, ranked as different shapes of next step—not promises of admission."
    >
      {state === 'loading' ? (
        <View className="items-center gap-3 py-16">
          <Spinner />
          <Typography.Paragraph color="muted">
            Preparing a source-limited comparison…
          </Typography.Paragraph>
        </View>
      ) : state === 'error' || items.length !== 3 ? (
        <Card className="border-warning bg-warning-soft border">
          <Card.Body className="gap-3 p-5">
            <Typography.Heading type="h4">Comparison unavailable</Typography.Heading>
            <Typography.Paragraph>
              We could not prepare all three demo pathways. Your answers are still saved in this
              session.
            </Typography.Paragraph>
            <Button
              variant="ghost"
              onPress={() => router.replace(routes.profile)}
              className="border-border border"
            >
              <Button.Label>Back to shared profile</Button.Label>
            </Button>
          </Card.Body>
        </Card>
      ) : (
        items.map((pathway) => (
          <Card key={pathway.id} className="border-border bg-surface border">
            <Card.Body className="gap-4 p-5">
              <View className="gap-2">
                <StatusPill status={pathway.status} />
                <Typography.Heading type="h3">{pathway.name}</Typography.Heading>
                <Typography.Paragraph color="muted">{pathway.focus}</Typography.Paragraph>
              </View>
              <View className="gap-1">
                <Typography.Paragraph className="font-semibold">
                  Why this may fit
                </Typography.Paragraph>
                <Typography.Paragraph>{pathway.whyFit}</Typography.Paragraph>
              </View>
              <View className="bg-background-secondary gap-1 rounded-xl p-4">
                <Typography.Paragraph className="font-semibold">
                  Important to clarify
                </Typography.Paragraph>
                <Typography.Paragraph type="body-sm">{pathway.clarification}</Typography.Paragraph>
              </View>
              {pathway.status === 'Not recommended with current information' ? (
                <View className="gap-2">
                  <Typography.Paragraph type="body-sm" color="muted">
                    Ask the current school: “What result or formal decision would make this route
                    realistic?”
                  </Typography.Paragraph>
                  <Button
                    variant="ghost"
                    onPress={() => router.push(routes.reality)}
                    className="border-border border"
                  >
                    <Button.Label>Review reality check</Button.Label>
                  </Button>
                </View>
              ) : (
                <Button variant="primary" onPress={() => router.push(routes.schools(pathway.id))}>
                  <Button.Label>Explore schools</Button.Label>
                </Button>
              )}
            </Card.Body>
          </Card>
        ))
      )}
    </JourneyScreen>
  );
}
