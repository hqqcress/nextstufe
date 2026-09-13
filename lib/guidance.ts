import type {
  DemoSchool,
  PathwayCard,
  Profile,
  RealityCheckResult,
  RealityStatus,
} from './guidanceData';

const SOURCE = 'Berlin demo transition rule card';
const SOURCE_DATE = 'Reviewed 13 Sep 2026';

function statusFromProfile(profile: Profile): RealityStatus {
  if (
    profile.transitionStatement === 'not-yet-eligible' ||
    profile.qualification === 'intermediate' ||
    profile.qualification === 'vocational'
  ) {
    return 'Not recommended with current information';
  }
  if (profile.transitionStatement === 'eligible' && profile.qualification === 'upper-secondary') {
    return 'Currently open';
  }
  return 'Needs confirmation';
}

export function realityCheck(profile: Profile): RealityCheckResult {
  const status = statusFromProfile(profile);
  const verificationQuestion =
    'Based on my current report, which upper-secondary transitions can the school officially confirm, and what document records that decision?';
  const explanation =
    status === 'Currently open'
      ? 'The demo answers point toward an upper-secondary transition. This is not an admission decision; confirm the recorded status with the current school.'
      : status === 'Needs confirmation'
        ? 'The demo information is not conclusive. Based on the demo rule card, confirm this transition status with your current school.'
        : 'The current demo information does not support recommending a direct upper-secondary transition yet. Ask the current school about requirements and alternative routes.';

  return {
    status,
    explanation,
    sourceLabel: SOURCE,
    sourceDate: SOURCE_DATE,
    verificationQuestion,
    checks: [
      {
        id: 'transition',
        title: 'Official transition statement',
        status,
        explanation,
        sourceLabel: SOURCE,
        sourceDate: SOURCE_DATE,
        verificationQuestion: status === 'Currently open' ? undefined : verificationQuestion,
      },
      {
        id: 'programme',
        title: 'Current-school connection',
        status: profile.upperSecondary === 'yes' ? 'Currently open' : 'Needs confirmation',
        explanation:
          profile.upperSecondary === 'yes'
            ? 'The profile says the current school has its own or a cooperating upper-secondary programme.'
            : 'A connected programme is not confirmed, so ask which partner routes the school supports.',
        sourceLabel: 'Family profile answer',
        sourceDate: 'Current session',
        verificationQuestion:
          profile.upperSecondary === 'yes'
            ? undefined
            : 'Which upper-secondary schools formally cooperate with this school, if any?',
      },
      {
        id: 'travel',
        title: 'Travel preference',
        status: 'Currently open',
        explanation: `Options will be filtered using a maximum one-way travel preference of ${profile.maxTravelMinutes} minutes. Estimates must be checked before applying.`,
        sourceLabel: 'Family profile answer',
        sourceDate: 'Current session',
      },
    ],
  };
}

export interface GuidancePathway extends PathwayCard {
  status: RealityStatus;
  whyFit: string;
}

export interface GeneratedGuidance {
  pathways: GuidancePathway[];
  schoolMatches: string[];
  potentialMismatches: string[];
  missingInformation: string[];
  schoolVisitQuestions: string[];
  counsellorQuestion: string;
  germanEmail: { subject: string; body: string };
  orderedActionPlanTasks: string[];
}

export interface GuidanceService {
  generateGuidance(
    profile: Profile,
    realityCheckResult: RealityCheckResult,
    pathwayCards: PathwayCard[],
    schoolCards: DemoSchool[],
  ): Promise<GeneratedGuidance>;
}

function pathwayStatus(pathway: PathwayCard, base: RealityStatus): RealityStatus {
  if (pathway.id === 'ausbildung') return 'Currently open';
  return base;
}

export const guidanceService: GuidanceService = {
  async generateGuidance(profile, reality, pathwayCards, schoolCards) {
    const interest =
      profile.student.interests === 'unsure' ? 'keeping interests open' : profile.student.interests;
    const parentHope = profile.parent.hope;
    return {
      pathways: pathwayCards.map((pathway) => ({
        ...pathway,
        status: pathwayStatus(pathway, reality.status),
        whyFit: `${pathway.name} connects the student’s ${interest} preference with the parent priority of ${parentHope}.`,
      })),
      schoolMatches: schoolCards.flatMap((school) => school.matches).slice(0, 3),
      potentialMismatches: schoolCards.flatMap((school) => school.mismatches).slice(0, 3),
      missingInformation: schoolCards.flatMap((school) => school.missingInformation).slice(0, 4),
      schoolVisitQuestions: schoolCards.flatMap((school) => school.missingInformation).slice(0, 3),
      counsellorQuestion: reality.verificationQuestion,
      germanEmail: { subject: 'Fragen zum Bildungsgang', body: 'Deterministic demo draft' },
      orderedActionPlanTasks: ['Compare requirements', 'Send email', 'Attend an information event'],
    };
  },
};

// A future server adapter may read EXPO_PUBLIC_GUIDANCE_ENDPOINT and return validated JSON.
// It must receive only the supplied source facts and must preserve realityCheckResult.status.
export const GUIDANCE_ENDPOINT = process.env.EXPO_PUBLIC_GUIDANCE_ENDPOINT;
