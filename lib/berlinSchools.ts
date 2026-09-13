import type { PathwayId, Profile } from './guidanceData';

export interface SchoolCoordinate {
  latitude: number;
  longitude: number;
}

export interface BerlinSchool {
  id: string;
  name: string;
  schoolCategory: string;
  schoolType: string;
  borough: string;
  locality: string;
  postcode: string;
  street: string;
  schoolYear: string;
  coordinate?: SchoolCoordinate;
}

export interface RecommendedSchool extends BerlinSchool {
  pathwayId: PathwayId;
  programme: string;
  address: string;
  websiteUrl: string;
  requirementsUrl: string;
  sourceDate: string;
  matches: string[];
  mismatches: string[];
  missingInformation: string[];
}

interface WfsSchoolProperties {
  bsn?: unknown;
  schulname?: unknown;
  schulart?: unknown;
  schultyp?: unknown;
  bezirk?: unknown;
  ortsteil?: unknown;
  plz?: unknown;
  strasse?: unknown;
  hausnr?: unknown;
  schuljahr?: unknown;
}

interface WfsGeometry {
  type?: unknown;
  coordinates?: unknown;
}

interface WfsFeature {
  properties?: WfsSchoolProperties;
  geometry?: WfsGeometry;
}

interface WfsSchoolResponse {
  features?: WfsFeature[];
}

const SCHOOL_DATA_URL =
  'https://gdi.berlin.de/services/wfs/schulen?service=WFS&version=2.0.0&request=GetFeature&typeNames=schulen%3Aschulen&outputFormat=application%2Fjson&srsName=EPSG%3A4326&count=1000';
const SCHOOL_DIRECTORY_URL = 'https://www.bildung.berlin.de/Schulverzeichnis/';

const PATHWAY_REQUIREMENTS: Record<PathwayId, string> = {
  oberstufe:
    'https://www.berlin.de/sen/bildung/schule/bildungswege/gymnasium/gymnasiale-oberstufe/',
  'berufliches-gymnasium':
    'https://www.berlin.de/sen/bildung/schule-und-beruf/berufliche-bildung/berufliches-gymnasium/',
  ausbildung: 'https://www.berlin.de/sen/bildung/schule-und-beruf/berufliche-bildung/berufsschule/',
};

const PATHWAY_PROGRAMMES: Record<PathwayId, string> = {
  oberstufe: 'Possible general upper-secondary route',
  'berufliches-gymnasium': 'Possible vocational upper-secondary route',
  ausbildung: 'Possible vocational education or training route',
};

const PATHWAY_QUESTIONS: Record<PathwayId, string[]> = {
  oberstufe: [
    'Does this location accept external students into its gymnasiale Oberstufe?',
    'Which entry requirements and subject combinations apply for the next school year?',
  ],
  'berufliches-gymnasium': [
    'Does this school currently offer a berufliches Gymnasium leading to the Abitur?',
    'Which vocational focus and entry requirements apply for the next school year?',
  ],
  ausbildung: [
    'Which dual or school-based programmes are currently offered here?',
    'Which qualification, employer placement, and application documents does each programme require?',
  ],
};

export const BERLIN_SCHOOL_SOURCE = {
  label: 'Berlin Open Data · Schools (WFS)',
  url: 'https://daten.berlin.de/datensaetze/schulen-wfs-ebc64e18',
  licence: 'Data licence Germany – Zero – Version 2.0',
};

let schoolRequest: Promise<BerlinSchool[]> | undefined;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isWfsSchoolResponse(value: unknown): value is WfsSchoolResponse {
  if (!isRecord(value) || value.features === undefined) return false;

  return (
    Array.isArray(value.features) &&
    value.features.every(
      (feature) =>
        isRecord(feature) &&
        (feature.properties === undefined || isRecord(feature.properties)) &&
        (feature.geometry === undefined || feature.geometry === null || isRecord(feature.geometry)),
    )
  );
}

function text(value: unknown): string {
  return typeof value === 'string' || typeof value === 'number' ? String(value).trim() : '';
}

function toCoordinate(geometry: WfsGeometry | undefined): SchoolCoordinate | undefined {
  if (geometry?.type !== 'Point' || !Array.isArray(geometry.coordinates)) return undefined;
  const [longitude, latitude] = geometry.coordinates;
  if (typeof longitude !== 'number' || typeof latitude !== 'number') return undefined;
  return { latitude, longitude };
}

function toSchool(feature: WfsFeature): BerlinSchool | null {
  const properties = feature.properties;
  if (!properties) return null;

  const id = text(properties.bsn);
  const name = text(properties.schulname);
  if (!id || !name) return null;

  const streetName = text(properties.strasse);
  const houseNumber = text(properties.hausnr);

  return {
    id,
    name,
    schoolCategory: text(properties.schulart),
    schoolType: text(properties.schultyp),
    borough: text(properties.bezirk),
    locality: text(properties.ortsteil),
    postcode: text(properties.plz),
    street: [streetName, houseNumber].filter(Boolean).join(' '),
    schoolYear: text(properties.schuljahr),
    coordinate: toCoordinate(feature.geometry),
  };
}

