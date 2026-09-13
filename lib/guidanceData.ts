import type { LatLng } from '@/components/MapView';
import type { BerlinSchool } from '@/lib/berlinSchools';

export type RealityStatus =
  | 'Currently open'
  | 'Needs confirmation'
  | 'Not recommended with current information';

export interface Option {
  value: string;
  label: string;
}

export interface Profile {
  studentName: string;
  postcode: string;
  currentSchool: BerlinSchool | null;
  transitionStatement: string;
  qualification: string;
  upperSecondary: string;
  maxTravelMinutes: number;
  student: {
    interests: string;
    challenge: string;
    environment: string;
    direction: string;
    avoid: string;
  };
  parent: {
    optionsOpen: string;
    commute: number;
    focus: string;
    support: string;
    hope: string;
  };
}

export interface RealityCheckItem {
  id: string;
  title: string;
  status: RealityStatus;
  explanation: string;
  sourceLabel: string;
  sourceDate: string;
  verificationQuestion?: string;
}

export interface RealityCheckResult {
  status: RealityStatus;
  explanation: string;
  sourceLabel: string;
  sourceDate: string;
  verificationQuestion: string;
  checks: RealityCheckItem[];
}

export interface PathwayCard {
  id: 'oberstufe' | 'berufliches-gymnasium' | 'ausbildung';
  name: string;
  focus: string;
  clarification: string;
  resourceUrl: string;
}

export type PathwayId = PathwayCard['id'];

export interface DemoSchool {
  id: string;
  pathwayId: PathwayCard['id'];
  name: string;
  programme: string;
  neighbourhood: string;
  address: string;
  commuteMinutes: number;
  coordinate: LatLng;
  websiteUrl: string;
  requirementsUrl: string;
  sourceDate: string;
  matches: string[];
  mismatches: string[];
  missingInformation: string[];
}

export interface QuestionDefinition<K extends string = string> {
  key: K;
  title: string;
  helper?: string;
  options: Option[];
}

const unsure: Option = { value: 'unsure', label: "I'm not sure" };

export const realityQuestions: QuestionDefinition[] = [
  {
    key: 'transitionStatement',
    title: 'Have you already discussed options after Grade 10 with your school?',
    helper:
      'This may be called an Anschlussberatung. Choose the closest answer—it is completely okay if you have not had this conversation yet. For Grade 9, “Not yet” is normal and is not a negative result.',
    options: [
      {
        value: 'upper-secondary-possible',
        label: 'Yes — the school said an upper-secondary / Abitur route is possible',
      },
      {
        value: 'conditions-to-confirm',
        label: 'Yes — it may be possible, but conditions need to be confirmed',
      },
      {
        value: 'another-route-recommended',
        label: 'Yes — the school recommended another route for now',
      },
      {
        value: 'not-discussed',
        label: 'Not yet — we have not had this conversation',
      },
      unsure,
    ],
  },
  {
    key: 'qualification',
    title: 'What does your current report show?',
    helper: 'Choose the plain-language description that is closest.',
    options: [
      { value: 'upper-secondary', label: 'Upper-secondary transition is shown' },
      { value: 'may-qualify', label: 'May qualify if current results continue' },
      { value: 'intermediate', label: 'Intermediate school qualification shown' },
      { value: 'vocational', label: 'Vocational preparation or qualification shown' },
      { value: 'nothing-clear', label: 'Nothing clear about the next step' },
      unsure,
    ],
  },
  {
    key: 'upperSecondary',
    title: 'Does your school have its own or a cooperating upper-secondary programme?',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
      { value: 'unsure', label: 'Unsure' },
    ],
  },
  {
    key: 'maxTravelMinutes',
    title: 'What is the maximum realistic one-way travel time?',
    options: [20, 30, 45, 60, 75].map((minutes) => ({
      value: String(minutes),
      label: `${minutes} minutes`,
    })),
  },
];

