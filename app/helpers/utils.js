import { BACKSTORIES_LOOKUP } from "../constants/backstoryConstants";
import { BASE_GAME_LABORS, MOD_LABORS } from "../constants/constants";
import {
  ALLOW_TOOL,
  COLONY_MANAGER,
  HOSPITALITY,
  QUARRY,
  VANILLA_BOOKS_EXPANDED,
  VANILLA_GENETICS_EXPANDED,
} from "../constants/modConstants";

export const getFactionKey = (faction) => `Faction_${faction.loadID}`;

export const isPawnCapable = ({
  pawn: {
    story: { childhood, adulthood },
  },
  laborName,
  laborsLookup,
}) => {
  const incapableSkills = [
    ...(BACKSTORIES_LOOKUP[childhood] || []),
    ...(BACKSTORIES_LOOKUP[adulthood] || []),
  ];
  const pawnCantDo = incapableSkills.filter((skill) =>
    (laborsLookup[laborName].categories || []).includes(skill)
  );
  return !pawnCantDo.length;
};

export const getIncapableSkills = ({ story: { childhood, adulthood } }) => [
  ...(BACKSTORIES_LOOKUP[childhood] || []),
  ...(BACKSTORIES_LOOKUP[adulthood] || []),
];

export const buildLabors = (modList) => {
  const labors = [...BASE_GAME_LABORS];
  const modLabors = MOD_LABORS();
  modList.forEach((mod) => {
    switch (mod) {
      case ALLOW_TOOL:
        labors.push(modLabors.haulPlus);
        labors.push(modLabors.hiddenLabor);
        break;
      case COLONY_MANAGER:
        labors.push(modLabors.managing);
        break;
      case HOSPITALITY:
        labors.push(modLabors.entertaining);
        break;
      case QUARRY:
        labors.push(modLabors.quarrying);
        break;
      case VANILLA_BOOKS_EXPANDED:
        labors.push(modLabors.writing);
        break;
      case VANILLA_GENETICS_EXPANDED:
        labors.push(modLabors.genetics);
        break;
      default:
        break;
    }
  });
  return [labors, labors.reduce((total, cur) => ({ ...total, [cur.name]: cur }), {})];
};
