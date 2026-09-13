import type { PathwayCard, Profile, RealityCheckResult, RealityStatus } from './guidanceData';

const SOURCE = 'Berlin demo transition rule card';
const SOURCE_DATE = 'Reviewed 13 Sep 2026';

function statusFromProfile(profile: Profile): RealityStatus {
  if (profile.transitionStatement === 'not-discussed') {
    return 'Needs confirmation';
  }
  if (
    profile.transitionStatement === 'another-route-recommended' ||
    profile.qualification === 'intermediate' ||
    profile.qualification === 'vocational'
  ) {
    return 'Not recommended with current information';
  }
  if (
    profile.transitionStatement === 'upper-secondary-possible' &&
    profile.qualification === 'upper-secondary'
  ) {
    return 'Currently open';
  }
  return 'Needs confirmation';
}

export function realityCheck(profile: Profile): RealityCheckResult {
  const hasTransitionAnswers = Boolean(profile.transitionStatement && profile.qualification);
  const status = statusFromProfile(profile);
  const hasNotDiscussedTransition = profile.transitionStatement === 'not-discussed';
  const verificationQuestion = hasNotDiscussedTransition
    ? 'When will transition guidance about options after Grade 10 take place?'
    : 'Based on my current report, which upper-secondary transitions can the school officially confirm, and what document records that decision?';
  const explanation = !hasTransitionAnswers
    ? 'Answer the transition and report questions to create a reality-check summary.'
    : hasNotDiscussedTransition
      ? 'No transition-guidance conversation has taken place yet. This is normal in Grade 9 and is not a negative result; ask the current school when guidance will happen.'
      : status === 'Currently open'
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
        title: 'Transition guidance conversation',
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
            : profile.upperSecondary
              ? 'A connected programme is not confirmed, so ask which partner routes the school supports.'
              : 'Answer the current-school programme question to complete this check.',
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
        status: profile.maxTravelMinutes === null ? 'Needs confirmation' : 'Currently open',
        explanation:
          profile.maxTravelMinutes === null
            ? 'Choose a maximum one-way travel time to use as a preference.'
            : `Options will be filtered using a maximum one-way travel preference of ${profile.maxTravelMinutes} minutes. Estimates must be checked before applying.`,
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
  ): Promise<GeneratedGuidance>;
}

function pathwayStatus(pathway: PathwayCard, base: RealityStatus): RealityStatus {
  if (pathway.id === 'ausbildung') return 'Currently open';
  return base;
}

export const guidanceService: GuidanceService = {
  async generateGuidance(profile, reality, pathwayCards) {
    const interest =
      profile.student.interests === 'unsure'
        ? 'keeping interests open'
        : profile.student.interests || 'open interests';
    const parentHope = profile.parent.hope || 'keeping options open';
    return {
      pathways: pathwayCards.map((pathway) => ({
        ...pathway,
        status: pathwayStatus(pathway, reality.status),
        whyFit: `${pathway.name} connects the student’s ${interest} preference with the parent priority of ${parentHope}.`,
      })),
      schoolMatches: [],
      potentialMismatches: [],
      missingInformation: [],
      schoolVisitQuestions: [],
      counsellorQuestion: reality.verificationQuestion,
      germanEmail: { subject: 'Fragen zum Bildungsgang', body: 'Deterministic demo draft' },
      orderedActionPlanTasks: ['Compare requirements', 'Send email', 'Attend an information event'],
    };
  },
};

// A future server adapter may read EXPO_PUBLIC_GUIDANCE_ENDPOINT and return validated JSON.
// It must receive only the supplied source facts and must preserve realityCheckResult.status.
export const GUIDANCE_ENDPOINT = process.env.EXPO_PUBLIC_GUIDANCE_ENDPOINT;
