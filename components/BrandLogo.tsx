import type { ComponentProps } from 'react';
import Svg, { Circle, Polyline } from 'react-native-svg';

const BRAND_TEAL = '#007560';
const BRAND_TEAL_DARK = '#00543F';
const BRAND_TEAL_LIGHT = '#99D4C4';
const BRAND_TEAL_PALE = '#CFEFE6';

type BrandLogoProps = Omit<ComponentProps<typeof Svg>, 'viewBox'> & {
  label?: string;
};

export function BrandLogo({ label = 'NextStufe', ...props }: BrandLogoProps) {
  return (
    <Svg viewBox="0 0 400 320" accessibilityRole="image" accessibilityLabel={label} {...props}>
      <Circle cx="60" cy="270" r="5" fill={BRAND_TEAL_LIGHT} />
      <Circle cx="90" cy="278" r="6" fill={BRAND_TEAL_LIGHT} />
      <Circle cx="124" cy="283" r="7" fill={BRAND_TEAL_LIGHT} />
      <Circle cx="276" cy="283" r="7" fill={BRAND_TEAL_LIGHT} />
      <Circle cx="310" cy="278" r="6" fill={BRAND_TEAL_LIGHT} />
      <Circle cx="340" cy="270" r="5" fill={BRAND_TEAL_LIGHT} />
      <Polyline
        points="70,150 145,245 200,160 255,245 330,150"
        fill="none"
        stroke={BRAND_TEAL}
        strokeWidth="30"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="70" cy="150" r="15" fill={BRAND_TEAL} />
      <Circle cx="330" cy="150" r="15" fill={BRAND_TEAL} />
      <Circle cx="200" cy="150" r="22" fill={BRAND_TEAL_DARK} />
      <Circle cx="200" cy="150" r="9" fill={BRAND_TEAL_PALE} />
    </Svg>
  );
}
