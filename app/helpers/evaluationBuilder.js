import { buildColonyStats } from "./rosterHelpers";
import {
  MAJOR_PASSION_VALUE,
  MINOR_PASSION_VALUE,
  SKILLS_ARRAY,
} from "../constants/skillsConstants";
import { LABOR_CATEGORIES, MAJOR_PASSION } from "../constants/constants";
import { TRAITS } from "../constants/traitConstants";
import { buildLabors, getIncapableSkills, makeValues } from "./utils";
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
      (total, { id }) => ({
        ...total,
        [id]: { colonistValue: 0, slaveValue: 0, bleedingOut: false },
      }),
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

  processValues(id, values) {
    this.values[id].colonistValue += values.colonistValue;
    this.values[id].slaveValue += values.slaveValue;
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
                this.processValues(id, hediffValue.value());
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
            this.processValues(id, hediffValue.value());
          }
        }
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
      traits.forEach((trait) => {
        const traitName = trait.def;
        const foundTrait = TRAITS[traitName];
        if (!foundTrait) {
          console.log("Trait not found, " + traitName);
        } else {
          this.processValues(id, foundTrait.value(pawn, trait));
        }
      });
    });
  }

  checkIncapables() {
    this.targets.forEach((pawn) => {
      // slaves will do all tasks that are disabled by their backstories except violence
      const incapableSkills = getIncapableSkills(pawn);
      if (incapableSkills.includes(LABOR_CATEGORIES.firefighting)) {
        this.processValues(pawn.id, { colonistValue: -1, slaveValue: 0 });
      }
      if (incapableSkills.includes(LABOR_CATEGORIES.violent)) {
        this.processValues(pawn.id, { colonistValue: -2, slaveValue: 0 });
      }
      if (incapableSkills.includes(LABOR_CATEGORIES.skilled)) {
        this.processValues(pawn.id, { colonistValue: -2, slaveValue: 0 });
      }
      if (incapableSkills.includes(LABOR_CATEGORIES.dumb)) {
        this.processValues(pawn.id, { colonistValue: -2, slaveValue: 0 });
      }
    });
  }

  compareStats() {
    this.targets.forEach((pawn) => {
      const incapableSkills = getIncapableSkills(pawn);
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
                  this.processValues(pawn.id, makeValues(BASE_VALUE * 2));
                } else if (
                  targetSkill.level >=
                  this.colonyStats[skill].average - MAJOR_PASSION_VALUE
                ) {
                  this.processValues(pawn.id, makeValues(BASE_VALUE));
                }
              } else {
                if (
                  targetSkill.level >=
                  this.colonyStats[skill].upperQuantile - MINOR_PASSION_VALUE
                ) {
                  this.processValues(pawn.id, makeValues(BASE_VALUE * 1.5));
                } else if (
                  targetSkill.level >=
                  this.colonyStats[skill].average - MINOR_PASSION_VALUE
                ) {
                  this.processValues(pawn.id, makeValues(BASE_VALUE * 0.75));
                }
              }
            } else {
              if (targetSkill.level >= this.colonyStats[skill].upperQuantile) {
                this.processValues(pawn.id, makeValues(BASE_VALUE));
              } else if (targetSkill.level >= this.colonyStats[skill].average) {
                this.processValues(pawn.id, makeValues(BASE_VALUE * 0.5));
              }
            }
          }
        }
      });
    });
  }
}

export default EvaluationBuilder;
