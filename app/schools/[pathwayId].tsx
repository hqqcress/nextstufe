import { Button, Card, Spinner, Typography } from 'heroui-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { View } from 'react-native';

import MapView from '@/components/MapView';
import { JourneyScreen } from '@/components/guidance/JourneyUI';
import { useBerlinSchoolDirectory } from '@/hooks/useBerlinSchoolDirectory';
import {
  BERLIN_SCHOOL_SOURCE,
  getRecommendedSchools,
  type RecommendedSchool,
} from '@/lib/berlinSchools';
import { pathways, type PathwayId } from '@/lib/guidanceData';
import { useGuidanceStore } from '@/lib/guidanceStore';
import { routes } from '@/lib/routes';
import { cn } from '@/lib/utils';

function isPathwayId(value: string | undefined): value is PathwayId {
  return pathways.some((pathway) => pathway.id === value);
}

function SchoolCard({
  school,
  selected,
  onSelect,
  onOpen,
}: {
  school: RecommendedSchool;
  selected: boolean;
  onSelect: () => void;
  onOpen: () => void;
}) {
  return (
    <Card className={cn('border-border border', selected && 'border-accent bg-accent/5')}>
      <Card.Body className="gap-3 p-5">
        <View className="flex-row items-start justify-between gap-3">
          <View className="min-w-0 flex-1 gap-1">
            <Typography.Heading type="h4">{school.name}</Typography.Heading>
            <Typography.Paragraph type="body-sm" color="muted">
              {school.schoolType || school.schoolCategory} · School no. {school.id}
            </Typography.Paragraph>
          </View>
          <View className="bg-accent/10 rounded-full px-3 py-1">
            <Typography.Paragraph type="body-sm" className="text-accent font-semibold">
              Official data
            </Typography.Paragraph>
          </View>
        </View>
        <Typography.Paragraph className="font-semibold">{school.programme}</Typography.Paragraph>
        <Typography.Paragraph color="muted">{school.address}</Typography.Paragraph>
        <Typography.Paragraph type="body-sm" color="muted">
          {school.matches[1]}
        </Typography.Paragraph>
        <View className="flex-row gap-2">
          <Button variant="primary" className="flex-1" onPress={onSelect}>
            <Button.Label>{selected ? 'Selected' : 'Select school'}</Button.Label>
          </Button>
          <Button variant="ghost" className="border-border flex-1 border" onPress={onOpen}>
            <Button.Label>View details</Button.Label>
          </Button>
        </View>
      </Card.Body>
    </Card>
  );
}

export default function SchoolsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ pathwayId?: string }>();
  const profile = useGuidanceStore((state) => state.profile);
  const selectedSchoolId = useGuidanceStore((state) => state.selectedSchoolId);
  const selectSchool = useGuidanceStore((state) => state.selectSchool);
  const { schools, status, retry } = useBerlinSchoolDirectory();
  const pathwayId = isPathwayId(params.pathwayId) ? params.pathwayId : undefined;
  const pathway = pathways.find((item) => item.id === pathwayId);
  const recommendations = useMemo(
    () => (pathwayId ? getRecommendedSchools(schools, pathwayId, profile) : []),
    [pathwayId, profile, schools],
  );
  const mappableSchools = recommendations.filter((school) => school.coordinate);

  if (!pathwayId || !pathway) {
    return (
      <JourneyScreen
        title="This pathway link is not valid"
        description="Return to the pathway comparison and choose a pathway again."
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
      eyebrow="Official school directory"
      title={`Schools to investigate for ${pathway.name}`}
      description={`These are real Berlin schools from the official directory, ranked using school classification and postcode proximity to ${profile.postcode}. This is a research shortlist, not an admission or programme guarantee.`}
      footer={
        <Button isDisabled={!selectedSchoolId} onPress={() => router.push(routes.plan)}>
          <Button.Label>Continue to action plan</Button.Label>
        </Button>
      }
    >
      {status === 'loading' ? (
        <Card>
          <Card.Body className="items-center gap-3 p-6">
            <Spinner />
            <Typography.Paragraph color="muted">
              Loading the current Berlin school directory…
            </Typography.Paragraph>
          </Card.Body>
        </Card>
      ) : status === 'error' ? (
        <Card>
          <Card.Body className="gap-4 p-5">
            <Typography.Heading type="h4">
              The official school directory is unavailable
            </Typography.Heading>
            <Typography.Paragraph color="muted">
              We cannot show reliable recommendations without the source data. Check your connection
              and try again.
            </Typography.Paragraph>
            <Button onPress={retry}>
              <Button.Label>Try again</Button.Label>
            </Button>
          </Card.Body>
        </Card>
      ) : recommendations.length === 0 ? (
        <Card>
          <Card.Body className="gap-3 p-5">
            <Typography.Heading type="h4">No matching schools found</Typography.Heading>
            <Typography.Paragraph color="muted">
              The official directory did not return a safe match for this pathway. Try another
              pathway or verify options with your current school.
            </Typography.Paragraph>
          </Card.Body>
        </Card>
      ) : (
        <>
          {mappableSchools.length > 0 ? (
            <View className="border-border overflow-hidden rounded-3xl border">
              <MapView
                style={{ height: 260, width: '100%' }}
                initialRegion={{
                  latitude: mappableSchools[0].coordinate!.latitude,
                  longitude: mappableSchools[0].coordinate!.longitude,
                  latitudeDelta: 0.16,
                  longitudeDelta: 0.16,
                }}
                markers={mappableSchools.map((school) => ({
                  id: school.id,
                  coordinate: school.coordinate!,
                  title: school.name,
                  description: school.address,
                  color: school.id === selectedSchoolId ? 'green' : 'blue',
                  onPress: () => selectSchool(school.id, pathwayId),
                }))}
              />
            </View>
          ) : null}
          <View className="gap-4">
            {recommendations.map((school) => (
              <SchoolCard
                key={school.id}
                school={school}
                selected={school.id === selectedSchoolId}
                onSelect={() => {
                  selectSchool(school.id, pathwayId);
                  router.push(routes.plan);
                }}
                onOpen={() => {
                  selectSchool(school.id, pathwayId);
                  router.push(routes.school(school.id));
                }}
              />
            ))}
          </View>
        </>
      )}
      <Card className="bg-muted/30">
        <Card.Body className="gap-2 p-4">
          <Typography.Paragraph
            type="body-sm"
            className="font-semibold tracking-wide uppercase"
            color="muted"
          >
            Source and matching note
          </Typography.Paragraph>
          <Typography.Paragraph color="muted">
            {BERLIN_SCHOOL_SOURCE.label} · {BERLIN_SCHOOL_SOURCE.licence}. The public directory does
            not confirm current programme availability, admission, travel time, or fit with personal
            priorities. Confirm these directly with each school.
          </Typography.Paragraph>
        </Card.Body>
      </Card>
    </JourneyScreen>
  );
}
