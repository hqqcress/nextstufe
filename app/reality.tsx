import { useMemo, useState } from 'react';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Card,
  Description,
  Label,
  PressableFeedback,
  SearchField,
  Typography,
  useThemeColor,
} from 'heroui-native';
import { ActivityIndicator, View } from 'react-native';

import {
  JourneyScreen,
  OptionGrid,
  QuestionCard,
  StatusPill,
} from '@/components/guidance/JourneyUI';
import {
  BERLIN_SCHOOL_SOURCE,
  findBerlinSchools,
  loadBerlinSchools,
  type BerlinSchool,
} from '@/lib/berlinSchools';
import { realityCheck } from '@/lib/guidance';
import { getRealityQuestions } from '@/lib/guidanceData';
import { useGuidanceStore } from '@/lib/guidanceStore';
import { routes } from '@/lib/routes';

export default function RealityScreen() {
  const { t } = useTranslation();
  const profile = useGuidanceStore((state) => state.profile);
  const setProfileField = useGuidanceStore((state) => state.setProfileField);
  const [schoolQuery, setSchoolQuery] = useState(profile.currentSchool?.name ?? '');
  const [schools, setSchools] = useState<BerlinSchool[]>([]);
  const [isLoadingSchools, setIsLoadingSchools] = useState(false);
  const [schoolLoadError, setSchoolLoadError] = useState(false);
  const [accent] = useThemeColor(['accent']);
  const result = realityCheck(profile);
  const realityQuestions = getRealityQuestions();
  const schoolSuggestions = useMemo(
    () => findBerlinSchools(schools, schoolQuery),
    [schoolQuery, schools],
  );

  const loadSchoolDirectory = () => {
    if (schools.length > 0 || isLoadingSchools) return;

    setIsLoadingSchools(true);
    setSchoolLoadError(false);
    void loadBerlinSchools()
      .then(setSchools)
      .catch(() => setSchoolLoadError(true))
      .finally(() => setIsLoadingSchools(false));
  };

  const chooseSchool = (school: BerlinSchool) => {
    setProfileField('currentSchool', school);
    setSchoolQuery(school.name);
  };

  const updateSchoolQuery = (value: string) => {
    setSchoolQuery(value);
    if (value.trim().length >= 2) loadSchoolDirectory();
    if (profile.currentSchool?.name !== value) setProfileField('currentSchool', null);
  };

  const values: Record<string, string> = {
    transitionStatement: profile.transitionStatement,
    qualification: profile.qualification,
    upperSecondary: profile.upperSecondary,
    maxTravelMinutes: profile.maxTravelMinutes === null ? '' : String(profile.maxTravelMinutes),
  };

  const update = (key: string, value: string) => {
    if (key === 'maxTravelMinutes') {
      const minutes = Number(value);
      setProfileField('maxTravelMinutes', minutes);
      setProfileField('parent', { ...profile.parent, commute: minutes });
      return;
    }
    if (key === 'transitionStatement') setProfileField('transitionStatement', value);
    if (key === 'qualification') setProfileField('qualification', value);
    if (key === 'upperSecondary') setProfileField('upperSecondary', value);
  };

  return (
    <JourneyScreen
      eyebrow={t('reality.eyebrow')}
      title={t('reality.title')}
      description={t('reality.description')}
      footer={
        <Button variant="primary" onPress={() => router.push(routes.student)}>
          <Button.Label>{t('reality.continue')}</Button.Label>
        </Button>
      }
    >
      <QuestionCard
        index={1}
        title={t('reality.schoolQuestion')}
        helper={t('reality.schoolHelper')}
      >
        <View className="gap-3">
          <SearchField value={schoolQuery} onChange={updateSchoolQuery}>
            <Label>{t('reality.currentSchool')}</Label>
            <SearchField.Group>
              <SearchField.SearchIcon />
              <SearchField.Input
                placeholder={t('reality.searchPlaceholder')}
                autoCapitalize="words"
                autoCorrect={false}
              />
              <SearchField.ClearButton />
            </SearchField.Group>
            <Description>{t('reality.searchHelp')}</Description>
          </SearchField>

          {isLoadingSchools ? (
            <View className="flex-row items-center gap-3 py-2">
              <ActivityIndicator color={accent} />
              <Typography.Paragraph type="body-sm" color="muted">
                {t('reality.loading')}
              </Typography.Paragraph>
            </View>
          ) : null}

          {schoolLoadError ? (
            <View className="bg-danger-soft gap-2 rounded-xl p-4">
              <Typography.Paragraph type="body-sm" className="text-danger-soft-foreground">
                {t('reality.loadError')}
              </Typography.Paragraph>
            </View>
          ) : null}

          {!profile.currentSchool && schoolQuery.trim().length >= 2 && !isLoadingSchools ? (
            <View className="border-border overflow-hidden rounded-xl border">
              {schoolSuggestions.map((school) => (
                <PressableFeedback
                  key={school.id}
                  animation={false}
                  onPress={() => chooseSchool(school)}
                >
                  <PressableFeedback.Scale>
                    <View className="border-border bg-background gap-1 border-b p-4">
                      <Typography.Paragraph className="font-semibold">
                        {school.name}
                      </Typography.Paragraph>
                      <Typography.Paragraph type="body-sm" color="muted">
                        {[school.schoolCategory, school.locality, school.postcode]
                          .filter(Boolean)
                          .join(' · ')}
                      </Typography.Paragraph>
                    </View>
                  </PressableFeedback.Scale>
                  <PressableFeedback.Ripple />
                </PressableFeedback>
              ))}
              {schools.length > 0 && schoolSuggestions.length === 0 ? (
                <View className="bg-background p-4">
                  <Typography.Paragraph type="body-sm" color="muted">
                    {t('reality.noMatch')}
                  </Typography.Paragraph>
                </View>
              ) : null}
            </View>
          ) : null}

          {profile.currentSchool ? (
            <View className="bg-accent-soft gap-1 rounded-xl p-4">
              <Typography.Paragraph className="text-accent-soft-foreground font-semibold">
                {profile.currentSchool.name}
              </Typography.Paragraph>
              <Typography.Paragraph type="body-sm" className="text-accent-soft-foreground">
                {profile.currentSchool.schoolCategory} · {profile.currentSchool.street},{' '}
                {profile.currentSchool.postcode} {profile.currentSchool.locality}
              </Typography.Paragraph>
              <Typography.Paragraph type="body-sm" className="text-accent-soft-foreground">
                {t('reality.schoolNumberYear', {
                  id: profile.currentSchool.id,
                  year: profile.currentSchool.schoolYear,
                })}
              </Typography.Paragraph>
            </View>
          ) : null}

          <Typography.Paragraph type="body-sm" color="muted">
            {t('common.source')}: {BERLIN_SCHOOL_SOURCE.label} · {BERLIN_SCHOOL_SOURCE.licence}
          </Typography.Paragraph>
        </View>
      </QuestionCard>

      {realityQuestions.map((question, index) => (
        <QuestionCard
          key={question.key}
          index={index + 2}
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
            {t('reality.summary')}
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
                    {t('reality.askQuoted', { question: check.verificationQuestion })}
                  </Typography.Paragraph>
                ) : null}
              </View>
            ))}
          </View>
          <View className="bg-background gap-2 rounded-xl p-4">
            <Typography.Paragraph type="body-sm" color="muted">
              {t('common.source')}
            </Typography.Paragraph>
            <Typography.Paragraph className="font-medium">
              {result.sourceLabel} · {result.sourceDate}
            </Typography.Paragraph>
            <Typography.Paragraph type="body-sm" color="muted">
              {t('reality.askCurrent')}
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
