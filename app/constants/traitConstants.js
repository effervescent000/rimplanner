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

const getTieredValueForSkill = (skill) => {
  if (skill) {
    if (skill.level > 4 && skill.passion) return VALUES.excellent;
    if (skill.passion || skill.level > 4) return VALUES.very_good;
    return VALUES.good;
  }
  return VALUES.neutral;
};

export const TRAITS = {
  DrugDesire: {
    name: "Drug Desire",
    value: (pawn, trait) => {
      const degrees = { 1: VALUES.bad, 2: VALUES.very_bad };
      return degrees[trait.degree];
    },
  },
  Industriousness: {
    name: "Industriousness",
    value: (pawn, trait) => {
      const degrees = { 1: VALUES.very_good };
      return degrees[trait.degree];
    },
  },
  Jealous: { name: "Jealous", value: () => VALUES.very_bad },
  NightOwl: { name: "Night owl", value: () => VALUES.neutral },
  Psychopath: { name: "Psycopath", value: () => VALUES.excellent },
  Pyromaniac: { name: "Pyromaniac", value: () => VALUES.very_bad },
  QuickSleeper: { name: "Quick sleeper", value: () => VALUES.very_good },
  ShootingAccuracy: {
    name: "Shooting Accuracy",
    value: (pawn, trait) => {
      const degrees = { 2: VALUES.good };
      return degrees[trait.degree];
    },
  },
  SpeedOffset: {
    name: "Speed Offset",
    value: (pawn, trait) => {
      const degrees = {
        1: VALUES.very_good,
      };
      return degrees[trait.degree];
    },
  },
  Undergrounder: { name: "Undergrounder", value: () => VALUES.good },
  // mod added traits below here
  SYR_Haggler: {
    name: "Silver tongue",
    value: ({
      skills: {
        skills: { li: skills },
      },
    }) => {
      const social = skills.find(({ def }) => def === SKILLS.social.name);
      return getTieredValueForSkill(social);
    },
    source: INDIVIDUALITY,
  },
  SYR_HandEyeCoordination: {
    name: "Hand-eye coordination",
    value: () => VALUES.very_good,
    source: INDIVIDUALITY,
  },
  SYR_MechanoidExpert: {
    name: "Mechanoid expert",
    value: () => VALUES.good,
    source: INDIVIDUALITY,
  },
  SYR_SteadyHands: {
    name: "Steady hands",
    value: ({
      skills: {
        skills: { li: skills },
      },
    }) => {
      const medicine = skills.find(({ def }) => def === SKILLS.medicine.name);
      return getTieredValueForSkill(medicine);
    },
  },
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
  VTE_Coward: {
    name: "Coward",
    value: () => VALUES.very_bad,
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
  VTE_HeavySleeper: {
    name: "Heavy sleeper",
    value: () => VALUES.very_bad,
    source: VANILLA_TRAITS_EXPANDED,
  },
  VTE_Prude: {
    name: "Prude",
    value: () => VALUES.bad,
    source: VANILLA_TRAITS_EXPANDED,
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
