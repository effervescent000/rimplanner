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
import { HEALTH_CONDITIONS } from "app/constants/healthConstants";
import type {
  ConfigParams,
  StringIndexedValues,
  LaborCategoryParams,
  LaborParams,
  PawnParams,
  SkillParams,
} from "app/types/interfaces";
import { isArray } from "lodash";

const BASE_VALUE = 1;

// the threshold below which we flag a pawn as bleeding out
const BLEEDING_OUT_THRESHOLD = 2.5;

const INJURY = "Hediff_Injury";
const INJURIES_MAP: StringIndexedValues = {
  Bite: 0.06,
  Crush: 0.01,
  Cut: 0.06,
  Gunshot: 0.06,
  Shredded: 0.06,
  Stab: 0.06,
};

const makeIncapableSkills = (laborCategories: Array<LaborCategoryParams>) => {
  const reducedLabors = laborCategories.reduce(
    (total, cur) => [...total, ...(cur.skills || [])],
    [] as Array<string>
  );
  return reducedLabors;
};

interface ValueParams {
  value: number;
  reasons: Array<ValueReason>;
}

interface ValueReason {
  reason: string;
  value: number;
}

interface PawnValues {
  [key: string]: {
    bleedingOut: boolean;
    colonist: ValueParams;
    slave: ValueParams;
  };
}

class EvaluationBuilder {
  readonly targets: Array<PawnParams>;
  targetsSkills: { [key: string]: { [key: string]: SkillParams } };
  readonly playerPawns: Array<PawnParams>;
  readonly config: ConfigParams;
  readonly colonyStats: { [key: string]: { average: number; upperQuantile: number } };
  values: PawnValues;
  readonly labors: Array<LaborParams>;
  readonly laborsLookup: { [key: string]: LaborParams };
  slaveIncapableLabors: Array<LaborCategoryParams>;
  readonly slaveIncapableSkills: Array<string>;

  constructor({
    targets,
    playerPawns,
    modList,
    config,
  }: {
    targets: Array<PawnParams>;
    playerPawns: Array<PawnParams>;
    modList: Array<string>;
    config: ConfigParams;
  }) {
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
          colonist: { value: 0, reasons: [] },
          bleedingOut: false,
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
      (total: PawnValues, cur: string): PawnValues => ({
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
      {} as PawnValues
    );
  }

  processValues({
    id,
    values,
    reason,
  }: {
    id: string;
    values: { colonistValue?: number; slaveValue?: number };
    reason: string | undefined;
  }) {
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
        if (isArray(hediffs)) {
          let bloodLossSeverity: number = 0;
          const bleeding: Array<number> = [];
          hediffs.forEach(({ $, def: hediff, severity }) => {
            if ($ && $.Class === INJURY) {
              bleeding.push((INJURIES_MAP[hediff] || 0) * +severity);
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
      (Array.isArray(traits) ? traits : [traits]).forEach((trait) => {
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
      const incapableLabors = getIncapableLabors(pawn, true) as Array<string>;
      laborsToCheck.forEach(({ labor, values }) => {
        if (incapableLabors.includes(labor)) {
          this.processValues({ id: pawn.id, values, reason: `Incapable of ${labor}` });
        }
      });
    });
  }

  getSkillValues({ pawn, skill }: { pawn: PawnParams; skill: string }) {
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
      const incapableSkills = makeIncapableSkills(
        getIncapableLabors(pawn) as Array<LaborCategoryParams>
      );
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
