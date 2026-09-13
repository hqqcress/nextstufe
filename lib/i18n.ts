import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

const i18n = createInstance();

export type AppLanguage = 'de' | 'en';
export const LANGUAGE_STORAGE_KEY = 'wegweisser.language';

const en = {
  common: {
    back: 'Back',
    tryAgain: 'Try again',
    backToPathways: 'Back to pathways',
    schoolNotFound: 'School not found',
    directoryUnavailable: 'The official school directory is unavailable',
    logo: 'Wegweisser logo',
    home: 'Wegweisser home',
    source: 'Source',
    ask: 'Ask',
    step: 'Step {{current}} of {{total}}',
    minutes: '{{count}} minutes',
    commuteMinutes: '{{count}} min commute',
  },
  language: {
    label: 'Language',
    english: 'English',
    german: 'Deutsch',
    accessibility: 'Choose app language',
  },
  status: {
    open: 'Currently open',
    needsConfirmation: 'Needs confirmation',
    notRecommended: 'Not recommended with current information',
  },
  home: {
    eyebrow: 'Berlin school pathway guide',
    titleNamed: 'Let’s make {{name}}’s next school step clearer.',
    title: 'Let’s make the next school step clearer.',
    description:
      'Start with a first name and Berlin postcode, then compare realistic education pathways together.',
    cardTitle: 'Tell us who this is for',
    nameLabel: 'Student’s first name',
    namePlaceholder: 'For example, Alex',
    nameHelp: 'A first name is enough. It stays in this guidance journey.',
    postcodeNamed: '{{name}}’s Berlin postcode',
    postcode: 'Berlin postcode',
    postcodePlaceholder: 'e.g. 10115',
    postcodeHelp:
      'We use the postcode area only for demo sorting. We do not use an exact home location.',
    start: 'Start reality check',
    disclaimer:
      'Demo guidance only. Confirm transition and admission details with the current school and each receiving school.',
  },
  reality: {
    eyebrow: 'Step 1 of 4',
    title: 'Reality check',
    description:
      'Use only information the current school has actually stated. You can choose “I’m not sure.”',
    continue: 'Continue to student priorities',
    schoolQuestion: 'Which school do you attend now?',
    schoolHelper:
      'Type at least two letters, then choose the matching school from Berlin’s official directory.',
    currentSchool: 'Current school',
    searchPlaceholder: 'Start typing a school name',
    searchHelp: 'Search by school name, Berlin school number, postcode, or locality.',
    loading: 'Loading the official Berlin school directory…',
    loadError:
      'The Berlin school directory is temporarily unavailable. Check your connection and type again to retry.',
    noMatch: 'No matching Berlin school found. Check the spelling or try the postcode.',
    schoolNumberYear: 'Berlin school number {{id}} · School year {{year}}',
    summary: 'Reality check summary',
    askCurrent: 'Ask your current school',
    askQuoted: 'Ask: “{{question}}”',
  },
  questions: {
    unsure: 'I’m not sure',
    reality: {
      transitionStatement: {
        title: 'Have you already discussed options after Grade 10 with your school?',
        helper:
          'This may be called an Anschlussberatung. Choose the closest answer—it is completely okay if you have not had this conversation yet. For Grade 9, “Not yet” is normal and is not a negative result.',
        options: {
          'upper-secondary-possible':
            'Yes — the school said an upper-secondary / Abitur route is possible',
          'conditions-to-confirm': 'Yes — it may be possible, but conditions need to be confirmed',
          'another-route-recommended': 'Yes — the school recommended another route for now',
          'not-discussed': 'Not yet — we have not had this conversation',
          unsure: 'I’m not sure',
        },
      },
      qualification: {
        title: 'What does your current report show?',
        helper: 'Choose the plain-language description that is closest.',
        options: {
          'upper-secondary': 'Upper-secondary transition is shown',
          'may-qualify': 'May qualify if current results continue',
          intermediate: 'Intermediate school qualification shown',
          vocational: 'Vocational preparation or qualification shown',
          'nothing-clear': 'Nothing clear about the next step',
          unsure: 'I’m not sure',
        },
      },
      upperSecondary: {
        title: 'Does your school have its own or a cooperating upper-secondary programme?',
        options: { yes: 'Yes', no: 'No', unsure: 'Unsure' },
      },
      maxTravelMinutes: { title: 'What is the maximum realistic one-way travel time?' },
    },
    student: {
      interests: {
        title: 'What subjects or areas interest you most?',
        options: {
          technology: 'Technology',
          health: 'Health & social care',
          business: 'Business & languages',
          arts: 'Arts & creative',
          broad: 'Broad academic',
          unsure: 'I’m not sure',
        },
      },
      challenge: {
        title: 'How much academic challenge do you want?',
        options: { more: 'More challenge', balanced: 'Balanced', gradual: 'Gradual support' },
      },
      environment: {
        title: 'What learning environment feels best?',
        options: {
          independent: 'Independent',
          collaborative: 'Collaborative',
          structured: 'Structured',
          practical: 'Practical / project-based',
        },
      },
      direction: {
        title: 'Which future direction sounds closest right now?',
        options: {
          abitur: 'Abitur',
          ausbildung: 'Ausbildung',
          open: 'Keeping options open',
          unsure: 'I’m not sure',
        },
      },
      avoid: {
        title: 'What do you not want in your next school?',
        options: {
          commute: 'Too much commute',
          narrow: 'Narrow focus',
          large: 'Large school',
          easy: 'Too little challenge',
          other: 'Other',
        },
      },
    },
    parent: {
      optionsOpen: {
        title: 'How important is keeping many future options open?',
        options: {
          very: 'Very important',
          somewhat: 'Somewhat',
          'not-main': 'Not the main priority',
        },
      },
      commute: {
        title: 'What commute range is acceptable?',
        helper: 'You can revise the travel choice from the reality check.',
      },
      focus: {
        title: 'Is a clear vocational or subject focus welcome?',
        options: { yes: 'Yes', maybe: 'Maybe', no: 'No' },
      },
      support: {
        title: 'What practical or support consideration matters?',
        options: {
          language: 'Language support',
          structure: 'Structure',
          accessibility: 'Accessibility',
          none: 'None stated',
          unsure: 'I’m not sure',
        },
      },
      hope: {
        title: 'What is the biggest hope for the next step?',
        options: {
          academic: 'Academic progression',
          career: 'Career exploration',
          wellbeing: 'Confidence & wellbeing',
          flexibility: 'Flexibility',
        },
      },
    },
  },
  student: {
    eyebrow: 'Step 2 of 4',
    titleNamed: '{{name}}’s priorities',
    title: 'Student priorities',
    descriptionNamed:
      'Five quick choices for {{name}}. Pick what feels closest today; this is not a permanent decision.',
    description:
      'Five quick choices. Pick what feels closest today; this is not a permanent decision.',
    continue: 'Continue to parent priorities',
  },
  parent: {
    eyebrow: 'Step 3 of 4',
    title: 'Parent priorities',
    description: 'Add the practical hopes and limits that should be visible in the comparison.',
    continue: 'Build shared profile',
  },
  profile: {
    eyebrow: 'Step 4 of 4',
    titleNamed: '{{name}}’s shared profile',
    title: 'Your shared profile',
    description: 'Student and parent priorities stay separate, then meet in a shared comparison.',
    studentNamed: '{{name}}’s priorities',
    student: 'Student priorities',
    parent: 'Parent priorities',
    noStudent: 'No student priorities selected yet.',
    noParent: 'No parent priorities selected yet.',
    agreeTitle: 'What you agree on',
    discussTitle: 'What to discuss',
    incompleteAgree: 'Complete both sets of priorities to identify shared preferences.',
    openAgree: 'You both value keeping future options open.',
    purposeAgree: 'You both want the next step to have a clear purpose.',
    incompleteDiscuss: 'Choose the unanswered priorities before comparing pathways.',
    commuteDiscuss: 'Discuss whether {{minutes}} minutes one way feels sustainable every day.',
    broadDiscuss: 'Discuss how broad or specialised the next programme should be.',
    seePathways: 'See three pathways',
    edit: 'Edit profile',
  },
  pathways: {
    eyebrow: 'Comparison',
    title: 'Three pathways',
    description:
      'Exactly three routes, ranked as different shapes of next step—not promises of admission.',
    loading: 'Preparing a source-limited comparison…',
    unavailable: 'Comparison unavailable',
    unavailableText:
      'We could not prepare all three demo pathways. Your answers are still saved in this session.',
    backProfile: 'Back to shared profile',
    whyFit: 'Why this may fit',
    clarify: 'Important to clarify',
    blockedQuestion:
      'Ask the current school: “What result or formal decision would make this route realistic?”',
    review: 'Review reality check',
    explore: 'Explore schools',
    oberstufe: {
      name: 'Gymnasiale Oberstufe',
      focus: 'Broad Abitur pathway',
      clarification:
        'Confirm the formal transition decision and the subject combinations available.',
    },
    'berufliches-gymnasium': {
      name: 'Berufliches Gymnasium',
      focus: 'Abitur with a vocational focus such as technology, business, or health/social care',
      clarification:
        'A stronger subject focus can reduce breadth; ask how binding the chosen field is.',
    },
    ausbildung: {
      name: 'Ausbildung-oriented pathway',
      focus: 'Practical professional route, potentially with further qualifications later',
      clarification:
        'Ask which qualification is earned and what later progression routes are documented.',
    },
    fit: '{{pathway}} connects the student’s {{interest}} preference with the parent priority of {{hope}}.',
    openInterests: 'open interests',
    keepingOpen: 'keeping interests open',
    keepingOptionsOpen: 'keeping options open',
  },
  schools: {
    invalidTitle: 'This pathway link is not valid',
    invalidText: 'Return to the pathway comparison and choose a pathway again.',
    eyebrow: 'Official school directory',
    title: 'Schools to investigate for {{pathway}}',
    description:
      'These are real Berlin schools from the official directory, ranked using school classification and postcode proximity to {{postcode}}. This is a research shortlist, not an admission or programme guarantee.',
    continue: 'Continue to action plan',
    loading: 'Loading the current Berlin school directory…',
    directoryErrorText:
      'We cannot show reliable recommendations without the source data. Check your connection and try again.',
    noMatch: 'No matching schools found',
    noMatchText:
      'The official directory did not return a safe match for this pathway. Try another pathway or verify options with your current school.',
    schoolNumber: 'School no. {{id}}',
    officialData: 'Official data',
    selected: 'Selected',
    select: 'Select school',
    details: 'View details',
    sourceNote: 'Source and matching note',
    sourceText:
      '{{source}} · {{licence}}. The public directory does not confirm current programme availability, admission, travel time, or fit with personal priorities. Confirm these directly with each school.',
  },
  schoolDetail: {
    loading: 'Loading school details',
    errorText: 'We cannot show reliable school details without the source data.',
    notFoundText: 'This school is not available in the current official Berlin directory.',
    eyebrow: 'Official school no. {{id}}',
    description:
      '{{programme}}. The pathway match is inferred from the official school classification and must be confirmed with the school.',
    draft: 'Draft a question email',
    officialRecord: 'Official directory record',
    schoolType: 'School type',
    address: 'Address',
    why: 'Why it appears in this shortlist',
    cannotConfirm: 'What the directory cannot confirm',
    questions: 'Questions to ask this school',
    officialSources: 'Official sources',
    sourcesText:
      'School identity, type, address and website: {{source}}. Programme and admissions must be checked separately.',
    openSchool: 'Open official school website',
    openDirectory: 'Open Berlin school directory',
    openGuidance: 'Open pathway guidance',
  },
  recommendation: {
    programme: {
      oberstufe: 'Possible general upper-secondary route',
      'berufliches-gymnasium': 'Possible vocational upper-secondary route',
      ausbildung: 'Possible vocational education or training route',
    },
    sourceYear: 'Official directory · school year {{year}}',
    source: 'Official Berlin school directory',
    classified: 'The official directory classifies this location as {{category}}.',
    samePostcode: 'Its postcode is in the same Berlin postcode area as {{postcode}}.',
    proximity: 'It is included after comparing Berlin postcode proximity.',
    limitation:
      'The directory does not confirm the exact programme, admission decision, or journey time.',
    questions: {
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
    },
  },
  guidance: {
    source: 'Berlin demo transition rule card',
    reviewed: 'Reviewed 13 Sep 2026',
    familyAnswer: 'Family profile answer',
    currentSession: 'Current session',
    verificationNotDiscussed:
      'When will transition guidance about options after Grade 10 take place?',
    verification:
      'Based on my current report, which upper-secondary transitions can the school officially confirm, and what document records that decision?',
    incomplete: 'Answer the transition and report questions to create a reality-check summary.',
    notDiscussed:
      'No transition-guidance conversation has taken place yet. This is normal in Grade 9 and is not a negative result; ask the current school when guidance will happen.',
    open: 'The demo answers point toward an upper-secondary transition. This is not an admission decision; confirm the recorded status with the current school.',
    confirm:
      'The demo information is not conclusive. Based on the demo rule card, confirm this transition status with your current school.',
    blocked:
      'The current demo information does not support recommending a direct upper-secondary transition yet. Ask the current school about requirements and alternative routes.',
    transitionTitle: 'Transition guidance conversation',
    programmeTitle: 'Current-school connection',
    travelTitle: 'Travel preference',
    programmeYes:
      'The profile says the current school has its own or a cooperating upper-secondary programme.',
    programmeNo:
      'A connected programme is not confirmed, so ask which partner routes the school supports.',
    programmeEmpty: 'Answer the current-school programme question to complete this check.',
    programmeQuestion: 'Which upper-secondary schools formally cooperate with this school, if any?',
    travelEmpty: 'Choose a maximum one-way travel time to use as a preference.',
    travel:
      'Options will be filtered using a maximum one-way travel preference of {{minutes}} minutes. Estimates must be checked before applying.',
  },
  email: {
    loading: 'Loading the selected school…',
    notFoundText: 'Choose a school from the official recommendation list before drafting an email.',
    step: 'Step 5 of 5',
    eyebrow: 'Editable template',
    title: 'Ask {{school}}',
    description:
      'Edit this before sending. The questions focus on facts that the public directory cannot confirm.',
    subjectLabel: 'Subject',
    messageLabel: 'Message',
    warning:
      'The app does not send emails. Copy the draft and send it using your preferred email app after checking the wording.',
    copied: 'Copied',
    copy: 'Copy draft',
    actionPlan: 'Build action plan',
    subject: 'Questions about transition options at {{school}}',
    child: 'our child',
    body: 'Dear {{school}} team,\n\nWe are exploring options after Grade 10 for {{student}} and found your school in the official Berlin school directory.\n\nCould you please tell us:\n\n{{questions}}\n\nWe understand that the directory listing does not confirm programme availability or admission.\n\nKind regards',
  },
  plan: {
    loading: 'Building your action plan',
    errorText: 'Your selected school cannot be verified right now.',
    needed: 'One step needed',
    chooseFirst: 'Choose a real school first',
    chooseText:
      'Select a school from the official Berlin directory so the plan can use the correct name, address, and follow-up questions.',
    choose: 'Choose a pathway and school',
    eyebrow: 'Your next steps',
    title: 'A practical action plan',
    progress: '{{completed}} of {{total}} complete. This plan is saved for the current session.',
    return: 'Return to overview',
    selected: 'Selected official school',
    stepOwner: 'Step {{step}} · {{owner}}',
    markComplete: 'Mark {{title}} complete',
    boundary: 'Important boundary',
    boundaryText:
      'The shortlist and plan support research. They do not determine eligibility, admission, programme availability, or deadlines.',
    owners: { both: 'Parent and student', parent: 'Parent', student: 'Student' },
    transition: {
      title: 'Ask the current school when transition guidance will take place.',
      reason:
        'For Grade 9, not having had this conversation yet can be normal. Asking now clarifies the next step without treating it as a negative result.',
      link: 'Review reality check',
    },
    contact: {
      title: 'Contact {{school}}',
      reason:
        'Confirm current programme availability and admission directly; the official directory does not publish or guarantee these details.',
      link: 'Open email draft',
    },
    visit: {
      title: 'Plan a visit to {{school}}',
      reason: 'Use the visit to verify the environment and route to {{place}}.',
      link: 'Review school',
    },
    requirements: {
      title: 'Confirm pathway requirements',
      reason:
        'Ask the current school and the recommended school which certificates, grades, deadlines, and documents apply to this student.',
      link: 'Review school questions',
    },
  },
  install: {
    title: 'Add Wegweisser to home screen',
    description: 'Install this app for a full-screen experience',
    later: 'Not now',
    install: 'Install',
    ios: 'Tap Share, then “Add to Home Screen” to install this app',
    gotIt: 'Got it',
  },
  notFound: { title: 'Oops!', text: 'This screen doesn’t exist.', home: 'Go to home screen!' },
  map: {
    unavailable: 'Map unavailable in this runtime',
    nativeNeeded: 'This screen needs the native map view.',
  },
};

