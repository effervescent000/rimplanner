export interface PawnStoryParams {
  childhood: string;
  adulthood?: string;
}

export interface PawnGuestParams {
  guestStatus: string;
}

export interface PawnNameParams {
  first: string;
  last: string;
  nick?: string;
}

interface HediffParams {
  def: string;
}

export interface PawnParams {
  story: PawnStoryParams;
  guest: PawnGuestParams;
  name: PawnNameParams;
  gender?: string;
  ageTracker: { ageBiologicalTicks: number };
  healthTracker: { hediffSet: { hediffs: { li: Array<HediffParams> | HediffParams } } };
}

export interface LaborParams {
  name: string;
  allDo?: boolean;
  categories?: Array<string>;
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
  [key: string]: Array<BackstoryParams>;
}
