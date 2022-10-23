import { mean, quantile } from "simple-statistics";

import { DEFAULT_LABOR_PRIO, LABORS, MAJOR_PASSION, MINOR_PASSION } from "../constants/constants";

import { SKILLS_ARRAY } from "../constants/skillsConstants";
import { getName } from "./utils";

export const buildColonyStats = (pawns) => {
  let allSkills = {};
  pawns.forEach(
    ({
      skills: {
        skills: { li: skills },
      },
    }) => {
      skills.forEach((skill) => {
        allSkills = {
          ...allSkills,
          [skill.def]: allSkills[skill.def]
            ? [...allSkills[skill.def], { level: skill.level, passion: skill.passion }]
            : [{ level: skill.level, passion: skill.passion }],
        };
      });
    }
  );
  const stats = SKILLS_ARRAY.map((skill) => ({
    name: skill,
    average: mean(allSkills[skill].map(({ level }) => +level || 0)),
    upperQuantile: quantile(
      allSkills[skill].map(({ level }) => +level || 0),
      0.75
    ),
  }));
  return stats.reduce((total, cur) => ({ ...total, [cur.name]: cur }), {});
};

export const buildRosterHighlights = (playerPawns) => {
  let stats = {};
  const colonyStats = buildColonyStats(playerPawns);
  playerPawns.forEach((pawn) => {
    const name = getName(pawn);
    const skills = pawn.skills.skills.li;
    stats = {
      ...stats,
      [name]: {
        highlights: skills.map(({ def: skill, level, passion }) => {
          if (
            level >= colonyStats[skill].upperQuantile ||
            (level >= colonyStats[skill].upperQuantile - 2 && passion === MINOR_PASSION) ||
            (level >= colonyStats[skill].upperQuantile - 5 && passion === MAJOR_PASSION)
          )
            return { skill, level, passion };
          return undefined;
        }),
      },
    };
  });
  return stats;
};

export const buildLaborsList = (modList) =>
  LABORS.filter(({ source }) => !source || modList.includes(source));

export const buildPrioritySuggestions = ({ labors, playerPawns }) => {
  const numPawns = playerPawns.length;
  const third = Math.ceil(numPawns * (1 / 3));
  const prios = {};
  playerPawns.forEach((pawn) => {
    const name = getName(pawn);
    prios[name] = [];
  });
  const pawnSkills = playerPawns.map((pawn) => {
    const name = getName(pawn);
    const skills = pawn.skills.skills.li;
    return { name, skills };
  });
  labors.forEach((labor) => {
    if (labor.allDo) {
      Object.keys(prios).forEach(
        (name) => (prios[name] = [...prios[name], { name: labor.name, level: DEFAULT_LABOR_PRIO }])
      );
    } else {
      if (labor.skill) {
        pawnSkills.sort(
          (a, b) =>
            b.skills.find(({ def }) => def === labor.skill).level -
            a.skills.find(({ def }) => def === labor.skill).level
        );
      }
      for (let i = 0; i < third; i++) {
        // take the pawn from pawnSkills at index i, find them in the prio obj, and add an object with a prio to their array
        const targetPawn = pawnSkills[i];
        prios[targetPawn.name] = [
          ...prios[targetPawn.name],
          { name: labor.name, level: DEFAULT_LABOR_PRIO },
        ];
      }
      for (let i = third; i < numPawns; i++) {
        const targetPawn = pawnSkills[i];
        prios[targetPawn.name] = [...prios[targetPawn.name], { name: labor.name }];
      }
    }
  });
  return prios;
};
