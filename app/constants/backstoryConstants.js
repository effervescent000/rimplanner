import { LABOR_CATEGORIES } from "./constants";

const CHILDHOOD_BACKSTORIES = [
  { name: "MedicalAssistant12", incapable: [LABOR_CATEGORIES.firefighting] },
];

const ADULT_BACKSTORIES = [
  {
    name: "ConstructionEngineer32",
    incapable: [LABOR_CATEGORIES.intellectual, LABOR_CATEGORIES.cooking],
  },
];

export const BACKSTORIES_LOOKUP = [...CHILDHOOD_BACKSTORIES, ...ADULT_BACKSTORIES].reduce(
  (total, cur) => ({ ...total, [cur.name]: cur.incapable }),
  {}
);
