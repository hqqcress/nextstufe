import { Button, Card, Spinner, Typography } from 'heroui-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Linking, View } from 'react-native';

import { JourneyScreen } from '@/components/guidance/JourneyUI';
import { useBerlinSchoolDirectory } from '@/hooks/useBerlinSchoolDirectory';
import { BERLIN_SCHOOL_SOURCE, getSchoolPathway, toRecommendedSchool } from '@/lib/berlinSchools';
import { useGuidanceStore } from '@/lib/guidanceStore';
import { routes } from '@/lib/routes';
import { useI18nData } from '@/lib/useI18nData';

export default function SchoolDetailScreen() {
  const { t } = useTranslation();
  const { recommendedSchoolText } = useI18nData();
  const router = useRouter();
  const params = useLocalSearchParams<{ schoolId?: string }>();
  const profile = useGuidanceStore((state) => state.profile);
  const selectedPathwayId = useGuidanceStore((state) => state.selectedPathwayId);
  const selectSchool = useGuidanceStore((state) => state.selectSchool);
  const { schools, status, retry } = useBerlinSchoolDirectory();
  const schoolRecord = schools.find((item) => item.id === params.schoolId);
  const pathwayId = schoolRecord
    ? (selectedPathwayId ?? getSchoolPathway(schoolRecord))
    : undefined;
  const school =
    schoolRecord && pathwayId ? toRecommendedSchool(schoolRecord, pathwayId, profile) : undefined;

  if (status === 'loading')
    return (
      <JourneyScreen title={t('schoolDetail.loading')}>
        <Card>
          <Card.Body className="items-center gap-3 p-6">
            <Spinner />
          </Card.Body>
        </Card>
      </JourneyScreen>
    );
  if (status === 'error')
    return (
      <JourneyScreen
        title={t('common.directoryUnavailable')}
        description={t('schoolDetail.errorText')}
      >
        <Button onPress={retry}>
          <Button.Label>{t('common.tryAgain')}</Button.Label>
        </Button>
      </JourneyScreen>
    );
  if (!school || !pathwayId)
    return (
      <JourneyScreen
        title={t('common.schoolNotFound')}
        description={t('schoolDetail.notFoundText')}
        footer={
          <Button onPress={() => router.replace(routes.pathways)}>
            <Button.Label>{t('common.backToPathways')}</Button.Label>
          </Button>
        }
      />
    );

  const text = recommendedSchoolText(school);
  return (
    <JourneyScreen
      eyebrow={t('schoolDetail.eyebrow', { id: school.id })}
      title={school.name}
      description={t('schoolDetail.description', { programme: text.programme })}
      footer={
        <Button
          onPress={() => {
            selectSchool(school.id, pathwayId);
            router.push(routes.email(school.id));
          }}
        >
          <Button.Label>{t('schoolDetail.draft')}</Button.Label>
        </Button>
      }
    >
      <Card>
        <Card.Body className="gap-4 p-5">
          <View className="flex-row flex-wrap gap-2">
            <View className="bg-success-soft rounded-full px-3 py-1.5">
              <Typography.Paragraph
                type="body-sm"
                className="text-success-soft-foreground font-semibold"
              >
                {t('schoolDetail.officialRecord')}
              </Typography.Paragraph>
            </View>
          </View>
          <View className="gap-1">
            <Typography.Paragraph type="body-sm" color="muted">
              {t('schoolDetail.schoolType')}
            </Typography.Paragraph>
            <Typography.Paragraph>
              {school.schoolType || school.schoolCategory}
            </Typography.Paragraph>
          </View>
          <View className="gap-1">
            <Typography.Paragraph type="body-sm" color="muted">
              {t('schoolDetail.address')}
            </Typography.Paragraph>
            <Typography.Paragraph>{school.address}</Typography.Paragraph>
          </View>
          <Typography.Paragraph type="body-sm" color="muted">
            {text.sourceDate}
          </Typography.Paragraph>
        </Card.Body>
      </Card>
      {[
        { title: t('schoolDetail.why'), items: text.matches },
        { title: t('schoolDetail.cannotConfirm'), items: text.mismatches },
        { title: t('schoolDetail.questions'), items: text.missingInformation },
      ].map(({ title, items }) => (
        <Card key={title}>
          <Card.Body className="gap-3 p-5">
            <Typography.Heading type="h3">{title}</Typography.Heading>
            {items.map((item) => (
              <Typography.Paragraph key={item} color="muted">
                • {item}
              </Typography.Paragraph>
            ))}
          </Card.Body>
        </Card>
      ))}
      <Card className="bg-muted/30">
        <Card.Body className="gap-3 p-5">
          <Typography.Heading type="h4">{t('schoolDetail.officialSources')}</Typography.Heading>
          <Typography.Paragraph color="muted">
            {t('schoolDetail.sourcesText', { source: BERLIN_SCHOOL_SOURCE.label })}
          </Typography.Paragraph>
          <Button
            variant="ghost"
            className="border-border border"
            onPress={() => void Linking.openURL(school.websiteUrl)}
          >
            <Button.Label>
              {t(
                school.websiteDestination === 'school'
                  ? 'schoolDetail.openSchool'
                  : 'schoolDetail.openDirectory',
              )}
            </Button.Label>
          </Button>
          <Button
            variant="ghost"
            className="border-border border"
            onPress={() => void Linking.openURL(school.requirementsUrl)}
          >
            <Button.Label>{t('schoolDetail.openGuidance')}</Button.Label>
          </Button>
        </Card.Body>
      </Card>
    </JourneyScreen>
  );
}