export const studentQuestions: QuestionDefinition<keyof Profile['student']>[] = [
  {
    key: 'interests',
    title: 'What subjects or areas interest you most?',
    options: [
      { value: 'technology', label: 'Technology' },
      { value: 'health', label: 'Health & social care' },
      { value: 'business', label: 'Business & languages' },
      { value: 'arts', label: 'Arts & creative' },
      { value: 'broad', label: 'Broad academic' },
      unsure,
    ],
  },
  {
    key: 'challenge',
    title: 'How much academic challenge do you want?',
    options: [
      { value: 'more', label: 'More challenge' },
      { value: 'balanced', label: 'Balanced' },
      { value: 'gradual', label: 'Gradual support' },
    ],
  },
  {
    key: 'environment',
    title: 'What learning environment feels best?',
    options: [
      { value: 'independent', label: 'Independent' },
      { value: 'collaborative', label: 'Collaborative' },
      { value: 'structured', label: 'Structured' },
      { value: 'practical', label: 'Practical / project-based' },
    ],
  },
  {
    key: 'direction',
    title: 'Which future direction sounds closest right now?',
    options: [
      { value: 'abitur', label: 'Abitur' },
      { value: 'ausbildung', label: 'Ausbildung' },
      { value: 'open', label: 'Keeping options open' },
      unsure,
    ],
  },
  {
    key: 'avoid',
    title: 'What do you not want in your next school?',
    options: [
      { value: 'commute', label: 'Too much commute' },
      { value: 'narrow', label: 'Narrow focus' },
      { value: 'large', label: 'Large school' },
      { value: 'easy', label: 'Too little challenge' },
      { value: 'other', label: 'Other' },
    ],
  },
];

export const parentQuestions: QuestionDefinition<keyof Profile['parent']>[] = [
  {
    key: 'optionsOpen',
    title: 'How important is keeping many future options open?',
    options: [
      { value: 'very', label: 'Very important' },
      { value: 'somewhat', label: 'Somewhat' },
      { value: 'not-main', label: 'Not the main priority' },
    ],
  },
  {
    key: 'commute',
    title: 'What commute range is acceptable?',
    helper: 'You can revise the travel choice from the reality check.',
    options: [20, 30, 45, 60, 75].map((minutes) => ({
      value: String(minutes),
      label: `${minutes} minutes`,
    })),
  },
  {
    key: 'focus',
    title: 'Is a clear vocational or subject focus welcome?',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'maybe', label: 'Maybe' },
      { value: 'no', label: 'No' },
    ],
  },
  {
    key: 'support',
    title: 'What practical or support consideration matters?',
    options: [
      { value: 'language', label: 'Language support' },
      { value: 'structure', label: 'Structure' },
      { value: 'accessibility', label: 'Accessibility' },
      { value: 'none', label: 'None stated' },
      unsure,
    ],
  },
  {
    key: 'hope',
    title: 'What is the biggest hope for the next step?',
    options: [
      { value: 'academic', label: 'Academic progression' },
      { value: 'career', label: 'Career exploration' },
      { value: 'wellbeing', label: 'Confidence & wellbeing' },
      { value: 'flexibility', label: 'Flexibility' },
    ],
  },
];

export const pathways: PathwayCard[] = [
  {
    id: 'oberstufe',
    name: 'Gymnasiale Oberstufe',
    focus: 'Broad Abitur pathway',
    clarification: 'Confirm the formal transition decision and the subject combinations available.',
    resourceUrl: 'https://www.berlin.de/sen/bildung/schule/bildungswege/gymnasium/',
  },
  {
    id: 'berufliches-gymnasium',
    name: 'Berufliches Gymnasium',
    focus: 'Abitur with a vocational focus such as technology, business, or health/social care',
    clarification:
      'A stronger subject focus can reduce breadth; ask how binding the chosen field is.',
    resourceUrl:
      'https://www.berlin.de/sen/bildung/schule-und-beruf/berufliche-bildung/berufliches-gymnasium/',
  },
  {
    id: 'ausbildung',
    name: 'Ausbildung-oriented pathway',
    focus: 'Practical professional route, potentially with further qualifications later',
    clarification:
      'Ask which qualification is earned and what later progression routes are documented.',
    resourceUrl: 'https://www.berlin.de/sen/bildung/schule-und-beruf/berufliche-bildung/',
  },
];

const directoryUrl = 'https://www.bildung.berlin.de/Schulverzeichnis/';

