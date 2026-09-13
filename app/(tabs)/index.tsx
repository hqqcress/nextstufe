import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { Button, Card, Input, Label, TextField, Typography } from 'heroui-native';
import { router } from 'expo-router';
import { ShieldCheck } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useThemeColor } from 'heroui-native';

import { BrandLogo } from '@/components/BrandLogo';
import { useAppLanguage } from '@/hooks/useAppLanguage';
import { useGuidanceStore } from '@/lib/guidanceStore';
import { routes } from '@/lib/routes';

export default function Home() {
  const profile = useGuidanceStore((state) => state.profile);
  const setProfileField = useGuidanceStore((state) => state.setProfileField);
  const [accent] = useThemeColor(['accent']);
  const { t } = useTranslation();
  const { language, changeLanguage } = useAppLanguage();
  const studentName = profile.studentName.trim();

  return (
    <KeyboardAvoidingView
      className="bg-background flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerClassName="min-h-full px-5 pb-safe-or-5 pt-safe-or-8"
        keyboardShouldPersistTaps="handled"
      >
        <View className="mx-auto min-h-full w-full max-w-3xl flex-1 justify-between gap-8">
          <View className="gap-7 pt-8">
            <View className="flex-row items-start justify-between gap-4">
              <View className="items-center self-start">
                <BrandLogo width={112} height={90} label={t('common.logo')} />
                <Typography.Heading type="h4" className="text-foreground">
                  Wegweisser
                </Typography.Heading>
              </View>
              <View
                accessibilityLabel={t('language.accessibility')}
                className="border-border bg-surface flex-row rounded-full border p-1"
              >
                {(['de', 'en'] as const).map((code) => (
                  <Button
                    key={code}
                    size="sm"
                    variant={language === code ? 'primary' : 'ghost'}
                    className="min-w-14 rounded-full"
                    onPress={() => void changeLanguage(code)}
                  >
                    <Button.Label>{code === 'de' ? 'DE' : 'EN'}</Button.Label>
                  </Button>
                ))}
              </View>
            </View>
            <View className="gap-3">
              <Typography.Paragraph
                className="text-accent font-semibold tracking-widest uppercase"
                type="body-sm"
              >
                {t('home.eyebrow')}
              </Typography.Paragraph>
              <Typography.Heading type="h1">
                {studentName ? t('home.titleNamed', { name: studentName }) : t('home.title')}
              </Typography.Heading>
              <Typography.Paragraph color="muted">{t('home.description')}</Typography.Paragraph>
            </View>
            <Card className="border-border bg-surface border">
              <Card.Body className="gap-4 p-5">
                <View className="flex-row items-center gap-3">
                  <ShieldCheck color={accent} size={21} />
                  <Typography.Heading type="h4">{t('home.cardTitle')}</Typography.Heading>
                </View>
                <TextField>
                  <Label>{t('home.nameLabel')}</Label>
                  <Input
                    value={profile.studentName}
                    onChangeText={(value) => setProfileField('studentName', value)}
                    placeholder={t('home.namePlaceholder')}
                    autoCapitalize="words"
                    autoCorrect={false}
                    textContentType="givenName"
                  />
                </TextField>
                <Typography.Paragraph type="body-sm" color="muted">
                  {t('home.nameHelp')}
                </Typography.Paragraph>
                <View className="bg-border h-px" />
                <TextField>
                  <Label>
                    {studentName
                      ? t('home.postcodeNamed', { name: studentName })
                      : t('home.postcode')}
                  </Label>
                  <Input
                    value={profile.postcode}
                    onChangeText={(value) =>
                      setProfileField('postcode', value.replace(/\D/g, '').slice(0, 5))
                    }
                    keyboardType="number-pad"
                    placeholder={t('home.postcodePlaceholder')}
                  />
                </TextField>
                <Typography.Paragraph type="body-sm" color="muted">
                  {t('home.postcodeHelp')}
                </Typography.Paragraph>
              </Card.Body>
            </Card>
          </View>
          <View className="gap-3">
            <Button
              variant="primary"
              onPress={() => router.push(routes.reality)}
              isDisabled={!studentName || profile.postcode.length !== 5}
            >
              <Button.Label>{t('home.start')}</Button.Label>
            </Button>
            <Typography.Paragraph type="body-sm" color="muted" align="center">
              {t('home.disclaimer')}
            </Typography.Paragraph>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
