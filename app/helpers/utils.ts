import type {
  LaborCategoryParams,
  LaborLookupParams,
  LaborParams,
  LifeStageParams,
  PawnParams,
  WorkPriorityParams,
} from "app/types/interfaces";

import { BACKSTORIES_LOOKUP } from "../constants/backstoryConstants";
import { BASE_GAME_LABORS, MOD_LABORS, SLAVE } from "../constants/constants";
import { mods } from "../constants/modConstants";
import { LIFE_STAGES } from "../constants/healthConstants";

export const getFactionKey = (faction: { loadID: number }) => `Faction_${faction.loadID}`;

const makeIncapableSkillsArray = (childhood: string, adulthood: string | undefined) => [
  ...(childhood ? BACKSTORIES_LOOKUP[childhood] || [] : []),
  ...(adulthood ? BACKSTORIES_LOOKUP[adulthood] || [] : []),
];

export const isPawnCapable = ({
  pawn,
  laborName,
  laborsLookup,
  slaveIncapableSkills,
}: {
  pawn: PawnParams;
  laborName: string;
  laborsLookup: LaborLookupParams;
  slaveIncapableSkills: Array<LaborCategoryParams>;
}): boolean => {
  const {
    story: { childhood, adulthood },
  } = pawn;
  const incapableSkills = isSlave(pawn)
    ? [...slaveIncapableSkills]
    : makeIncapableSkillsArray(childhood, adulthood);
  const pawnCantDo = incapableSkills.filter((skill) =>
    (laborsLookup[laborName].categories || []).includes(skill)
  );
  return !pawnCantDo.length;
};

export const getIncapableLabors = (
  { story: { childhood, adulthood } }: PawnParams,
  laborsOnly: boolean = false
): Array<string> | Array<LaborCategoryParams> => {
  const labors = makeIncapableSkillsArray(childhood, adulthood);
  if (!laborsOnly) return labors;
  return labors.reduce((total, cur) => [...total, cur.value], [] as Array<string>);
};

export const buildLabors = (modList: Array<string>) => {
  const labors: Array<LaborParams> = [...BASE_GAME_LABORS];
  const modLabors: {
    [key: string]: LaborParams;
  } = MOD_LABORS();
  modList.forEach((mod) => {
    switch (mod) {
      case mods.biotech:
        labors.push(modLabors.childcare);
        break;
      case mods.allowTool:
        labors.push(modLabors.haulPlus);
        labors.push(modLabors.hiddenLabor);
        break;
      case mods.colonyManager:
        labors.push(modLabors.managing);
        break;
      case mods.hospitality:
        labors.push(modLabors.entertaining);
        break;
      case mods.quarry:
        labors.push(modLabors.quarrying);
        break;
      case mods.vanillaBooksExpanded:
        labors.push(modLabors.writing);
        break;
      case mods.vanillaFishingExpanded:
        labors.push(modLabors.fishing);
        break;
      case mods.vanillaGeneticsExpanded:
        labors.push(modLabors.genetics);
        break;
      default:
        break;
    }
  });
  return [
    labors,
    labors.reduce(
      (total, cur) => ({ ...total, [cur.name]: cur }),
      {} as { [key: string]: LaborParams }
    ),
  ] as [Array<LaborParams>, { [key: string]: LaborParams }];
};

export const makeValues = (baseValue: number, modifiers = {}) => ({
  colonistValue: baseValue,
  slaveValue: baseValue,
  ...modifiers,
});

export const roundToTwoDecimals = (num: number) => Math.round(num * 100) / 100;

export const isSlave = (pawn: PawnParams) =>
  pawn.guest.guestStatus && pawn.guest.guestStatus === SLAVE;

export const weightedChoice = (choiceArray: Array<any>, accumulatorKey: string) => {
  const total = choiceArray.reduce((total, cur) => total + cur[accumulatorKey], 0);
  const threshold = Math.random() * total;
  let runningValue = 0;
  for (let i = 0; i < choiceArray.length; i++) {
    runningValue += choiceArray[i][accumulatorKey];
    if (runningValue > threshold) {
      return choiceArray[i];
    }
  }
  return choiceArray.at(-1);
};

export const getName = ({ name }: PawnParams) => name.nick || `${name.first} ${name.last}`;

export const getSkills = (pawn: PawnParams) => pawn.skills.skills.li;

export const getNutritionRequired = (pawn: PawnParams) => {
  // TODO also look at traits (for Gourmand)
  const {
    ageTracker: { ageBiologicalTicks },
    gender,
    healthTracker: {
      hediffSet: {
        hediffs: { li: hediffs },
      },
    },
  } = pawn;
  const age = LIFE_STAGES.find(({ minAge }) => ageBiologicalTicks > minAge) as LifeStageParams;
  const breastfeedingNutrition = () => {
    if (gender !== "Female") return 0;
    if (!Array.isArray(hediffs)) {
      return hediffs.def === "Lactating" ? 0.5 : 0;
    } else {
      const lactatingHediff = hediffs.find(({ def }) => def === "Lactating");
      return lactatingHediff ? 0.5 : 0;
    }
  };
  return 1.6 * age.bodySize * (age.nutritionMod || 1) + breastfeedingNutrition();
};

export const getCurrentPriorities = (
  pawns: Array<PawnParams>,
  laborLabels: Array<LaborParams>
): Array<WorkPriorityParams> => {
  const priorities = pawns.map((pawn) => {
    const name = getName(pawn);
    return {
      name,
      priorities: pawn.workSettings.priorities.vals.li.map((prio, idx) => ({
        labor: laborLabels[idx].name,
        currentPrio: prio,
      })),
    };
  });
  return priorities;
};
