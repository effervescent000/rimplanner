import { buildColonyStats } from "./rosterHelpers";
import {
  MAJOR_PASSION_VALUE,
  MINOR_PASSION_VALUE,
  SKILLS_ARRAY,
} from "../constants/skillsConstants";
import { LABOR_CATEGORIES, MAJOR_PASSION } from "../constants/constants";
import { TRAITS } from "../constants/traitConstants";
import { buildLabors, getIncapableSkills } from "./utils";
import { HEALTH_CONDITIONS } from "~/constants/healthConstants";

const BASE_VALUE = 1;

// the threshold below which we flag a pawn as bleeding out
const BLEEDING_OUT_THRESHOLD = 2.5;

const INJURY = "Hediff_Injury";
const INJURIES_MAP = {
  Gunshot: 0.06,
  Cut: 0.06,
};

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
    this.values = this.targets.reduce(
      (total, { id }) => ({ ...total, [id]: { value: 0, bleedingOut: false } }),
      {}
    );
    [this.labors, this.laborsLookup] = buildLabors(modList);
  }

  fullEval() {
    this.compareStats();
    this.checkIncapables();
    this.addTraitValues();
    this.addHealthValues();
  }

  addHealthValues() {
    this.targets.forEach((pawn) => {
      const {
        id,
        healthTracker: {
          hediffSet: {
            hediffs: { li: hediffs },
          },
        },
      } = pawn;
      let value = 0;
      if (hediffs) {
        if (hediffs.length) {
          let bloodLossSeverity;
          const bleeding = [];
          hediffs.forEach(({ $, def: hediff, severity }) => {
            if ($ && $.Class === INJURY) {
              bleeding.push((+INJURIES_MAP[hediff] || 0) * +severity);
            } else if (hediff === "BloodLoss") {
              bloodLossSeverity = +severity;
            } else {
              const hediffValue = HEALTH_CONDITIONS[hediff];
              if (hediffValue) {
                value += hediffValue.value;
              }
            }
          });
          const bloodLossRate = bleeding.reduce((total, cur) => total + cur, 0);
          const timeToBleedOut = ((1 - bloodLossSeverity) / bloodLossRate) * 24;
          if (timeToBleedOut < BLEEDING_OUT_THRESHOLD) {
            this.values[id].bleedingOut = true;
          }
        } else {
          const hediffValue = HEALTH_CONDITIONS[hediffs];
          if (hediffValue) {
            value += hediffValue.value;
          }
        }
        this.values[id].value += value;
      }
    });
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
      traits.forEach((trait) => {
        const traitName = trait.def;
        const foundTrait = TRAITS[traitName];
        if (!foundTrait) {
          console.log("Trait not found, " + traitName);
        } else {
          value += foundTrait.value(pawn, trait);
        }
      });
      this.values[id].value += value;
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
      this.values[pawn.id].value += value;
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
      this.values[pawn.id].value += value;
    });
  }
}

export default EvaluationBuilder;
