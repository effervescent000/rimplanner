import { SKILLS_ARRAY, SKILLS } from "../../constants/skillsConstants";
import { buildLabors } from "../priorityBuilder";
import { MAJOR_PASSION } from "../../constants/constants";

export const modListFactory = ({ full } = {}) => {
  // full returns a modList with several work-adding mods, otherwise only core game is returned
  const core = ["ludeon.rimworld", "ludeon.rimworld.royalty", "ludeon.rimworld.ideology"];
  if (full) return [...core, "unlimitedhugs.allowtool", "orion.hospitality"];
  return core;
};

export const getThreePawns = () => {
  const modList = modListFactory();
  return [
    pawnFactory({
      name: "Buck",
      skills: {
        [SKILLS.crafting.name]: { level: 10, passion: MAJOR_PASSION },
        [SKILLS.social.name]: { level: 9, passion: MAJOR_PASSION },
        [SKILLS.intellectual.name]: { level: 4 },
      },
      modList,
    }),
    pawnFactory({
      name: "Belsaas",
      skills: { [SKILLS.intellectual.name]: { level: 20, passion: MAJOR_PASSION } },
      modList,
    }),
    pawnFactory({
      name: "Gennady",
      skills: {
        [SKILLS.construction.name]: { level: 13, passion: MAJOR_PASSION },
        [SKILLS.intellectual.name]: { level: 4 },
      },
      modList,
    }),
  ];
};

export const pawnFactory = ({ name, skills, modList }) => {
  return {
    id: `Human${Math.round(Math.random() * 1000)}`,
    name: {
      nick: name,
    },
    skills: {
      skills: {
        li: SKILLS_ARRAY.map((skillName) => ({
          def: skillName,
          level: skills[skillName] ? skills[skillName].level : 0,
          passion: skills[skillName] ? skills[skillName].passion : undefined,
        })),
      },
    },
    workSettings: {
      priorities: {
        vals: {
          li: buildLabors(modList).map((labor) => 3),
        },
      },
    },
  };
};
