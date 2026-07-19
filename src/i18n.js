export const messages = {
  en: {
    langLabel: 'Language selection',
    eyebrow: 'University of Ottawa · Faculty of Engineering',
    title: 'Engineering Outcomes',
    tagline:
      'Undergraduate engineering enrollment numbers from 2020 to 2024.',
    stats: {
      totalLabel: 'Degrees conferred, 2024',
      totalDelta: 'vs 2020',
      growthLabel: 'Fastest-growing program',
      growthValue: 'Computer Science/​Software Engineering',
      growthDelta: 'degrees since 2020',
      retentionLabel: 'International retention, 2023 cohort',
      retentionDelta: 'pts since the 2019 cohort',
    },
    degrees: {
      title: 'Degrees conferred by program',
      context:
        'Undergraduate degrees awarded each spring, 2020 to 2024. Toggle a program to isolate its trend.',
      controlsLabel: 'Programs shown',
      yAxis: 'Degrees',
      empty: 'Select at least one program to draw the chart.',
      tableToggle: 'View the data as a table',
      tableCaption: 'Degrees conferred by program and year',
      yearHeader: 'Year',
    },
    retention: {
      title: 'Year-2 retention by demographic group',
      context:
        'Share of each entering cohort still enrolled at the start of second year. Pick a cohort to compare its groups.',
      cohortLabel: 'Entering cohort',
      compareLabel: 'Compare with',
      compareNone: 'None',
      cohortPrefix: 'Fall',
      tableToggle: 'View the data as a table',
      tableCaption: 'Year-2 retention rate by group, all cohorts',
      cohortHeader: 'Cohort',
    },
    programs: {
      ComputerScience: 'Computer Science/​Software Engineering',
      Electrical: 'Electrical Engineering',
      Mechanical: 'Mechanical Engineering',
      Civil: 'Civil Engineering',
      Chemical: 'Chemical Engineering',
    },
    groups: {
      Female: 'Female',
      Male: 'Male',
      International: 'International',
      Domestic: 'Domestic',
    },
    footer:
      'Source: uOttawa institutional data (illustrative). SEG3125 Assignment 5 — bilingual interactive dashboard.',
  },
  fr: {
    langLabel: 'Sélection de la langue',
    eyebrow: "Université d'Ottawa · Faculté de génie",
    title: 'Résultats en génie',
    tagline:
      'Effectifs étudiants au premier cycle en génie, de 2020 à 2024.',
    stats: {
      totalLabel: 'Diplômes décernés, 2024',
      totalDelta: 'par rapport à 2020',
      growthLabel: 'Programme en plus forte croissance',
      growthValue: 'Informatique/​Ingénierie du logiciel',
      growthDelta: 'de diplômes depuis 2020',
      retentionLabel: 'Rétention internationale, cohorte 2023',
      retentionDelta: 'pts depuis la cohorte 2019',
    },
    degrees: {
      title: 'Diplômes décernés par programme',
      context:
        'Diplômes de premier cycle décernés chaque printemps, de 2020 à 2024. Activez ou masquez un programme pour isoler sa tendance.',
      controlsLabel: 'Programmes affichés',
      yAxis: 'Diplômes',
      empty: 'Sélectionnez au moins un programme pour tracer le graphique.',
      tableToggle: 'Afficher les données en tableau',
      tableCaption: 'Diplômes décernés par programme et par année',
      yearHeader: 'Année',
    },
    retention: {
      title: 'Rétention en 2e année par groupe démographique',
      context:
        "Proportion de chaque cohorte entrante toujours inscrite au début de la deuxième année. Choisissez une cohorte pour comparer ses groupes.",
      cohortLabel: 'Cohorte entrante',
      compareLabel: 'Comparer avec',
      compareNone: 'Aucune',
      cohortPrefix: 'Automne',
      tableToggle: 'Afficher les données en tableau',
      tableCaption: 'Taux de rétention en 2e année par groupe, toutes cohortes',
      cohortHeader: 'Cohorte',
    },
    programs: {
      ComputerScience: 'Informatique/​Ingénierie du logiciel',
      Electrical: 'Génie électrique',
      Mechanical: 'Génie mécanique',
      Civil: 'Génie civil',
      Chemical: 'Génie chimique',
    },
    groups: {
      Female: 'Femmes',
      Male: 'Hommes',
      International: 'Internationaux',
      Domestic: 'Canadiens',
    },
    footer:
      "Source : données institutionnelles de l'uOttawa (illustratives). SEG3125, devoir 5 — tableau de bord interactif bilingue.",
  },
}

const intlLocale = (lang) => (lang === 'fr' ? 'fr-CA' : 'en-CA')

export function makeFormatters(lang) {
  const locale = intlLocale(lang)
  const number = new Intl.NumberFormat(locale)
  const percent = new Intl.NumberFormat(locale, {
    style: 'percent',
    maximumFractionDigits: 0,
  })
  return {
    number: (v) => number.format(v),
    // takes a 0–100 value; localizes both digits and the % sign spacing
    percent: (v) => percent.format(v / 100),
    signedPercent: (v) => (v > 0 ? '+' : v < 0 ? '−' : '') + percent.format(Math.abs(v) / 100),
    signedNumber: (v) => (v > 0 ? '+' : v < 0 ? '−' : '') + number.format(Math.abs(v)),
  }
}
