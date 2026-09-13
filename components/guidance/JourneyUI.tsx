import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { Button, Card, PressableFeedback, Typography } from 'heroui-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { BrandLogo } from '@/components/BrandLogo';
import { cn } from '@/lib/utils';
import { goBackOrReplace } from '@/lib/navigation';
import { routes } from '@/lib/routes';
import type { Option, RealityStatus } from '@/lib/guidanceData';

export function JourneyScreen({
  children,
  eyebrow,
  title,
  description,
  footer,
}: {
  children?: ReactNode;
  eyebrow?: string;
  title: string;
  description?: string;
  footer?: ReactNode;
}) {
  const { t } = useTranslation();
  return (
    <KeyboardAvoidingView
      className="bg-background flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerClassName="w-full max-w-3xl self-center gap-6 px-5 pb-6 pt-safe-or-6"
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-row items-center justify-between">
          <Button variant="ghost" onPress={() => goBackOrReplace(routes.home)} className="px-0">
            <Button.Label>{t('common.back')}</Button.Label>
          </Button>
          <View className="flex-row items-center gap-2">
            <BrandLogo width={42} height={34} label={t('common.home')} />
            <Typography.Paragraph className="text-foreground font-semibold">
              Wegweisser
            </Typography.Paragraph>
          </View>
        </View>
        <View className="gap-2">
          {eyebrow ? (
            <Typography.Paragraph
              type="body-sm"
              className="text-accent font-semibold tracking-widest uppercase"
            >
              {eyebrow}
            </Typography.Paragraph>
          ) : null}
          <Typography.Heading type="h1" className="text-foreground">
            {title}
          </Typography.Heading>
          {description ? (
            <Typography.Paragraph color="muted">{description}</Typography.Paragraph>
          ) : null}
        </View>
        {children}
      </ScrollView>
      {footer ? (
        <View className="border-border bg-background pb-safe-or-4 border-t px-5 pt-3">
          <View className="w-full max-w-3xl self-center">{footer}</View>
        </View>
      ) : null}
    </KeyboardAvoidingView>
  );
}

export function OptionGrid({
  options,
  value,
  onChange,
}: {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <View className="flex-row flex-wrap gap-2">
      {options.map((option) => {
        const selected = option.value === value;
        const needsMultipleLines = option.label.length > 32;
        if (needsMultipleLines) {
          return (
            <PressableFeedback
              key={option.value}
              animation={false}
              onPress={() => onChange(option.value)}
              className="w-full"
            >
              <PressableFeedback.Scale>
                <View
                  className={cn(
                    'min-h-12 w-full justify-center rounded-xl border px-4 py-3',
                    selected ? 'border-accent bg-accent' : 'border-border bg-surface',
                  )}
                >
                  <Typography.Paragraph
                    className={cn(
                      'w-full leading-5',
                      selected ? 'text-accent-foreground font-semibold' : 'text-foreground',
                    )}
                  >
                    {option.label}
                  </Typography.Paragraph>
                </View>
              </PressableFeedback.Scale>
              <PressableFeedback.Ripple />
            </PressableFeedback>
          );
        }

        return (
          <Button
            key={option.value}
            variant={selected ? 'primary' : 'ghost'}
            onPress={() => onChange(option.value)}
            className={cn(
              'min-h-11 rounded-full px-4',
              !selected && 'border-border bg-surface border',
            )}
          >
            <Button.Label numberOfLines={1}>{option.label}</Button.Label>
          </Button>
        );
      })}
    </View>
  );
}

export function QuestionCard({
  index,
  title,
  helper,
  children,
}: {
  index: number;
  title: string;
  helper?: string;
  children: ReactNode;
}) {
  return (
    <Card className="border-border bg-surface border">
      <Card.Body className="gap-3 p-5">
        <Typography.Paragraph type="body-sm" color="muted">
          {String(index).padStart(2, '0')}
        </Typography.Paragraph>
        <Typography.Heading type="h4">{title}</Typography.Heading>
        {helper ? (
          <Typography.Paragraph type="body-sm" color="muted">
            {helper}
          </Typography.Paragraph>
        ) : null}
        {children}
      </Card.Body>
    </Card>
  );
}

export function StatusPill({ status }: { status: RealityStatus }) {
  const { t } = useTranslation();
  const tone =
    status === 'Currently open'
      ? 'bg-success-soft text-success-soft-foreground'
      : status === 'Needs confirmation'
        ? 'bg-warning-soft text-warning-soft-foreground'
        : 'bg-danger-soft text-danger-soft-foreground';
  return (
    <View className={cn('self-start rounded-full px-3 py-1.5', tone)}>
      <Typography.Paragraph type="body-sm" className="font-semibold">
        {status === 'Currently open'
          ? t('status.open')
          : status === 'Needs confirmation'
            ? t('status.needsConfirmation')
            : t('status.notRecommended')}
      </Typography.Paragraph>
    </View>
  );
}

export function PrimaryFooter({
  label,
  href,
  onPress,
}: {
  label: string;
  href?: HrefValue;
  onPress?: () => void;
}) {
  const router = useRouter();
  return (
    <Button variant="primary" onPress={onPress ?? (() => href && router.push(href))}>
      <Button.Label>{label}</Button.Label>
    </Button>
  );
}

type HrefValue = Parameters<ReturnType<typeof useRouter>['push']>[0];

export function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="border-border gap-1 border-b py-3">
      <Typography.Paragraph type="body-sm" color="muted">
        {label}
      </Typography.Paragraph>
      <Typography.Paragraph className="font-medium">{value}</Typography.Paragraph>
    </View>
  );
}