const de: typeof en = {
  common: {
    back: 'Zurück',
    tryAgain: 'Erneut versuchen',
    backToPathways: 'Zurück zu den Bildungswegen',
    schoolNotFound: 'Schule nicht gefunden',
    directoryUnavailable: 'Das offizielle Schulverzeichnis ist nicht verfügbar',
    logo: 'Wegweisser-Logo',
    home: 'Wegweisser-Startseite',
    source: 'Quelle',
    ask: 'Frage',
    step: 'Schritt {{current}} von {{total}}',
    minutes: '{{count}} Minuten',
    commuteMinutes: '{{count}} Min. Fahrtzeit',
  },
  language: {
    label: 'Sprache',
    english: 'English',
    german: 'Deutsch',
    accessibility: 'App-Sprache auswählen',
  },
  status: {
    open: 'Derzeit möglich',
    needsConfirmation: 'Bestätigung erforderlich',
    notRecommended: 'Mit den aktuellen Informationen nicht empfohlen',
  },
  home: {
    eyebrow: 'Berliner Schulwegweiser',
    titleNamed: 'Machen wir den nächsten Schulschritt für {{name}} klarer.',
    title: 'Machen wir den nächsten Schulschritt klarer.',
    description:
      'Beginnt mit einem Vornamen und einer Berliner Postleitzahl und vergleicht dann gemeinsam realistische Bildungswege.',
    cardTitle: 'Für wen ist die Beratung?',
    nameLabel: 'Vorname des Kindes',
    namePlaceholder: 'Zum Beispiel Alex',
    nameHelp: 'Ein Vorname genügt. Er bleibt innerhalb dieser Beratung.',
    postcodeNamed: 'Berliner Postleitzahl von {{name}}',
    postcode: 'Berliner Postleitzahl',
    postcodePlaceholder: 'z. B. 10115',
    postcodeHelp:
      'Wir verwenden nur den Postleitzahlenbereich für die Demo-Sortierung, nicht den genauen Wohnort.',
    start: 'Realitätscheck starten',
    disclaimer:
      'Nur Demo-Beratung. Übergangs- und Aufnahmedetails bitte mit der aktuellen und den aufnehmenden Schulen klären.',
  },
  reality: {
    eyebrow: 'Schritt 1 von 4',
    title: 'Realitätscheck',
    description:
      'Verwendet nur Angaben, die die aktuelle Schule tatsächlich gemacht hat. „Ich bin nicht sicher“ ist möglich.',
    continue: 'Weiter zu den Prioritäten des Kindes',
    schoolQuestion: 'Welche Schule besuchst du derzeit?',
    schoolHelper:
      'Gib mindestens zwei Buchstaben ein und wähle dann die passende Schule aus dem offiziellen Berliner Verzeichnis.',
    currentSchool: 'Aktuelle Schule',
    searchPlaceholder: 'Schulnamen eingeben',
    searchHelp: 'Suche nach Schulname, Berliner Schulnummer, Postleitzahl oder Ortsteil.',
    loading: 'Offizielles Berliner Schulverzeichnis wird geladen…',
    loadError:
      'Das Berliner Schulverzeichnis ist vorübergehend nicht verfügbar. Prüfe die Verbindung und tippe erneut, um es nochmals zu versuchen.',
    noMatch:
      'Keine passende Berliner Schule gefunden. Prüfe die Schreibweise oder versuche es mit der Postleitzahl.',
    schoolNumberYear: 'Berliner Schulnummer {{id}} · Schuljahr {{year}}',
    summary: 'Zusammenfassung des Realitätschecks',
    askCurrent: 'Frage deine aktuelle Schule',
    askQuoted: 'Frage: „{{question}}“',
  },
  questions: {
    unsure: 'Ich bin nicht sicher',
    reality: {
      transitionStatement: {
        title: 'Habt ihr mit der Schule bereits über Möglichkeiten nach der 10. Klasse gesprochen?',
        helper:
          'Dies kann Anschlussberatung heißen. Wähle die passendste Antwort. Es ist völlig in Ordnung, wenn dieses Gespräch noch nicht stattgefunden hat. In Klasse 9 ist „Noch nicht“ normal und kein negatives Ergebnis.',
        options: {
          'upper-secondary-possible':
            'Ja — laut Schule ist ein Weg zur Oberstufe / zum Abitur möglich',
          'conditions-to-confirm':
            'Ja — möglicherweise, aber Bedingungen müssen noch geklärt werden',
          'another-route-recommended': 'Ja — die Schule empfiehlt vorerst einen anderen Weg',
          'not-discussed': 'Noch nicht — dieses Gespräch hat nicht stattgefunden',
          unsure: 'Ich bin nicht sicher',
        },
      },
      qualification: {
        title: 'Was steht im aktuellen Zeugnis?',
        helper: 'Wähle die Beschreibung, die am besten passt.',
        options: {
          'upper-secondary': 'Übergang in die Oberstufe ist ausgewiesen',
          'may-qualify': 'Bei gleichbleibenden Leistungen möglicherweise qualifiziert',
          intermediate: 'Mittlerer Schulabschluss ist ausgewiesen',
          vocational: 'Berufsvorbereitung oder beruflicher Abschluss ist ausgewiesen',
          'nothing-clear': 'Keine klare Angabe zum nächsten Schritt',
          unsure: 'Ich bin nicht sicher',
        },
      },
      upperSecondary: {
        title: 'Hat deine Schule eine eigene oder kooperierende gymnasiale Oberstufe?',
        options: { yes: 'Ja', no: 'Nein', unsure: 'Nicht sicher' },
      },
      maxTravelMinutes: {
        title: 'Wie lang darf der realistische einfache Schulweg höchstens sein?',
      },
    },
    student: {
      interests: {
        title: 'Welche Fächer oder Bereiche interessieren dich am meisten?',
        options: {
          technology: 'Technik',
          health: 'Gesundheit & Soziales',
          business: 'Wirtschaft & Sprachen',
          arts: 'Kunst & Kreatives',
          broad: 'Breit akademisch',
          unsure: 'Ich bin nicht sicher',
        },
      },
      challenge: {
        title: 'Wie viel schulische Herausforderung möchtest du?',
        options: {
          more: 'Mehr Herausforderung',
          balanced: 'Ausgewogen',
          gradual: 'Schrittweise Unterstützung',
        },
      },
      environment: {
        title: 'Welche Lernumgebung passt am besten?',
        options: {
          independent: 'Selbstständig',
          collaborative: 'Gemeinsam',
          structured: 'Strukturiert',
          practical: 'Praktisch / projektbasiert',
        },
      },
      direction: {
        title: 'Welche Zukunftsrichtung passt im Moment am ehesten?',
        options: {
          abitur: 'Abitur',
          ausbildung: 'Ausbildung',
          open: 'Möglichkeiten offenhalten',
          unsure: 'Ich bin nicht sicher',
        },
      },
      avoid: {
        title: 'Was möchtest du an deiner nächsten Schule vermeiden?',
        options: {
          commute: 'Zu langer Schulweg',
          narrow: 'Zu enger Schwerpunkt',
          large: 'Große Schule',
          easy: 'Zu wenig Herausforderung',
          other: 'Anderes',
        },
      },
    },
    parent: {
      optionsOpen: {
        title: 'Wie wichtig ist es, viele zukünftige Möglichkeiten offenzuhalten?',
        options: {
          very: 'Sehr wichtig',
          somewhat: 'Teilweise',
          'not-main': 'Nicht die höchste Priorität',
        },
      },
      commute: {
        title: 'Welche Fahrtzeit ist akzeptabel?',
        helper: 'Die Auswahl aus dem Realitätscheck kann hier geändert werden.',
      },
      focus: {
        title: 'Ist ein klarer beruflicher oder fachlicher Schwerpunkt erwünscht?',
        options: { yes: 'Ja', maybe: 'Vielleicht', no: 'Nein' },
      },
      support: {
        title: 'Welche praktische Unterstützung ist wichtig?',
        options: {
          language: 'Sprachförderung',
          structure: 'Struktur',
          accessibility: 'Barrierefreiheit',
          none: 'Keine angegeben',
          unsure: 'Ich bin nicht sicher',
        },
      },
      hope: {
        title: 'Was ist die größte Hoffnung für den nächsten Schritt?',
        options: {
          academic: 'Schulische Weiterentwicklung',
          career: 'Berufsorientierung',
          wellbeing: 'Selbstvertrauen & Wohlbefinden',
          flexibility: 'Flexibilität',
        },
      },
    },
  },
  student: {
    eyebrow: 'Schritt 2 von 4',
    titleNamed: 'Prioritäten von {{name}}',
    title: 'Prioritäten des Kindes',
    descriptionNamed:
      'Fünf kurze Entscheidungen für {{name}}. Wähle, was heute am ehesten passt; dies ist keine dauerhafte Entscheidung.',
    description:
      'Fünf kurze Entscheidungen. Wähle, was heute am ehesten passt; dies ist keine dauerhafte Entscheidung.',
    continue: 'Weiter zu den Prioritäten der Eltern',
  },
  parent: {
    eyebrow: 'Schritt 3 von 4',
    title: 'Prioritäten der Eltern',
    description: 'Ergänzt praktische Wünsche und Grenzen, die im Vergleich sichtbar sein sollen.',
    continue: 'Gemeinsames Profil erstellen',
  },
  profile: {
    eyebrow: 'Schritt 4 von 4',
    titleNamed: 'Gemeinsames Profil von {{name}}',
    title: 'Euer gemeinsames Profil',
    description:
      'Die Prioritäten von Kind und Eltern bleiben getrennt und fließen dann in einen gemeinsamen Vergleich ein.',
    studentNamed: 'Prioritäten von {{name}}',
    student: 'Prioritäten des Kindes',
    parent: 'Prioritäten der Eltern',
    noStudent: 'Noch keine Prioritäten des Kindes ausgewählt.',
    noParent: 'Noch keine Prioritäten der Eltern ausgewählt.',
    agreeTitle: 'Worin ihr übereinstimmt',
    discussTitle: 'Was ihr besprechen solltet',
    incompleteAgree: 'Vervollständigt beide Prioritäten-Sets, um Gemeinsamkeiten zu erkennen.',
    openAgree: 'Ihr möchtet beide zukünftige Möglichkeiten offenhalten.',
    purposeAgree: 'Ihr möchtet beide einen nächsten Schritt mit klarem Ziel.',
    incompleteDiscuss: 'Beantwortet die offenen Prioritäten, bevor ihr Bildungswege vergleicht.',
    commuteDiscuss: 'Besprecht, ob {{minutes}} Minuten pro Weg jeden Tag dauerhaft machbar sind.',
    broadDiscuss: 'Besprecht, wie breit oder spezialisiert der nächste Bildungsgang sein soll.',
    seePathways: 'Drei Bildungswege ansehen',
    edit: 'Profil bearbeiten',
  },
  pathways: {
    eyebrow: 'Vergleich',
    title: 'Drei Bildungswege',
    description:
      'Genau drei Wege als unterschiedliche Formen des nächsten Schritts — nicht als Aufnahmeversprechen.',
    loading: 'Quellenbegrenzter Vergleich wird vorbereitet…',
    unavailable: 'Vergleich nicht verfügbar',
    unavailableText:
      'Nicht alle drei Demo-Bildungswege konnten vorbereitet werden. Eure Antworten bleiben für diese Sitzung erhalten.',
    backProfile: 'Zurück zum gemeinsamen Profil',
    whyFit: 'Warum dies passen könnte',
    clarify: 'Wichtig zu klären',
    blockedQuestion:
      'Fragt die aktuelle Schule: „Welches Ergebnis oder welche formale Entscheidung würde diesen Weg realistisch machen?“',
    review: 'Realitätscheck prüfen',
    explore: 'Schulen erkunden',
    oberstufe: {
      name: 'Gymnasiale Oberstufe',
      focus: 'Breiter Weg zum Abitur',
      clarification:
        'Klärt die formale Übergangsentscheidung und die verfügbaren Fächerkombinationen.',
    },
    'berufliches-gymnasium': {
      name: 'Berufliches Gymnasium',
      focus: 'Abitur mit beruflichem Schwerpunkt wie Technik, Wirtschaft oder Gesundheit/Soziales',
      clarification:
        'Ein stärkerer Schwerpunkt kann die Breite einschränken; fragt, wie verbindlich das gewählte Feld ist.',
    },
    ausbildung: {
      name: 'Ausbildungsorientierter Weg',
      focus: 'Praktischer beruflicher Weg mit möglichen späteren Weiterqualifikationen',
      clarification:
        'Fragt, welcher Abschluss erworben wird und welche späteren Weiterbildungswege dokumentiert sind.',
    },
    fit: '{{pathway}} verbindet das Interesse „{{interest}}“ des Kindes mit der Elternpriorität „{{hope}}“.',
    openInterests: 'offene Interessen',
    keepingOpen: 'Interessen offenhalten',
    keepingOptionsOpen: 'Möglichkeiten offenhalten',
  },
  schools: {
    invalidTitle: 'Dieser Bildungsweg-Link ist ungültig',
    invalidText: 'Kehrt zum Vergleich zurück und wählt erneut einen Bildungsweg.',
    eyebrow: 'Offizielles Schulverzeichnis',
    title: 'Schulen zur Prüfung für {{pathway}}',
    description:
      'Dies sind echte Berliner Schulen aus dem offiziellen Verzeichnis, geordnet nach Schulklassifikation und Nähe zur Postleitzahl {{postcode}}. Die Liste dient der Recherche und ist keine Aufnahme- oder Programmzusage.',
    continue: 'Weiter zum Aktionsplan',
    loading: 'Aktuelles Berliner Schulverzeichnis wird geladen…',
    directoryErrorText:
      'Ohne die Quelldaten können wir keine verlässlichen Empfehlungen anzeigen. Prüft die Verbindung und versucht es erneut.',
    noMatch: 'Keine passenden Schulen gefunden',
    noMatchText:
      'Das offizielle Verzeichnis hat keine sichere Übereinstimmung für diesen Weg geliefert. Versucht einen anderen Weg oder klärt Möglichkeiten mit der aktuellen Schule.',
    schoolNumber: 'Schulnr. {{id}}',
    officialData: 'Offizielle Daten',
    selected: 'Ausgewählt',
    select: 'Schule auswählen',
    details: 'Details ansehen',
    sourceNote: 'Quelle und Hinweis zur Zuordnung',
    sourceText:
      '{{source}} · {{licence}}. Das öffentliche Verzeichnis bestätigt weder aktuelle Programme noch Aufnahme, Fahrtzeit oder persönliche Passung. Klärt dies direkt mit jeder Schule.',
  },
  schoolDetail: {
    loading: 'Schuldetails werden geladen',
    errorText: 'Ohne die Quelldaten können wir keine verlässlichen Schuldetails anzeigen.',
    notFoundText: 'Diese Schule ist im aktuellen offiziellen Berliner Verzeichnis nicht verfügbar.',
    eyebrow: 'Offizielle Schulnr. {{id}}',
    description:
      '{{programme}}. Die Zuordnung zum Bildungsweg wird aus der offiziellen Schulklassifikation abgeleitet und muss mit der Schule bestätigt werden.',
    draft: 'Frage-E-Mail entwerfen',
    officialRecord: 'Offizieller Verzeichniseintrag',
    schoolType: 'Schulart',
    address: 'Adresse',
    why: 'Warum diese Schule auf der Liste steht',
    cannotConfirm: 'Was das Verzeichnis nicht bestätigen kann',
    questions: 'Fragen an diese Schule',
    officialSources: 'Offizielle Quellen',
    sourcesText:
      'Schulidentität, Schulart, Adresse und Website: {{source}}. Programm und Aufnahme müssen separat geprüft werden.',
    openSchool: 'Offizielle Schulwebsite öffnen',
    openDirectory: 'Berliner Schulverzeichnis öffnen',
    openGuidance: 'Hinweise zum Bildungsweg öffnen',
  },
  recommendation: {
    programme: {
      oberstufe: 'Möglicher allgemeinbildender Oberstufenweg',
      'berufliches-gymnasium': 'Möglicher beruflicher Oberstufenweg',
      ausbildung: 'Möglicher Weg in berufliche Bildung oder Ausbildung',
    },
    sourceYear: 'Offizielles Verzeichnis · Schuljahr {{year}}',
    source: 'Offizielles Berliner Schulverzeichnis',
    classified: 'Das offizielle Verzeichnis klassifiziert diesen Standort als {{category}}.',
    samePostcode:
      'Die Postleitzahl liegt im selben Berliner Postleitzahlenbereich wie {{postcode}}.',
    proximity: 'Die Schule wurde nach Vergleich der Berliner Postleitzahlennähe aufgenommen.',
    limitation:
      'Das Verzeichnis bestätigt weder das genaue Programm noch Aufnahmeentscheidung oder Fahrtzeit.',
    questions: {
      oberstufe: [
        'Nimmt dieser Standort externe Schülerinnen und Schüler in die gymnasiale Oberstufe auf?',
        'Welche Aufnahmebedingungen und Fächerkombinationen gelten im nächsten Schuljahr?',
      ],
      'berufliches-gymnasium': [
        'Bietet diese Schule derzeit ein berufliches Gymnasium mit Abitur an?',
        'Welcher berufliche Schwerpunkt und welche Aufnahmebedingungen gelten im nächsten Schuljahr?',
      ],
      ausbildung: [
        'Welche dualen oder schulischen Bildungsgänge werden hier aktuell angeboten?',
        'Welchen Abschluss, betrieblichen Platz und welche Bewerbungsunterlagen erfordert jeder Bildungsgang?',
      ],
    },
  },
  guidance: {
    source: 'Berliner Demo-Regelkarte zum Übergang',
    reviewed: 'Geprüft am 13. Sep. 2026',
    familyAnswer: 'Angabe aus dem Familienprofil',
    currentSession: 'Aktuelle Sitzung',
    verificationNotDiscussed:
      'Wann findet die Anschlussberatung zu den Möglichkeiten nach der 10. Klasse statt?',
    verification:
      'Welche Übergänge in die Oberstufe kann die Schule auf Grundlage meines aktuellen Zeugnisses offiziell bestätigen und in welchem Dokument wird dies festgehalten?',
    incomplete:
      'Beantwortet die Fragen zum Übergang und Zeugnis, um eine Zusammenfassung zu erstellen.',
    notDiscussed:
      'Es hat noch keine Anschlussberatung stattgefunden. Das ist in Klasse 9 normal und kein negatives Ergebnis; fragt die aktuelle Schule, wann die Beratung stattfindet.',
    open: 'Die Demo-Antworten deuten auf einen Übergang in die Oberstufe hin. Dies ist keine Aufnahmeentscheidung; bestätigt den dokumentierten Status mit der aktuellen Schule.',
    confirm:
      'Die Demo-Informationen sind nicht eindeutig. Bestätigt den Übergangsstatus anhand der Demo-Regelkarte mit der aktuellen Schule.',
    blocked:
      'Die aktuellen Demo-Informationen reichen noch nicht aus, um einen direkten Übergang in die Oberstufe zu empfehlen. Fragt nach Voraussetzungen und Alternativen.',
    transitionTitle: 'Anschlussberatung',
    programmeTitle: 'Verbindung der aktuellen Schule',
    travelTitle: 'Fahrtzeit-Präferenz',
    programmeYes: 'Laut Profil hat die aktuelle Schule eine eigene oder kooperierende Oberstufe.',
    programmeNo:
      'Ein verbundener Bildungsgang ist nicht bestätigt. Fragt, welche Partnerschulen unterstützt werden.',
    programmeEmpty: 'Beantwortet die Frage zum Oberstufenangebot der aktuellen Schule.',
    programmeQuestion:
      'Mit welchen Oberstufenschulen kooperiert diese Schule gegebenenfalls offiziell?',
    travelEmpty: 'Wählt eine maximale einfache Fahrtzeit als Präferenz.',
    travel:
      'Optionen werden mit einer maximalen einfachen Fahrtzeit von {{minutes}} Minuten gefiltert. Schätzungen müssen vor einer Bewerbung geprüft werden.',
  },
  email: {
    loading: 'Ausgewählte Schule wird geladen…',
    notFoundText:
      'Wählt eine Schule aus der offiziellen Empfehlungsliste, bevor ihr eine E-Mail entwerft.',
    step: 'Schritt 5 von 5',
    eyebrow: 'Bearbeitbare Vorlage',
    title: '{{school}} fragen',
    description:
      'Bearbeitet den Text vor dem Senden. Die Fragen betreffen Fakten, die das öffentliche Verzeichnis nicht bestätigen kann.',
    subjectLabel: 'Betreff',
    messageLabel: 'Nachricht',
    warning:
      'Die App versendet keine E-Mails. Kopiert den Entwurf, prüft den Wortlaut und sendet ihn mit eurer bevorzugten E-Mail-App.',
    copied: 'Kopiert',
    copy: 'Entwurf kopieren',
    actionPlan: 'Aktionsplan erstellen',
    subject: 'Fragen zu Übergangsmöglichkeiten an der {{school}}',
    child: 'unser Kind',
    body: 'Guten Tag liebes Team der {{school}},\n\nwir prüfen für {{student}} Möglichkeiten nach der 10. Klasse und haben Ihre Schule im offiziellen Berliner Schulverzeichnis gefunden.\n\nKönnten Sie uns bitte Folgendes mitteilen:\n\n{{questions}}\n\nUns ist bewusst, dass der Verzeichniseintrag weder die Verfügbarkeit eines Bildungsgangs noch die Aufnahme bestätigt.\n\nMit freundlichen Grüßen',
  },
  plan: {
    loading: 'Euer Aktionsplan wird erstellt',
    errorText: 'Die ausgewählte Schule kann derzeit nicht überprüft werden.',
    needed: 'Noch ein Schritt',
    chooseFirst: 'Wählt zuerst eine echte Schule',
    chooseText:
      'Wählt eine Schule aus dem offiziellen Berliner Verzeichnis, damit der Plan den richtigen Namen, die Adresse und die passenden Fragen verwendet.',
    choose: 'Bildungsweg und Schule wählen',
    eyebrow: 'Eure nächsten Schritte',
    title: 'Ein praktischer Aktionsplan',
    progress:
      '{{completed}} von {{total}} erledigt. Dieser Plan bleibt für die aktuelle Sitzung gespeichert.',
    return: 'Zurück zur Übersicht',
    selected: 'Ausgewählte offizielle Schule',
    stepOwner: 'Schritt {{step}} · {{owner}}',
    markComplete: '{{title}} als erledigt markieren',
    boundary: 'Wichtige Grenze',
    boundaryText:
      'Die Auswahlliste und der Plan unterstützen die Recherche. Sie entscheiden nicht über Berechtigung, Aufnahme, Programmverfügbarkeit oder Fristen.',
    owners: { both: 'Eltern und Kind', parent: 'Eltern', student: 'Kind' },
    transition: {
      title: 'Fragt die aktuelle Schule, wann die Anschlussberatung stattfindet.',
      reason:
        'In Klasse 9 kann es normal sein, dass dieses Gespräch noch nicht stattgefunden hat. Eine Nachfrage klärt den nächsten Schritt, ohne dies als negatives Ergebnis zu werten.',
      link: 'Realitätscheck prüfen',
    },
    contact: {
      title: '{{school}} kontaktieren',
      reason:
        'Klärt aktuelle Programme und Aufnahme direkt; das offizielle Verzeichnis veröffentlicht oder garantiert diese Details nicht.',
      link: 'E-Mail-Entwurf öffnen',
    },
    visit: {
      title: 'Besuch bei {{school}} planen',
      reason: 'Nutzt den Besuch, um die Umgebung und den Weg nach {{place}} zu prüfen.',
      link: 'Schule prüfen',
    },
    requirements: {
      title: 'Voraussetzungen des Bildungswegs klären',
      reason:
        'Fragt die aktuelle und die empfohlene Schule, welche Abschlüsse, Noten, Fristen und Unterlagen für dieses Kind gelten.',
      link: 'Schulfragen prüfen',
    },
  },
  install: {
    title: 'Wegweisser zum Startbildschirm hinzufügen',
    description: 'Installiere die App für die Vollbildansicht',
    later: 'Nicht jetzt',
    install: 'Installieren',
    ios: 'Tippe auf „Teilen“ und dann auf „Zum Home-Bildschirm“, um die App zu installieren',
    gotIt: 'Verstanden',
  },
  notFound: { title: 'Hoppla!', text: 'Diese Seite existiert nicht.', home: 'Zur Startseite' },
  map: {
    unavailable: 'Karte ist in dieser Umgebung nicht verfügbar',
    nativeNeeded: 'Diese Ansicht benötigt die native Kartenansicht.',
  },
};

export function deviceLanguage(): AppLanguage {
  return getLocales()[0]?.languageCode === 'de' ? 'de' : 'en';
}

void i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, de: { translation: de } },
  lng: deviceLanguage(),
  fallbackLng: 'en',
  supportedLngs: ['en', 'de'],
  interpolation: { escapeValue: false },
  returnNull: false,
});

export async function hydrateLanguage(): Promise<AppLanguage> {
  const stored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
  const language: AppLanguage = stored === 'de' || stored === 'en' ? stored : deviceLanguage();
  await i18n.changeLanguage(language);
  return language;
}

export async function setAppLanguage(language: AppLanguage): Promise<void> {
  await i18n.changeLanguage(language);
  await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
}

export default i18n;