export const schools: DemoSchool[] = [
  {
    id: 'spree-campus',
    pathwayId: 'oberstufe',
    name: 'Spree Campus Oberstufe',
    programme: 'Broad Abitur programme',
    neighbourhood: 'Moabit',
    address: 'Turmstraße 88, 10559 Berlin',
    commuteMinutes: 24,
    coordinate: { latitude: 52.5254, longitude: 13.3458 },
    websiteUrl: directoryUrl,
    requirementsUrl: pathways[0].resourceUrl,
    sourceDate: 'Demo record · 13 Sep 2026',
    matches: [
      'Broad subject choice supports keeping options open.',
      'A balanced academic environment fits the selected challenge preference.',
    ],
    mismatches: ['The demo facts do not confirm school size or class size.'],
    missingInformation: [
      'Which transition decision must be shown on the final report?',
      'Which advanced subject combinations are available next year?',
    ],
  },
  {
    id: 'tempelhof-kolleg',
    pathwayId: 'oberstufe',
    name: 'Tempelhof Kolleg am Park',
    programme: 'Abitur with languages and sciences',
    neighbourhood: 'Tempelhof',
    address: 'Alarichstraße 14, 12105 Berlin',
    commuteMinutes: 38,
    coordinate: { latitude: 52.4585, longitude: 13.3764 },
    websiteUrl: directoryUrl,
    requirementsUrl: pathways[0].resourceUrl,
    sourceDate: 'Demo record · 13 Sep 2026',
    matches: [
      'Broad academic options support the student’s Abitur direction.',
      'The estimated commute stays inside the family limit.',
    ],
    mismatches: ['The commute is longer than the shortest demo option.'],
    missingInformation: [
      'Is language support available in the upper-secondary programme?',
      'Which documents are required for an external application?',
    ],
  },
  {
    id: 'pankow-lerncampus',
    pathwayId: 'oberstufe',
    name: 'Pankow Lerncampus',
    programme: 'Collaborative upper-secondary programme',
    neighbourhood: 'Pankow',
    address: 'Florapromenade 7, 13187 Berlin',
    commuteMinutes: 44,
    coordinate: { latitude: 52.5706, longitude: 13.4072 },
    websiteUrl: directoryUrl,
    requirementsUrl: pathways[0].resourceUrl,
    sourceDate: 'Demo record · 13 Sep 2026',
    matches: [
      'Collaborative learning matches the student profile.',
      'The broad programme keeps later options open.',
    ],
    mismatches: ['The estimated commute is close to the selected maximum.'],
    missingInformation: [
      'How are students from cooperating schools supported during transition?',
      'When is the next information event?',
    ],
  },
  {
    id: 'technikforum',
    pathwayId: 'berufliches-gymnasium',
    name: 'Technikforum Berlin-Mitte',
    programme: 'Berufliches Gymnasium · Technology',
    neighbourhood: 'Wedding',
    address: 'Luxemburger Straße 22, 13353 Berlin',
    commuteMinutes: 21,
    coordinate: { latitude: 52.5446, longitude: 13.3598 },
    websiteUrl: directoryUrl,
    requirementsUrl: pathways[1].resourceUrl,
    sourceDate: 'Demo record · 13 Sep 2026',
    matches: [
      'Technology focus reflects the student interest.',
      'The short commute supports the family’s practical priority.',
    ],
    mismatches: ['The programme has a narrower focus than a broad Gymnasiale Oberstufe.'],
    missingInformation: [
      'Which mathematics level is expected at entry?',
      'Can students change the vocational focus after starting?',
    ],
  },
  {
    id: 'gesundheit-campus',
    pathwayId: 'berufliches-gymnasium',
    name: 'Campus Gesundheit Neukölln',
    programme: 'Berufliches Gymnasium · Health & social care',
    neighbourhood: 'Neukölln',
    address: 'Karl-Marx-Straße 196, 12055 Berlin',
    commuteMinutes: 41,
    coordinate: { latitude: 52.4698, longitude: 13.4415 },
    websiteUrl: directoryUrl,
    requirementsUrl: pathways[1].resourceUrl,
    sourceDate: 'Demo record · 13 Sep 2026',
    matches: [
      'Health and social care supports career exploration.',
      'The programme still leads toward an Abitur in this demo pathway.',
    ],
    mismatches: ['The estimated commute is near the 45-minute preference.'],
    missingInformation: [
      'Are practical placements part of the programme?',
      'What proof of transition status is accepted?',
    ],
  },
  {
    id: 'wirtschaftskolleg',
    pathwayId: 'berufliches-gymnasium',
    name: 'Wirtschaftskolleg Charlottenburg',
    programme: 'Berufliches Gymnasium · Business & languages',
    neighbourhood: 'Charlottenburg',
    address: 'Wilmersdorfer Straße 117, 10627 Berlin',
    commuteMinutes: 34,
    coordinate: { latitude: 52.5087, longitude: 13.3052 },
    websiteUrl: directoryUrl,
    requirementsUrl: pathways[1].resourceUrl,
    sourceDate: 'Demo record · 13 Sep 2026',
    matches: [
      'Business and languages align with the selected interest.',
      'The commute fits the family’s current limit.',
    ],
    mismatches: ['The available demo facts do not confirm accessibility services.'],
    missingInformation: [
      'Which second-language options can be continued or started?',
      'Is an accessibility consultation available before applying?',
    ],
  },
  {
    id: 'werkstatt-spree',
    pathwayId: 'ausbildung',
    name: 'Werkstatt Spree Berufscampus',
    programme: 'Career preparation · Technology and crafts',
    neighbourhood: 'Friedrichshain',
    address: 'Rüdersdorfer Straße 31, 10243 Berlin',
    commuteMinutes: 27,
    coordinate: { latitude: 52.5145, longitude: 13.441 },
    websiteUrl: directoryUrl,
    requirementsUrl: pathways[2].resourceUrl,
    sourceDate: 'Demo record · 13 Sep 2026',
    matches: [
      'Practical projects fit the preferred learning environment.',
      'Career exploration matches the parent’s hope.',
    ],
    mismatches: ['This is not the same direct route to Abitur as an upper-secondary programme.'],
    missingInformation: [
      'Which recognised qualification does each programme lead to?',
      'Which employers currently offer placements?',
    ],
  },
  {
    id: 'berufszentrum-west',
    pathwayId: 'ausbildung',
    name: 'Berufszentrum West',
    programme: 'Career preparation · Business and services',
    neighbourhood: 'Westend',
    address: 'Reichsstraße 21, 14052 Berlin',
    commuteMinutes: 43,
    coordinate: { latitude: 52.5162, longitude: 13.2733 },
    websiteUrl: directoryUrl,
    requirementsUrl: pathways[2].resourceUrl,
    sourceDate: 'Demo record · 13 Sep 2026',
    matches: [
      'Structured career preparation supports a gradual next step.',
      'The business focus allows practical career exploration.',
    ],
    mismatches: ['The commute is close to the selected maximum.'],
    missingInformation: [
      'Can a higher school qualification be earned alongside training?',
      'What application support is available?',
    ],
  },
  {
    id: 'sozialcampus',
    pathwayId: 'ausbildung',
    name: 'Sozialcampus Kreuzberg',
    programme: 'Career preparation · Social care',
    neighbourhood: 'Kreuzberg',
    address: 'Urbanstraße 95, 10967 Berlin',
    commuteMinutes: 32,
    coordinate: { latitude: 52.4936, longitude: 13.4082 },
    websiteUrl: directoryUrl,
    requirementsUrl: pathways[2].resourceUrl,
    sourceDate: 'Demo record · 13 Sep 2026',
    matches: [
      'Social care connects with the health interest.',
      'The route offers practical learning and career exploration.',
    ],
    mismatches: ['A specialised route may not match a preference for broad options.'],
    missingInformation: [
      'What language level is expected for practical placements?',
      'Which later qualifications are available after completion?',
    ],
  },
];

export const demoProfile: Profile = {
  studentName: '',
  postcode: '10115',
  currentSchool: null,
  transitionStatement: 'conditions-to-confirm',
  qualification: 'may-qualify',
  upperSecondary: 'no',
  maxTravelMinutes: 45,
  student: {
    interests: 'technology',
    challenge: 'balanced',
    environment: 'practical',
    direction: 'open',
    avoid: 'commute',
  },
  parent: {
    optionsOpen: 'very',
    commute: 45,
    focus: 'maybe',
    support: 'structure',
    hope: 'flexibility',
  },
};
