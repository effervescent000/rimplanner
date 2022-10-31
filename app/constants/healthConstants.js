import { makeValues } from "~/helpers/utils";
import { DAY } from "./constants";

const VALUES = {
  excellent: 3,
  very_good: 2,
  good: 1,
  neutral: 0,
  bad: -1,
  very_bad: -2,
  terrible: -3,
};

export const HEALTH_CONDITIONS = {
  AlcoholAddiction: { name: "Alcohol addiction", value: () => makeValues(VALUES.terrible) },
  BadBack: {
    name: "Bad back",
    value: () => makeValues(VALUES.bad),
  },
  Cataract: {
    name: "Cataract",
    value: () => makeValues(VALUES.very_bad),
  },
  SmokeleafAddiction: {
    name: "Smokeleaf dependence",
    value: () => makeValues(VALUES.terrible),
  },
};

export const LIFE_STAGES = [
  { key: "Adult", minAge: DAY * 60 * 16, bodySize: 1 },
  { key: "Child", minAge: DAY * 60 * 3, bodySize: 0.5, nutritionMod: 1 },
  { key: "Baby", minAge: 0, bodySize: 0.2, nutritionMod: 0.62 },
];
