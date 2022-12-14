import { SKILLS_ARRAY, SKILLS } from "../../constants/skillsConstants";
import { buildLabors } from "../utils";
import { MAJOR_PASSION, MINOR_PASSION } from "../../constants/constants";

export const modListFactory = ({ full } = {}) => {
  // full returns a modList with several work-adding mods, otherwise only core game is returned
  const core = ["ludeon.rimworld", "ludeon.rimworld.royalty", "ludeon.rimworld.ideology"];
  if (full) return [...core, "unlimitedhugs.allowtool", "orion.hospitality"];
  return core;
};

export const getBasicPawns = () => {
  return [
    pawnFactory({
      name: "Buck",
      skills: {
        [SKILLS.crafting.name]: { level: 10, passion: MAJOR_PASSION },
        [SKILLS.social.name]: { level: 9, passion: MAJOR_PASSION },
        [SKILLS.intellectual.name]: { level: 4 },
      },
    }),
    pawnFactory({
      name: "Belsaas",
      skills: {
        [SKILLS.crafting.name]: { level: 5 },
        [SKILLS.intellectual.name]: { level: 20, passion: MAJOR_PASSION },
      },
      childhoodBackstory: "ScienceProdigy65",
      adultBackstory: "ParticlePhysicist44",
    }),
    pawnFactory({
      name: "Gennady",
      skills: {
        [SKILLS.construction.name]: { level: 13, passion: MAJOR_PASSION },
        [SKILLS.crafting.name]: { level: 4 },
        [SKILLS.intellectual.name]: { level: 4 },
      },
    }),
    pawnFactory({
      name: "Hakuja",
      skills: {
        [SKILLS.social.name]: { level: 4 },
        [SKILLS.medicine.name]: { level: 17, passion: MAJOR_PASSION },
        [SKILLS.intellectual.name]: { level: 5, passion: MINOR_PASSION },
      },
      childhoodBackstory: "Killer41",
      adultBackstory: "Healer35",
    }),
  ];
};

export const pawnFactory = ({
  name,
  skills,
  modList = modListFactory(),
  childhoodBackstory = "ApocalypseSurvivor23",
  adultBackstory = "CropFarmer17",
}) => {
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
    story: { childhood: childhoodBackstory, adulthood: adultBackstory },
    workSettings: {
      priorities: {
        vals: {
          li: buildLabors(modList).map((labor) => 3),
        },
      },
    },
  };
};
