import { INDIVIDUALITY, VANILLA_TRAITS_EXPANDED } from "./modConstants";
import { SKILLS } from "./skillsConstants";

const VALUES = {
  excellent: 3,
  very_good: 2,
  good: 1,
  neutral: 0,
  bad: -1,
  very_bad: -2,
  terrible: -3,
};

export const TRAITS = {
  Undergrounder: { key: "Undergrounder", value: () => VALUES.good },
  // mod added traits below here
  SYR_StrongBack: {
    name: "Strong back",
    value: () => VALUES.good,
    source: INDIVIDUALITY,
  },
  VTE_AnimalLover: {
    name: "Animal Lover",
    value: ({
      skills: {
        skills: { li: skills },
      },
    }) => {
      const cooking = skills.find(({ def }) => def === SKILLS.cooking.name);
      if (cooking && cooking.passion) return VALUES.bad;
      return VALUES.neutral;
    },
    source: VANILLA_TRAITS_EXPANDED,
  },
  VTE_ChildOfSea: {
    name: "Ocean lover",
    // TODO maybe inlcude map data, if there's a way to figure out features?
    value: () => VALUES.neutral,
    source: VANILLA_TRAITS_EXPANDED,
  },
  VTE_Ecologist: {
    name: "Ecologist",
    value: ({
      skills: {
        skills: { li: skills },
      },
    }) => {
      const plantsAndAnimals = skills.filter(
        ({ def }) => def === SKILLS.animals.name || def === SKILLS.plants.name
      );
      if (plantsAndAnimals.some(({ passion }) => passion)) return VALUES.excellent;
      return VALUES.very_good;
    },
    source: INDIVIDUALITY,
  },
  VTE_Gastronomist: {
    name: "Gastronomist",
    value: ({
      skills: {
        skills: { li: skills },
      },
    }) => {
      const cooking = skills.find(({ def }) => def === SKILLS.cooking.name);
      if (cooking && cooking.passion) return VALUES.excellent;
      return VALUES.good;
    },
  },
  VTE_Slob: {
    name: "Slob",
    value: () => VALUES.bad,
    source: VANILLA_TRAITS_EXPANDED,
  },
  VTE_Tycoon: {
    name: "Tycoon",
    value: ({
      skills: {
        skills: { li: skills },
      },
    }) => {
      const social = skills.find(({ def }) => def === SKILLS.social.name);
      if (social && social.passion) return VALUES.excellent;
      return VALUES.very_good;
    },
    source: VANILLA_TRAITS_EXPANDED,
  },
};
