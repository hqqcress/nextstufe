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

interface WfsSchoolResponse {
  features?: { properties?: WfsSchoolProperties }[];
}

const SCHOOL_DATA_URL =
  'https://gdi.berlin.de/services/wfs/schulen?service=WFS&version=2.0.0&request=GetFeature&typeNames=schulen%3Aschulen&outputFormat=application%2Fjson&propertyName=bsn%2Cschulname%2Cschulart%2Cschultyp%2Cbezirk%2Cortsteil%2Cplz%2Cstrasse%2Chausnr%2Cschuljahr&count=1000';

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
        isRecord(feature) && (feature.properties === undefined || isRecord(feature.properties)),
    )
  );
}

function text(value: unknown): string {
  return typeof value === 'string' || typeof value === 'number' ? String(value).trim() : '';
}

function toSchool(properties: WfsSchoolProperties): BerlinSchool | null {
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
        .map((feature) => (feature.properties ? toSchool(feature.properties) : null))
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
