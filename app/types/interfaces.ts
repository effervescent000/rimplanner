export interface ConfigParams {}

interface HediffParams {
  $?: { Class: string };
  def: string;
  severity: number;
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
    value:
      | (() => { colonistValue: number; slaveValue: number })
      | ((
          arg1: PawnParams,
          arg2: TraitParams
        ) => {
          colonistValue: number;
          slaveValue: number;
        });
    source?: string;
  };
}

interface TraitParams {
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
  };
  guest: { guestStatus: string };
  name: { first: string; last: string; nick?: string };
  gender?: string;
  ageTracker: { ageBiologicalTicks: number };
  healthTracker: { hediffSet: { hediffs: { li: Array<HediffParams> | HediffParams } } };
  skills: { skills: { li: Array<SkillParams> } };
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
  skills: Array<string>;
}

export interface BackstoryParams {
  name: string;
  incapable?: Array<LaborCategoryParams>;
}

export interface BackstoryLookupParams {
  [key: string]: Array<BackstoryParams>;
}

export interface LifeStageParams {
  bodySize: number;
  nutritionMod?: number;
  minAge: number;
  key: string;
}
