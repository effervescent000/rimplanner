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
        [id]: {
          bleedingOut: false,
          colonist: { value: 0, reasons: [] },
          slave: { value: 0, reasons: [] },
        },
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
          colonist: {
            ...this.values[cur].colonist,
            value: roundToTwoDecimals(this.values[cur].colonist.value),
          },
          slave: {
            ...this.values[cur].slave,
            value: roundToTwoDecimals(this.values[cur].slave.value),
          },
        },
      }),
      {}
    );
  }

  processValues({ id, values, reason }) {
    const colonistValue = values.colonistValue || 0;
    const slaveValue = values.slaveValue || 0;

    this.values[id].colonist.value += colonistValue;
    this.values[id].slave.value += slaveValue;
    if (reason) {
      this.values[id].colonist.reasons.push({ reason, value: colonistValue });
      this.values[id].slave.reasons.push({ reason, value: slaveValue });
    }
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
                this.processValues({ id, values: hediffValue.value(), reason: hediff });
              }
            }
          });
          const bloodLossRate = bleeding.reduce((total, cur) => total + cur, 0);
          const timeToBleedOut = ((1 - bloodLossSeverity) / bloodLossRate) * 24;
          if (timeToBleedOut < BLEEDING_OUT_THRESHOLD) {
            this.values[id].bleedingOut = true;
          }
        } else {
          const hediff = hediffs.def;
          const hediffValue = HEALTH_CONDITIONS[hediff];
          if (hediffValue) {
            this.processValues({ id, values: hediffValue.value(), reason: hediff });
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
          this.processValues({ id, values: foundTrait.value(pawn, trait), reason: traitName });
        }
      });
    });
  }

  checkIncapables() {
    const laborsToCheck = [
      { labor: LABOR_CATEGORIES.firefighting.value, values: { colonistValue: -1, slaveValue: 0 } },
      { labor: LABOR_CATEGORIES.violent.value, values: { colonistValue: -2, slaveValue: 0 } },
      { labor: LABOR_CATEGORIES.dumb.value, values: { colonistValue: -3, slaveValue: 0 } },
    ];

    this.targets.forEach((pawn) => {
      const incapableLabors = getIncapableLabors(pawn, true);
      laborsToCheck.forEach(({ labor, values }) => {
        if (incapableLabors.includes(labor)) {
          this.processValues({ id: pawn.id, values, reason: `Incapable of ${labor}` });
        }
      });
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
    return 0;
  }

  compareStats() {
    this.targets.forEach((pawn) => {
      const incapableSkills = makeIncapableSkills(getIncapableLabors(pawn));
      SKILLS_ARRAY.forEach((skill) => {
        const skillValue = this.getSkillValues({ pawn, skill });
        const values = {
          colonistValue: !incapableSkills.includes(skill) ? skillValue : 0,
          slaveValue: !this.slaveIncapableSkills.includes(skill) ? skillValue : 0,
        };
        const reason = values.colonistValue || values.slaveValue ? skill : undefined;
        this.processValues({
          id: pawn.id,
          values,
          reason,
        });
      });
    });
  }
}

export default EvaluationBuilder;
