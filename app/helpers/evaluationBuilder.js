import { buildColonyStats } from "./rosterHelpers";
import {
  MAJOR_PASSION_MODIFIER,
  MAJOR_PASSION_VALUE,
  MINIMUM_USEFUL_SKILL_LEVEL,
  MINOR_PASSION_MODIFIER,
  MINOR_PASSION_VALUE,
  NO_PASSION_MODIFIER,
  SKILLS_ARRAY,
} from "../constants/skillsConstants";
import { LABOR_CATEGORIES, MAJOR_PASSION } from "../constants/constants";
import { TRAITS } from "../constants/traitConstants";
import { buildLabors, getIncapableLabors, roundToTwoDecimals } from "./utils";
import { HEALTH_CONDITIONS } from "~/constants/healthConstants";

const BASE_VALUE = 1;

// the threshold below which we flag a pawn as bleeding out
const BLEEDING_OUT_THRESHOLD = 2.5;

const INJURY = "Hediff_Injury";
const INJURIES_MAP = {
  Gunshot: 0.06,
  Cut: 0.06,
};

const makeIncapableSkills = (laborCategories) =>
  laborCategories.reduce((total, cur) => [...total, ...(cur.skills || [])], []);

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
    this.slaveIncapableLabors = [
      LABOR_CATEGORIES.intellectual,
      LABOR_CATEGORIES.social,
      LABOR_CATEGORIES.art,
    ];
    this.slaveIncapableSkills = makeIncapableSkills(this.slaveIncapableLabors);
  }

  fullEval() {
    this.compareStats();
    this.checkIncapables();
    this.addTraitValues();
    this.addHealthValues();
    this.cleanValues();
  }

  cleanValues() {
    this.values = Object.keys(this.values).reduce(
      (total, cur) => ({
        ...total,
        [cur]: {
          ...this.values[cur],
          colonistValue: roundToTwoDecimals(this.values[cur].colonistValue),
          slaveValue: roundToTwoDecimals(this.values[cur].colonistValue),
        },
      }),
      {}
    );
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
      const incapableLabors = getIncapableLabors(pawn, true);
      if (incapableLabors.includes(LABOR_CATEGORIES.firefighting.value)) {
        this.processValues(pawn.id, { colonistValue: -1, slaveValue: 0 });
      }
      if (incapableLabors.includes(LABOR_CATEGORIES.violent.value)) {
        this.processValues(pawn.id, { colonistValue: -2, slaveValue: 0 });
      }
      if (incapableLabors.includes(LABOR_CATEGORIES.skilled.value)) {
        this.processValues(pawn.id, { colonistValue: -2, slaveValue: 0 });
      }
      if (incapableLabors.includes(LABOR_CATEGORIES.dumb.value)) {
        this.processValues(pawn.id, { colonistValue: -2, slaveValue: 0 });
      }
    });
  }

  getSkillValues({ pawn, skill }) {
    const targetSkill = this.targetsSkills[pawn.id][skill];
    if (targetSkill && targetSkill.level > 0) {
      if (targetSkill.passion) {
        if (targetSkill.passion === MAJOR_PASSION) {
          if (
            targetSkill.level >=
            Math.max(
              this.colonyStats[skill].upperQuantile - MAJOR_PASSION_VALUE,
              MINIMUM_USEFUL_SKILL_LEVEL
            )
          ) {
            return BASE_VALUE * 2 * MAJOR_PASSION_MODIFIER;
          } else if (
            targetSkill.level >=
            Math.max(
              this.colonyStats[skill].average - MAJOR_PASSION_VALUE,
              MINIMUM_USEFUL_SKILL_LEVEL
            )
          ) {
            return BASE_VALUE * MAJOR_PASSION_MODIFIER;
          }
        } else {
          if (
            targetSkill.level >=
            Math.max(
              this.colonyStats[skill].upperQuantile - MINOR_PASSION_VALUE,
              MINIMUM_USEFUL_SKILL_LEVEL
            )
          ) {
            return BASE_VALUE * 1.5 * MINOR_PASSION_MODIFIER;
          } else if (
            targetSkill.level >=
            Math.max(
              this.colonyStats[skill].average - MINOR_PASSION_VALUE,
              MINIMUM_USEFUL_SKILL_LEVEL
            )
          ) {
            return BASE_VALUE * 0.75 * MINOR_PASSION_MODIFIER;
          }
        }
      } else {
        if (
          targetSkill.level >=
          Math.max(this.colonyStats[skill].upperQuantile, MINIMUM_USEFUL_SKILL_LEVEL)
        ) {
          return BASE_VALUE * NO_PASSION_MODIFIER;
        } else if (
          targetSkill.level >= Math.max(this.colonyStats[skill].average, MINIMUM_USEFUL_SKILL_LEVEL)
        ) {
          return BASE_VALUE * 0.5 * NO_PASSION_MODIFIER;
        }
      }
    }
  }

  compareStats() {
    this.targets.forEach((pawn) => {
      const incapableSkills = makeIncapableSkills(getIncapableLabors(pawn));
      SKILLS_ARRAY.forEach((skill) => {
        const skillValue = this.getSkillValues({ pawn, skill });
        this.processValues(pawn.id, {
          colonistValue: !incapableSkills.includes(skill) ? skillValue : 0,
          slaveValue: !this.slaveIncapableSkills.includes(skill) ? skillValue : 0,
        });
      });
    });
  }
}

export default EvaluationBuilder;
