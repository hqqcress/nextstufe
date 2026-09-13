import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Button, Card, Spinner, Typography } from 'heroui-native';
import { router } from 'expo-router';

import { JourneyScreen, StatusPill } from '@/components/guidance/JourneyUI';
import { guidanceService, realityCheck, type GuidancePathway } from '@/lib/guidance';
import { getPathways } from '@/lib/guidanceData';
import { useGuidanceStore } from '@/lib/guidanceStore';
import { routes } from '@/lib/routes';

export default function PathwaysScreen() {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage === 'de' ? 'de' : 'en';
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
        const pathways = getPathways(language);
        const result = await guidanceService.generateGuidance(
          profile,
          realityCheck(profile),
          pathways,
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
  }, [language, profile]);

  return (
    <JourneyScreen
      eyebrow={t('pathways.eyebrow')}
      title={t('pathways.title')}
      description={t('pathways.description')}
    >
      {state === 'loading' ? (
        <View className="items-center gap-3 py-16">
          <Spinner />
          <Typography.Paragraph color="muted">{t('pathways.loading')}</Typography.Paragraph>
        </View>
      ) : state === 'error' || items.length !== 3 ? (
        <Card className="border-warning bg-warning-soft border">
          <Card.Body className="gap-3 p-5">
            <Typography.Heading type="h4">{t('pathways.unavailable')}</Typography.Heading>
            <Typography.Paragraph>{t('pathways.unavailableText')}</Typography.Paragraph>
            <Button
              variant="ghost"
              onPress={() => router.replace(routes.profile)}
              className="border-border border"
            >
              <Button.Label>{t('pathways.backProfile')}</Button.Label>
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
                  {t('pathways.whyFit')}
                </Typography.Paragraph>
                <Typography.Paragraph>{pathway.whyFit}</Typography.Paragraph>
              </View>
              <View className="bg-background-secondary gap-1 rounded-xl p-4">
                <Typography.Paragraph className="font-semibold">
                  {t('pathways.clarify')}
                </Typography.Paragraph>
                <Typography.Paragraph type="body-sm">{pathway.clarification}</Typography.Paragraph>
              </View>
              {pathway.status === 'Not recommended with current information' ? (
                <View className="gap-2">
                  <Typography.Paragraph type="body-sm" color="muted">
                    {t('pathways.blockedQuestion')}
                  </Typography.Paragraph>
                  <Button
                    variant="ghost"
                    onPress={() => router.push(routes.reality)}
                    className="border-border border"
                  >
                    <Button.Label>{t('pathways.review')}</Button.Label>
                  </Button>
                </View>
              ) : (
                <Button variant="primary" onPress={() => router.push(routes.schools(pathway.id))}>
                  <Button.Label>{t('pathways.explore')}</Button.Label>
                </Button>
              )}
            </Card.Body>
          </Card>
        ))
      )}
    </JourneyScreen>
  );
}
