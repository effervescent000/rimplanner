import { makeValues } from "~/helpers/utils";

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
  BadBack: {
    name: "Bad back",
    value: () => makeValues(VALUES.bad),
  },
  AlcoholAddiction: { name: "Alcohol addiction", value: () => makeValues(VALUES.terrible) },
};
