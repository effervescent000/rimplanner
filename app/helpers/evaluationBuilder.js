import { buildColonyStats } from "./rosterHelpers";
import {
  MAJOR_PASSION_VALUE,
  MINOR_PASSION_VALUE,
  SKILLS_ARRAY,
} from "../constants/skillsConstants";
import { MAJOR_PASSION } from "../constants/constants";

const BASE_VALUE = 1;

class EvaluationBuilder {
  constructor({ targets, playerPawns }) {
    this.targets = targets;
    this.targetsSkills = this.targets.reduce(
      (total, { id, skills }) => ({
        ...total,
        [id]: skills.skills.li.reduce(
          (totalSkills, cur) => ({ ...totalSkills, [cur.def]: cur }),
          {}
        ),
      }),
      {}
    );
    this.playerPawns = playerPawns;
    this.colonyStats = buildColonyStats(playerPawns);
    this.values = this.targets.reduce((total, { id }) => ({ ...total, [id]: 0 }), {});
  }

  compareStats() {
    this.targets.forEach(({ id }) => {
      let value = 0;
      SKILLS_ARRAY.forEach((skill) => {
        const targetSkill = this.targetsSkills[id][skill];
        if (targetSkill && targetSkill.level > 0) {
          if (targetSkill.passion) {
            if (targetSkill.passion === MAJOR_PASSION) {
              if (
                targetSkill.level >=
                this.colonyStats[skill].upperQuantile - MAJOR_PASSION_VALUE
              ) {
                value += BASE_VALUE * 2;
              } else if (
                targetSkill.level >=
                this.colonyStats[skill].average - MAJOR_PASSION_VALUE
              ) {
                value += BASE_VALUE;
              }
            } else {
              if (
                targetSkill.level >=
                this.colonyStats[skill].upperQuantile - MINOR_PASSION_VALUE
              ) {
                value += BASE_VALUE * 1.5;
              } else if (
                targetSkill.level >=
                this.colonyStats[skill].average - MINOR_PASSION_VALUE
              ) {
                value += BASE_VALUE * 0.75;
              }
            }
          } else {
            if (targetSkill.level >= this.colonyStats[skill].upperQuantile) {
              value += BASE_VALUE;
            } else if (targetSkill.level >= this.colonyStats[skill].average) {
              value += BASE_VALUE * 0.5;
            }
          }
        }
      });
      this.values[id] += value;
    });
  }
}

export default EvaluationBuilder;
