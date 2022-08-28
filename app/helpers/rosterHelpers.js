import { mean, quantile } from "simple-statistics";

import { LABORS, MAJOR_PASSION, MINOR_PASSION, SKILLS } from "~/constants/constants";

const buildColonyStats = (pawns) => {
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
  const stats = SKILLS.map((skill) => ({
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
  playerPawns.forEach(
    ({
      name: { nick: name },
      skills: {
        skills: { li: skills },
      },
    }) => {
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
    }
  );
  return stats;
};

export const buildWorkPriorityLabels = (modList) =>
  LABORS.filter(({ source }) => !source || modList.includes(source));
