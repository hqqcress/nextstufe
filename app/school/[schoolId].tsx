import { Linking, View } from 'react-native';
import { Button, Card, Typography } from 'heroui-native';
import { router, useLocalSearchParams } from 'expo-router';

import { JourneyScreen } from '@/components/guidance/JourneyUI';
import { schools } from '@/lib/guidanceData';
import { useGuidanceStore } from '@/lib/guidanceStore';
import { routes } from '@/lib/routes';

function DetailSection({
  title,
  items,
  tone = 'default',
}: {
  title: string;
  items: string[];
  tone?: 'default' | 'warning';
}) {
  return (
    <Card
      className={
        tone === 'warning'
          ? 'border-warning bg-warning-soft border'
          : 'border-border bg-surface border'
      }
    >
      <Card.Body className="gap-3 p-5">
        <Typography.Heading type="h4">{title}</Typography.Heading>
        {items.map((item) => (
          <View key={item} className="flex-row gap-3">
            <Typography.Paragraph className="text-accent">•</Typography.Paragraph>
            <Typography.Paragraph className="flex-1">{item}</Typography.Paragraph>
          </View>
        ))}
      </Card.Body>
    </Card>
  );
}

export default function SchoolDetailScreen() {
  const params = useLocalSearchParams<{ schoolId?: string | string[] }>();
  const schoolId = Array.isArray(params.schoolId) ? params.schoolId[0] : params.schoolId;
  const school = schools.find((item) => item.id === schoolId);
  const selectSchool = useGuidanceStore((state) => state.selectSchool);

  if (!school)
    return (
      <JourneyScreen title="School not found" description="This demo school record is unavailable.">
        <Button variant="primary" onPress={() => router.replace(routes.pathways)}>
          <Button.Label>Back to pathways</Button.Label>
        </Button>
      </JourneyScreen>
    );

  const showMap = () => {
    selectSchool(school.id);
    router.push(routes.schools(school.pathwayId));
  };

  return (
    <JourneyScreen
      eyebrow="Demo school data"
      title={school.name}
      description={`${school.programme} · ${school.neighbourhood}`}
    >
      <DetailSection title="Matches" items={school.matches} />
      <DetailSection title="Potential mismatches" items={school.mismatches} tone="warning" />
      <DetailSection
        title="Missing information"
        items={school.missingInformation.map((item) => `Ask: ${item}`)}
      />
      <Card className="border-border bg-background-secondary border">
        <Card.Body className="gap-3 p-5">
          <Typography.Heading type="h4">Official information</Typography.Heading>
          <Typography.Paragraph type="body-sm" color="muted">
            Source date
          </Typography.Paragraph>
          <Typography.Paragraph>{school.sourceDate}</Typography.Paragraph>
          <Typography.Paragraph type="body-sm" color="muted">
            Address
          </Typography.Paragraph>
          <Typography.Paragraph>{school.address}</Typography.Paragraph>
          <View className="flex-row flex-wrap gap-2">
            <Button
              variant="ghost"
              onPress={() => void Linking.openURL(school.websiteUrl)}
              className="border-border border"
            >
              <Button.Label>Official website</Button.Label>
            </Button>
            <Button
              variant="ghost"
              onPress={() => void Linking.openURL(school.requirementsUrl)}
              className="border-border border"
            >
              <Button.Label>Entry requirements resource</Button.Label>
            </Button>
          </View>
        </Card.Body>
      </Card>
      <View className="gap-3">
        <Button variant="ghost" onPress={showMap} className="border-border border">
          <Button.Label>Show on map</Button.Label>
        </Button>
        <Button variant="primary" onPress={() => router.push(routes.email(school.id))}>
          <Button.Label>Draft email in German</Button.Label>
        </Button>
        <Button
          variant="ghost"
          onPress={() => {
            selectSchool(school.id);
            router.push(routes.plan);
          }}
        >
          <Button.Label>Add to your action plan</Button.Label>
        </Button>
      </View>
    </JourneyScreen>
  );
}
