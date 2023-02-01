import type { PawnName } from "./types";

export interface ConfigParams {}

export interface RimContextParams {
  saveData: {
    colonists?: Array<PawnParams>;
    slaves?: Array<PawnParams>;
    prisoners?: Array<PawnParams>;
    modList?: Array<string>;
  };
  setSaveData: () => void;
  config: {};
  setConfig: () => void;
}

interface HediffParams {
  $?: { Class: string };
  def: string;
  severity: string;
}

export interface SkillParams {
  level: number;
  passion?: string;
  def: string;
}

export interface StringIndexedValues {
  [key: string]: number;
}

export interface ValueMapping {
  [key: string]: {
    name: string;
    value: (
      arg1?: PawnParams,
      arg2?: TraitParams
    ) => {
      colonistValue: number;
      slaveValue: number;
    };
    source?: string;
  };
}

export interface TraitParams {
  def: string;
  sourceGene?: string;
  suppressedBy?: string;
  degree?: number;
}

export interface PawnParams {
  id: string;
  story: {
    childhood: string;
    adulthood?: string;
    traits: { allTraits: { li: Array<TraitParams> | TraitParams } };
    bodyType: string;
    headGraphicPath: string;
    hairDef: string;
    hairColor: string;
    melanin: string;
  };
  guest: { guestStatus: string };
  name: { first: string; last: string; nick?: string };
  gender?: string;
  ageTracker: { ageBiologicalTicks: number };
  healthTracker: { hediffSet: { hediffs: { li?: Array<HediffParams> | HediffParams } } };
  skills: { skills: { li: Array<SkillParams> } };
  workSettings: {
    priorities: {
      vals: {
        li: Array<number>;
      };
    };
  };
}

export interface WorkPriorityParams {
  name: PawnName;
  priorities: Array<SinglePrioParams>;
}

interface SinglePrioParams {
  labor: string;
  currentPrio: number;
}

export interface LaborParams {
  name: string;
  allDo?: boolean;
  categories?: Array<LaborCategoryParams>;
  maxPrio?: boolean;
  skill?: string;
  focusTask?: boolean;
  source?: string;
}

export interface LaborLookupParams {
  [key: string]: LaborParams;
}

export interface LaborCategoryParams {
  value: string;
  skills?: Array<string>;
}

export interface BackstoryParams {
  name: string;
  incapable?: Array<LaborCategoryParams>;
}

export interface BackstoryLookupParams {
  [key: string]: Array<LaborCategoryParams>;
}

export interface LifeStageParams {
  bodySize: number;
  nutritionMod?: number;
  minAge: number;
  key: string;
}
