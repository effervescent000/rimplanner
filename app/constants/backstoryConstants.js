import { LABOR_CATEGORIES } from "./constants";

const CHILDHOOD_BACKSTORIES = [
  { name: "CultChild3", incapable: [LABOR_CATEGORIES.intellectual] },
  { name: "MedicalAssistant12", incapable: [LABOR_CATEGORIES.firefighting] },
  {
    name: "TestSubject15",
    incapable: [LABOR_CATEGORIES.firefighting, LABOR_CATEGORIES.caring, LABOR_CATEGORIES.social],
  },
  { name: "Bookworm19", incapable: [LABOR_CATEGORIES.dumb] },
  { name: "StudentEngineer34", incapable: [LABOR_CATEGORIES.dumb] },
  { name: "Killer41", incapable: [LABOR_CATEGORIES.social] },
  {
    name: "ScienceProdigy65",
    incapable: [LABOR_CATEGORIES.firefighting, LABOR_CATEGORIES.violent],
  },
];

const ADULT_BACKSTORIES = [
  {
    name: "Assassin20",
    incapable: [
      LABOR_CATEGORIES.caring,
      LABOR_CATEGORIES.social,
      LABOR_CATEGORIES.cooking,
      LABOR_CATEGORIES.plantWork,
      LABOR_CATEGORIES.skilled,
      LABOR_CATEGORIES.dumb,
      LABOR_CATEGORIES.intellectual,
    ],
  },
  {
    name: "ConstructionEngineer32",
    incapable: [LABOR_CATEGORIES.intellectual, LABOR_CATEGORIES.cooking],
  },
  { name: "Healer35", incapable: [LABOR_CATEGORIES.mining, LABOR_CATEGORIES.dumb] },
];

export const BACKSTORIES_LOOKUP = [...CHILDHOOD_BACKSTORIES, ...ADULT_BACKSTORIES].reduce(
  (total, cur) => ({ ...total, [cur.name]: cur.incapable }),
  {}
);
