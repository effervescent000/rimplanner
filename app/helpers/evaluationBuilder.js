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
  constructor({ targets, playerPawns, modList, config }) {
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
    this.config = config;
    this.colonyStats = buildColonyStats(playerPawns);
    this.values = this.targets.reduce(
      (total, { id }) => ({
        ...total,
        [id]: { bleedingOut: false, colonistValue: 0, slaveValue: 0 },
      }),
      {}
    );
    [this.labors, this.laborsLookup] = buildLabors(modList);
    // this is here instead of a constant because I want to optionally include shooting based on user config
    this.slaveIncapable = [
      LABOR_CATEGORIES.intellectual,
      LABOR_CATEGORIES.social,
      LABOR_CATEGORIES.art,
    ];
  }

  fullEval() {
    this.compareStats();
    this.checkIncapables();
    this.addTraitValues();
    this.addHealthValues();
  }

  processValues(id, values) {
    this.values[id].colonistValue += values.colonistValue || 0;
    this.values[id].slaveValue += values.slaveValue || 0;
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

  getSkillValues({ pawn, skill }) {
    const targetSkill = this.targetsSkills[pawn.id][skill];
    if (targetSkill && targetSkill.level > 0) {
      if (targetSkill.passion) {
        if (targetSkill.passion === MAJOR_PASSION) {
          if (targetSkill.level >= this.colonyStats[skill].upperQuantile - MAJOR_PASSION_VALUE) {
            return BASE_VALUE * 2;
          } else if (targetSkill.level >= this.colonyStats[skill].average - MAJOR_PASSION_VALUE) {
            return BASE_VALUE;
          }
        } else {
          if (targetSkill.level >= this.colonyStats[skill].upperQuantile - MINOR_PASSION_VALUE) {
            return BASE_VALUE * 1.5;
          } else if (targetSkill.level >= this.colonyStats[skill].average - MINOR_PASSION_VALUE) {
            return BASE_VALUE * 0.75;
          }
        }
      } else {
        if (targetSkill.level >= this.colonyStats[skill].upperQuantile) {
          return BASE_VALUE;
        } else if (targetSkill.level >= this.colonyStats[skill].average) {
          return BASE_VALUE * 0.5;
        }
      }
    }
  }

  compareStats() {
    this.targets.forEach((pawn) => {
      const incapableSkills = getIncapableSkills(pawn);
      SKILLS_ARRAY.forEach((skill) => {
        const skillValue = this.getSkillValues({ pawn, skill });
        this.processValues(pawn.id, {
          colonistValue: !incapableSkills.includes(skill) ? skillValue : 0,
          slaveValue: !this.slaveIncapable.includes(skill) ? skillValue : 0,
        });
      });
    });
  }
}

export default EvaluationBuilder;
