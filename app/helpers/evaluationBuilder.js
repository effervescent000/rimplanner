import { buildColonyStats } from "./rosterHelpers";
import {
  MAJOR_PASSION_VALUE,
  MINOR_PASSION_VALUE,
  SKILLS_ARRAY,
} from "../constants/skillsConstants";
import { LABOR_CATEGORIES, MAJOR_PASSION } from "../constants/constants";
import { TRAITS } from "../constants/traitConstants";
import { buildLabors, getIncapableSkills } from "./utils";

const BASE_VALUE = 1;

class EvaluationBuilder {
  constructor({ targets, playerPawns, modList }) {
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
    [this.labors, this.laborsLookup] = buildLabors(modList);
  }

  fullEval() {
    this.compareStats();
    this.checkIncapables();
    this.addTraitValues();
  }

  addTraitValues() {
    this.targets.forEach((pawn) => {
      const {
        id,
        story: {
          traits: {
            allTraits: { li: traits },
          },
        },
      } = pawn;
      let value = 0;
      traits.forEach(({ def: trait }) => {
        const foundTrait = TRAITS[trait];
        if (!foundTrait) {
          console.log("Trait not found, " + trait);
        } else {
          value += foundTrait.value(pawn);
        }
      });
      this.values[id] += value;
    });
  }

  checkIncapables() {
    this.targets.forEach((pawn) => {
      const incapableSkills = getIncapableSkills(pawn);
      let value = 0;
      if (incapableSkills.includes(LABOR_CATEGORIES.firefighting)) {
        value += -1;
      }
      if (incapableSkills.includes(LABOR_CATEGORIES.violent)) {
        value += -2;
      }
      if (incapableSkills.includes(LABOR_CATEGORIES.skilled)) {
        value += -2;
      }
      if (incapableSkills.includes(LABOR_CATEGORIES.dumb)) {
        value += -2;
      }
      this.values[pawn.id] += value;
    });
  }

  compareStats() {
    this.targets.forEach((pawn) => {
      const incapableSkills = getIncapableSkills(pawn);
      let value = 0;
      SKILLS_ARRAY.forEach((skill) => {
        if (!incapableSkills.includes(skill)) {
          const targetSkill = this.targetsSkills[pawn.id][skill];
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
        }
      });
      this.values[pawn.id] += value;
    });
  }
}

export default EvaluationBuilder;
