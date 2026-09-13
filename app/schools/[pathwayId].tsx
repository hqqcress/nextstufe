import { Linking, View } from 'react-native';
import { Button, Card, Typography } from 'heroui-native';
import { router, useLocalSearchParams } from 'expo-router';

import MapView from '@/components/MapView';
import { JourneyScreen } from '@/components/guidance/JourneyUI';
import { GesturePressable } from '@/components/ui/primitives/GesturePressable';
import { pathways, schools } from '@/lib/guidanceData';
import { useGuidanceStore } from '@/lib/guidanceStore';
import { routes } from '@/lib/routes';

export default function SchoolsScreen() {
  const params = useLocalSearchParams<{ pathwayId?: string | string[] }>();
  const pathwayId = Array.isArray(params.pathwayId) ? params.pathwayId[0] : params.pathwayId;
  const profile = useGuidanceStore((state) => state.profile);
  const selectedSchoolId = useGuidanceStore((state) => state.selectedSchoolId);
  const selectSchool = useGuidanceStore((state) => state.selectSchool);
  const pathway = pathways.find((item) => item.id === pathwayId);
  const postcodePrefix = profile.postcode.slice(0, 2);
  const options = schools
    .filter((school) => school.pathwayId === pathwayId)
    .sort((a, b) => {
      const travelRank =
        Number(a.commuteMinutes > profile.parent.commute) -
        Number(b.commuteMinutes > profile.parent.commute);
      if (travelRank !== 0) return travelRank;
      const aPostcode = a.address.match(/\b\d{5}\b/)?.[0] ?? '';
      const bPostcode = b.address.match(/\b\d{5}\b/)?.[0] ?? '';
      const areaRank =
        Number(!aPostcode.startsWith(postcodePrefix)) -
        Number(!bPostcode.startsWith(postcodePrefix));
      return areaRank || a.commuteMinutes - b.commuteMinutes;
    })
    .slice(0, 3);

  const openSchool = (schoolId: string) => {
    selectSchool(schoolId);
    router.push(routes.school(schoolId));
  };

  if (!pathway || options.length === 0) {
    return (
      <JourneyScreen
        title="No demo options found"
        description="This pathway does not have a complete three-school demo set yet."
      >
        <Button variant="primary" onPress={() => router.replace(routes.pathways)}>
          <Button.Label>Back to pathways</Button.Label>
        </Button>
      </JourneyScreen>
    );
  }

  const coordinates = options.map((school) => school.coordinate);
  const selectedCoordinate = options.find((school) => school.id === selectedSchoolId)?.coordinate;
  const center = {
    latitude:
      selectedCoordinate?.latitude ??
      coordinates.reduce((sum, point) => sum + point.latitude, 0) / coordinates.length,
    longitude:
      selectedCoordinate?.longitude ??
      coordinates.reduce((sum, point) => sum + point.longitude, 0) / coordinates.length,
    latitudeDelta: 0.15,
    longitudeDelta: 0.15,
  };

  return (
    <JourneyScreen
      eyebrow={pathway.name}
      title="Three Berlin school options"
      description={`Showing options using postcode area ${profile.postcode} and your ${profile.parent.commute}-minute travel preference. Commutes are demo estimates.`}
    >
      <View className="gap-3">
        {options.map((school, index) => (
          <GesturePressable
            key={school.id}
            onPress={() => openSchool(school.id)}
            accessibilityRole="button"
            accessibilityLabel={`Open ${school.name}`}
          >
            <Card
              className={
                selectedSchoolId === school.id
                  ? 'border-accent bg-surface border-2'
                  : 'border-border bg-surface border'
              }
            >
              <Card.Body className="gap-3 p-5">
                <View className="flex-row items-start justify-between gap-3">
                  <View className="min-w-0 flex-1 gap-1">
                    <Typography.Paragraph type="body-sm" className="text-accent font-semibold">
                      {index + 1} · Demo school data
                    </Typography.Paragraph>
                    <Typography.Heading type="h4">{school.name}</Typography.Heading>
                    <Typography.Paragraph color="muted" type="body-sm">
                      {school.programme}
                    </Typography.Paragraph>
                  </View>
                  <View className="bg-background-secondary items-end gap-1 rounded-xl px-3 py-2">
                    <Typography.Paragraph type="body-sm" className="font-semibold">
                      ~{school.commuteMinutes} min
                    </Typography.Paragraph>
                    <Typography.Paragraph
                      type="body-xs"
                      className={
                        school.commuteMinutes <= profile.parent.commute
                          ? 'text-success'
                          : 'text-warning'
                      }
                    >
                      {school.commuteMinutes <= profile.parent.commute
                        ? 'Within preference'
                        : 'Over preference'}
                    </Typography.Paragraph>
                  </View>
                </View>
                <Typography.Paragraph type="body-sm">
                  {school.neighbourhood} · {school.address}
                </Typography.Paragraph>
                <Typography.Paragraph>Why this may fit: {school.matches[0]}</Typography.Paragraph>
                <View className="flex-row flex-wrap gap-2">
                  <Button
                    variant="ghost"
                    onPress={() => void Linking.openURL(school.websiteUrl)}
                    className="border-border border"
                  >
                    <Button.Label>Official website</Button.Label>
                  </Button>
                  <Button variant="primary" onPress={() => openSchool(school.id)}>
                    <Button.Label>View fit & questions</Button.Label>
                  </Button>
                </View>
              </Card.Body>
            </Card>
          </GesturePressable>
        ))}
      </View>
      <View className="gap-3">
        <Typography.Heading type="h3">Map</Typography.Heading>
        <Typography.Paragraph type="body-sm" color="muted">
          Tap a labelled pin to open the same school detail.
        </Typography.Paragraph>
        <View className="border-border overflow-hidden rounded-2xl border">
          <MapView
            initialRegion={center}
            style={{ width: '100%', height: 340 }}
            markers={options.map((school, index) => ({
              id: school.id,
              coordinate: school.coordinate,
              title: `${index + 1}. ${school.name}`,
              description: school.programme,
              color: selectedSchoolId === school.id ? 'purple' : 'orange',
              onPress: () => openSchool(school.id),
            }))}
          />
        </View>
      </View>
    </JourneyScreen>
  );
}
