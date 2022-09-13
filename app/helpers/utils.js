import { BACKSTORIES_LOOKUP } from "../constants/backstoryConstants";
import { BASE_GAME_LABORS, MOD_LABORS, SLAVE } from "../constants/constants";
import { mods } from "~/constants/modConstants";

export const getFactionKey = (faction) => `Faction_${faction.loadID}`;

export const isPawnCapable = ({
  pawn: {
    story: { childhood, adulthood },
    guest: { guestStatus },
  },
  laborName,
  laborsLookup,
  slaveIncapableSkills,
}) => {
  const incapableSkills =
    guestStatus && guestStatus === SLAVE
      ? [...slaveIncapableSkills]
      : [...(BACKSTORIES_LOOKUP[childhood] || []), ...(BACKSTORIES_LOOKUP[adulthood] || [])];
  const pawnCantDo = incapableSkills.filter((skill) =>
    (laborsLookup[laborName].categories || []).includes(skill)
  );
  return !pawnCantDo.length;
};

export const getIncapableLabors = ({ story: { childhood, adulthood } }, laborsOnly = false) => {
  const labors = [
    ...(BACKSTORIES_LOOKUP[childhood] || []),
    ...(BACKSTORIES_LOOKUP[adulthood] || []),
  ];
  if (!laborsOnly) return labors;
  return labors.reduce((total, cur) => [...total, cur.value], []);
};

export const buildLabors = (modList) => {
  const labors = [...BASE_GAME_LABORS];
  const modLabors = MOD_LABORS();
  modList.forEach((mod) => {
    switch (mod) {
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
  return [labors, labors.reduce((total, cur) => ({ ...total, [cur.name]: cur }), {})];
};

export const makeValues = (baseValue, modifiers = {}) => ({
  colonistValue: baseValue,
  slaveValue: baseValue,
  ...modifiers,
});

export const roundToTwoDecimals = (num) => Math.round(num * 100) / 100;

export const isSlave = (pawn) => pawn.guest.guestStatus && pawn.guest.guestStatus === SLAVE;