export function loadBerlinSchools(): Promise<BerlinSchool[]> {
  schoolRequest ??= fetch(SCHOOL_DATA_URL)
    .then(async (response) => {
      if (!response.ok) throw new Error('Berlin school directory could not be loaded.');
      const data: unknown = await response.json();
      if (!isWfsSchoolResponse(data)) {
        throw new Error('Berlin school directory returned an invalid response.');
      }
      return data;
    })
    .then((response) =>
      (response.features ?? [])
        .map(toSchool)
        .filter((school): school is BerlinSchool => school !== null)
        .sort((first, second) => first.name.localeCompare(second.name, 'de')),
    )
    .catch((error: unknown) => {
      schoolRequest = undefined;
      throw error;
    });

  return schoolRequest;
}

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('de')
    .trim();
}

export function findBerlinSchools(
  schools: BerlinSchool[],
  query: string,
  limit = 8,
): BerlinSchool[] {
  const search = normalize(query);
  if (search.length < 2) return [];

  return schools
    .map((school) => {
      const name = normalize(school.name);
      const locality = normalize(school.locality);
      const postcode = normalize(school.postcode);
      const id = normalize(school.id);
      const score = name.startsWith(search)
        ? 0
        : name.includes(search)
          ? 1
          : locality.startsWith(search) || postcode.startsWith(search) || id.startsWith(search)
            ? 2
            : 3;
      return { school, score };
    })
    .filter(({ score }) => score < 3)
    .sort(
      (first, second) =>
        first.score - second.score || first.school.name.localeCompare(second.school.name, 'de'),
    )
    .slice(0, limit)
    .map(({ school }) => school);
}

export function isSchoolForPathway(school: BerlinSchool, pathwayId: PathwayId): boolean {
  const category = normalize(school.schoolCategory);
  const type = normalize(school.schoolType);

  if (pathwayId === 'oberstufe') {
    return category.includes('gymnasium') || type.includes('gymnasium');
  }

  if (pathwayId === 'berufliches-gymnasium') {
    return category.includes('oberstufenzentrum') || type.includes('berufliches gymnasium');
  }

  return (
    category.includes('oberstufenzentrum') ||
    category.includes('berufsschule') ||
    type.includes('berufsschule') ||
    type.includes('fachschule')
  );
}

function postcodeRank(schoolPostcode: string, homePostcode: string): number {
  if (!/^\d{5}$/.test(homePostcode) || !/^\d{5}$/.test(schoolPostcode)) return 1_000_000;
  if (schoolPostcode === homePostcode) return 0;
  if (schoolPostcode.slice(0, 3) === homePostcode.slice(0, 3)) return 10;
  if (schoolPostcode.slice(0, 2) === homePostcode.slice(0, 2)) return 100;
  return 1000 + Math.abs(Number(schoolPostcode) - Number(homePostcode));
}

export function getRecommendedSchools(
  schools: BerlinSchool[],
  pathwayId: PathwayId,
  profile: Profile,
  limit = 3,
): RecommendedSchool[] {
  return schools
    .filter(
      (school) => school.id !== profile.currentSchool?.id && isSchoolForPathway(school, pathwayId),
    )
    .sort(
      (first, second) =>
        postcodeRank(first.postcode, profile.postcode) -
          postcodeRank(second.postcode, profile.postcode) ||
        first.name.localeCompare(second.name, 'de'),
    )
    .slice(0, limit)
    .map((school) => toRecommendedSchool(school, pathwayId, profile));
}

export function toRecommendedSchool(
  school: BerlinSchool,
  pathwayId: PathwayId,
  profile: Profile,
): RecommendedSchool {
  const category = school.schoolType || school.schoolCategory || 'school';
  const nearbyPostcode =
    /^\d{5}$/.test(profile.postcode) &&
    school.postcode.slice(0, 2) === profile.postcode.slice(0, 2);

  return {
    ...school,
    pathwayId,
    programme: PATHWAY_PROGRAMMES[pathwayId],
    address: [school.street, [school.postcode, school.locality].filter(Boolean).join(' ')]
      .filter(Boolean)
      .join(', '),
    websiteUrl: SCHOOL_DIRECTORY_URL,
    requirementsUrl: PATHWAY_REQUIREMENTS[pathwayId],
    sourceDate: school.schoolYear
      ? `Official directory · school year ${school.schoolYear}`
      : 'Official Berlin school directory',
    matches: [
      `The official directory classifies this location as ${category}.`,
      nearbyPostcode
        ? `Its postcode is in the same Berlin postcode area as ${profile.postcode}.`
        : 'It is included after comparing Berlin postcode proximity.',
    ],
    mismatches: [
      'The directory does not confirm the exact programme, admission decision, or journey time.',
    ],
    missingInformation: PATHWAY_QUESTIONS[pathwayId],
  };
}

export function getSchoolPathway(school: BerlinSchool): PathwayId | undefined {
  return (['oberstufe', 'berufliches-gymnasium', 'ausbildung'] as const).find((pathwayId) =>
    isSchoolForPathway(school, pathwayId),
  );
}
