import { mods } from "./modConstants";
import { SKILLS } from "./skillsConstants";
import { makeValues } from "app/helpers/utils";
import { SkillParams, ValueMapping } from "app/types/interfaces";

const VALUES = {
  excellent: 3,
  very_good: 2,
  good: 1,
  neutral: 0,
  bad: -1,
  very_bad: -2,
  terrible: -3,
};

const getTieredValueForSkill = (skill: SkillParams | undefined) => {
  if (skill) {
    if (skill.level > 4 && skill.passion) return VALUES.excellent;
    if (skill.passion || skill.level > 4) return VALUES.very_good;
    return VALUES.good;
  }
  return VALUES.neutral;
};

export const TRAITS: ValueMapping = {
  Abrasive: {
    name: "Abrasive",
    value: () => makeValues(VALUES.bad, { slaveValue: VALUES.neutral }),
  },
  Beauty: {
    name: "Beauty",
    value: (pawn, trait) => {
      const degrees = { 1: VALUES.good, [-1]: VALUES.very_bad };
      return makeValues(degrees[trait.degree]);
    },
  },
  DrugDesire: {
    name: "Drug Desire",
    value: (pawn, trait) => {
      const degrees = { 1: VALUES.bad, 2: VALUES.very_bad };
      return makeValues(degrees[trait.degree]);
    },
  },
  Industriousness: {
    name: "Industriousness",
    value: (pawn, trait) => {
      const degrees = { 1: VALUES.very_good, [-1]: VALUES.bad };
      return makeValues(degrees[trait.degree]);
    },
  },
  Jealous: { name: "Jealous", value: () => makeValues(VALUES.very_bad) },
  NightOwl: { name: "Night owl", value: () => makeValues(VALUES.neutral) },
  Neurotic: {
    name: "Neurotic",
    value: (pawn, trait) => {
      const degrees = { 1: VALUES.good, 2: VALUES.good };
      return makeValues(degrees[trait.degree]);
    },
  },
  Psychopath: { name: "Psycopath", value: () => makeValues(VALUES.excellent) },
  Pyromaniac: { name: "Pyromaniac", value: () => makeValues(VALUES.very_bad) },
  QuickSleeper: { name: "Quick sleeper", value: () => makeValues(VALUES.very_good) },
  ShootingAccuracy: {
    name: "Shooting Accuracy",
    value: (pawn, trait) => {
      const degrees = { 2: VALUES.good };
      return makeValues(degrees[trait.degree]);
    },
  },
  SpeedOffset: {
    name: "Speed Offset",
    value: (pawn, trait) => {
      const degrees = {
        1: VALUES.very_good,
      };
      return makeValues(degrees[trait.degree]);
    },
  },
  TorturedArtist: {
    name: "Tortured artist",
    value: (pawn, trait) => makeValues(VALUES.bad),
  },
  Undergrounder: {
    name: "Undergrounder",
    value: () => makeValues(VALUES.good, { slaveValue: VALUES.very_good }),
  },
  // mod added traits below here
  SYR_Haggler: {
    name: "Silver tongue",
    value: ({
      skills: {
        skills: { li: skills },
      },
    }) => {
      const social = skills.find(({ def }) => def === SKILLS.social.name);
      return makeValues(getTieredValueForSkill(social));
    },
    source: mods.individuality,
  },
  SYR_HandEyeCoordination: {
    name: "Hand-eye coordination",
    value: () => makeValues(VALUES.very_good),
    source: mods.individuality,
  },
  SYR_MechanoidExpert: {
    name: "Mechanoid expert",
    value: () => makeValues(VALUES.good),
    source: mods.individuality,
  },
  SYR_Perfectionist: {
    name: "Idealist",
    value: ({
      skills: {
        skills: { li: skills },
      },
    }) => {
      const crafting = skills.find(({ def }) => def === SKILLS.crafting.name);
      return makeValues(getTieredValueForSkill(crafting));
    },
    source: mods.individuality,
  },
  SYR_SteadyHands: {
    name: "Steady hands",
    value: ({
      skills: {
        skills: { li: skills },
      },
    }) => {
      const medicine = skills.find(({ def }) => def === SKILLS.medicine.name);
      return makeValues(getTieredValueForSkill(medicine));
    },
  },
  SYR_StrongBack: {
    name: "Strong back",
    value: () => makeValues(VALUES.good),
    source: mods.individuality,
  },
  VTE_AbsentMinded: {
    name: "Absent-minded",
    value: () => makeValues(VALUES.very_bad),
    source: mods.vanillaTraitsExpanded,
  },
  VTE_AnimalLover: {
    name: "Animal Lover",
    value: ({
      skills: {
        skills: { li: skills },
      },
    }) => {
      const cooking = skills.find(({ def }) => def === SKILLS.cooking.name);
      if (cooking && cooking.passion) return makeValues(VALUES.bad);
      return makeValues(VALUES.neutral);
    },
    source: mods.vanillaTraitsExpanded,
  },
  VTE_ChildOfSea: {
    name: "Ocean lover",
    // TODO maybe inlcude map data, if there's a way to figure out features?
    value: () => makeValues(VALUES.neutral),
    source: mods.vanillaTraitsExpanded,
  },
  VTE_Clumsy: {
    name: "Clumsy",
    value: () => makeValues(VALUES.bad),
    source: mods.vanillaTraitsExpanded,
  },
  VTE_Coward: {
    name: "Coward",
    value: () => makeValues(VALUES.very_bad),
    source: mods.vanillaTraitsExpanded,
  },
  VTE_Eccentric: {
    name: "Eccentric",
    value: ({
      skills: {
        skills: { li: skills },
      },
    }) => {
      const intellectual = skills.find(({ def }) => def === SKILLS.intellectual.name);
      return makeValues(getTieredValueForSkill(intellectual));
    },
    source: mods.vanillaTraitsExpanded,
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
      if (plantsAndAnimals.some(({ passion }) => passion)) return makeValues(VALUES.excellent);
      return makeValues(VALUES.very_good);
    },
    source: mods.individuality,
  },
  VTE_Gastronomist: {
    name: "Gastronomist",
    value: ({
      skills: {
        skills: { li: skills },
      },
    }) => {
      const cooking = skills.find(({ def }) => def === SKILLS.cooking.name);
      if (cooking && cooking.passion) return makeValues(VALUES.excellent);
      return makeValues(VALUES.good);
    },
  },
  VTE_HeavySleeper: {
    name: "Heavy sleeper",
    value: () => makeValues(VALUES.very_bad),
    source: mods.vanillaTraitsExpanded,
  },
  VTE_Insomniac: {
    name: "Insomniac",
    value: () => makeValues(VALUES.very_good, { slaveValue: VALUES.good }),
    source: mods.vanillaTraitsExpanded,
  },
  VTE_Prude: {
    name: "Prude",
    value: () => makeValues(VALUES.bad, { slaveValue: VALUES.neutral }),
    source: mods.vanillaTraitsExpanded,
  },
  VTE_Rebel: {
    name: "Rebel",
    value: () => makeValues(VALUES.very_bad),
    source: mods.vanillaTraitsExpanded,
  },
  VTE_Slob: {
    name: "Slob",
    value: () => makeValues(VALUES.bad),
    source: mods.vanillaTraitsExpanded,
  },
  VTE_Stoner: {
    name: "Stoner",
    // my logic for Stoner being very bad instead of terrible is that the addiction is already accounted for separately.
    // the trait itself is solely for the fact that the addiction can't be withdrawaled out of
    value: () => makeValues(VALUES.very_bad),
    source: mods.vanillaTraitsExpanded,
  },
  VTE_Tycoon: {
    name: "Tycoon",
    value: ({
      skills: {
        skills: { li: skills },
      },
    }) => {
      const social = skills.find(({ def }) => def === SKILLS.social.name);
      if (social && social.passion) return makeValues(VALUES.excellent);
      return makeValues(VALUES.very_good);
    },
    source: mods.vanillaTraitsExpanded,
  },
  VTE_Vengeful: {
    name: "Vengeful",
    value: () => makeValues(VALUES.terrible),
    source: mods.vanillaTraitsExpanded,
  },
  VTE_WorldWeary: {
    name: "World weary",
    value: () => makeValues(VALUES.terrible),
    source: mods.vanillaTraitsExpanded,
  },
};
