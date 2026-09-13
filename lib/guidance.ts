import type { PathwayCard, Profile, RealityCheckResult, RealityStatus } from './guidanceData';
import i18n from './i18n';

const guidanceText = (key: string, options?: Record<string, unknown>) =>
  i18n.t(`guidance.${key}`, options);

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
  const verificationQuestion = guidanceText(
    hasNotDiscussedTransition ? 'verificationNotDiscussed' : 'verification',
  );
  const explanation = !hasTransitionAnswers
    ? guidanceText('incomplete')
    : hasNotDiscussedTransition
      ? guidanceText('notDiscussed')
      : status === 'Currently open'
        ? guidanceText('open')
        : status === 'Needs confirmation'
          ? guidanceText('confirm')
          : guidanceText('blocked');
  const source = guidanceText('source');
  const reviewed = guidanceText('reviewed');

  return {
    status,
    explanation,
    sourceLabel: source,
    sourceDate: reviewed,
    verificationQuestion,
    checks: [
      {
        id: 'transition',
        title: guidanceText('transitionTitle'),
        status,
        explanation,
        sourceLabel: source,
        sourceDate: reviewed,
        verificationQuestion: status === 'Currently open' ? undefined : verificationQuestion,
      },
      {
        id: 'programme',
        title: guidanceText('programmeTitle'),
        status: profile.upperSecondary === 'yes' ? 'Currently open' : 'Needs confirmation',
        explanation:
          profile.upperSecondary === 'yes'
            ? guidanceText('programmeYes')
            : profile.upperSecondary
              ? guidanceText('programmeNo')
              : guidanceText('programmeEmpty'),
        sourceLabel: guidanceText('familyAnswer'),
        sourceDate: guidanceText('currentSession'),
        verificationQuestion:
          profile.upperSecondary === 'yes' ? undefined : guidanceText('programmeQuestion'),
      },
      {
        id: 'travel',
        title: guidanceText('travelTitle'),
        status: profile.maxTravelMinutes === null ? 'Needs confirmation' : 'Currently open',
        explanation:
          profile.maxTravelMinutes === null
            ? guidanceText('travelEmpty')
            : guidanceText('travel', { minutes: profile.maxTravelMinutes }),
        sourceLabel: guidanceText('familyAnswer'),
        sourceDate: guidanceText('currentSession'),
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
        ? i18n.t('pathways.keepingOpen')
        : profile.student.interests
          ? i18n.t(`questions.student.interests.options.${profile.student.interests}`)
          : i18n.t('pathways.openInterests');
    const parentHope = profile.parent.hope
      ? i18n.t(`questions.parent.hope.options.${profile.parent.hope}`)
      : i18n.t('pathways.keepingOptionsOpen');
    return {
      pathways: pathwayCards.map((pathway) => ({
        ...pathway,
        status: pathwayStatus(pathway, reality.status),
        whyFit: i18n.t('pathways.fit', { pathway: pathway.name, interest, hope: parentHope }),
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
