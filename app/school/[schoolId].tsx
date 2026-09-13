import { Button, Card, Spinner, Typography } from 'heroui-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Linking, View } from 'react-native';

import { JourneyScreen } from '@/components/guidance/JourneyUI';
import { useBerlinSchoolDirectory } from '@/hooks/useBerlinSchoolDirectory';
import { BERLIN_SCHOOL_SOURCE, getSchoolPathway, toRecommendedSchool } from '@/lib/berlinSchools';
import { useGuidanceStore } from '@/lib/guidanceStore';
import { routes } from '@/lib/routes';

export default function SchoolDetailScreen() {
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

  if (status === 'loading') {
    return (
      <JourneyScreen title="Loading school details">
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
        title="The Berlin school directory is unavailable"
        description="We cannot show reliable school details without the source data."
      >
        <Button onPress={retry}>
          <Button.Label>Try again</Button.Label>
        </Button>
      </JourneyScreen>
    );
  }

  if (!school || !pathwayId) {
    return (
      <JourneyScreen
        title="School not found"
        description="This school is not available in the current official Berlin directory."
        footer={
          <Button onPress={() => router.replace(routes.pathways)}>
            <Button.Label>Back to pathways</Button.Label>
          </Button>
        }
      />
    );
  }

  return (
    <JourneyScreen
      eyebrow={`Official school no. ${school.id}`}
      title={school.name}
      description={`${school.programme}. The pathway match is inferred from the official school classification and must be confirmed with the school.`}
      footer={
        <Button
          onPress={() => {
            selectSchool(school.id, pathwayId);
            router.push(routes.email(school.id));
          }}
        >
          <Button.Label>Draft a question email</Button.Label>
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
                Official directory record
              </Typography.Paragraph>
            </View>
          </View>
          <View className="gap-1">
            <Typography.Paragraph type="body-sm" color="muted">
              School type
            </Typography.Paragraph>
            <Typography.Paragraph>
              {school.schoolType || school.schoolCategory}
            </Typography.Paragraph>
          </View>
          <View className="gap-1">
            <Typography.Paragraph type="body-sm" color="muted">
              Address
            </Typography.Paragraph>
            <Typography.Paragraph>{school.address}</Typography.Paragraph>
          </View>
          <Typography.Paragraph type="body-sm" color="muted">
            {school.sourceDate}
          </Typography.Paragraph>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body className="gap-3 p-5">
          <Typography.Heading type="h3">Why it appears in this shortlist</Typography.Heading>
          {school.matches.map((item) => (
            <Typography.Paragraph key={item} color="muted">
              • {item}
            </Typography.Paragraph>
          ))}
        </Card.Body>
      </Card>

      <Card>
        <Card.Body className="gap-3 p-5">
          <Typography.Heading type="h3">What the directory cannot confirm</Typography.Heading>
          {school.mismatches.map((item) => (
            <Typography.Paragraph key={item} color="muted">
              • {item}
            </Typography.Paragraph>
          ))}
        </Card.Body>
      </Card>

      <Card>
        <Card.Body className="gap-3 p-5">
          <Typography.Heading type="h3">Questions to ask this school</Typography.Heading>
          {school.missingInformation.map((item) => (
            <Typography.Paragraph key={item} color="muted">
              • {item}
            </Typography.Paragraph>
          ))}
        </Card.Body>
      </Card>

      <Card className="bg-muted/30">
        <Card.Body className="gap-3 p-5">
          <Typography.Heading type="h4">Official sources</Typography.Heading>
          <Typography.Paragraph color="muted">
            School identity, type and address: {BERLIN_SCHOOL_SOURCE.label}. Programme and
            admissions must be checked separately.
          </Typography.Paragraph>
          <Button
            variant="ghost"
            className="border-border border"
            onPress={() => void Linking.openURL(school.websiteUrl)}
          >
            <Button.Label>Open school directory</Button.Label>
          </Button>
          <Button
            variant="ghost"
            className="border-border border"
            onPress={() => void Linking.openURL(school.requirementsUrl)}
          >
            <Button.Label>Open pathway guidance</Button.Label>
          </Button>
        </Card.Body>
      </Card>
    </JourneyScreen>
  );
}
