import { remove } from "lodash";

import { LABORS_OBJ } from "app/constants/constants";
import type {
  ConfigParams,
  LaborParams,
  PawnParams,
  StringIndexedValues,
  WorkPriorityParams,
} from "app/types/interfaces";
import type { PawnName } from "app/types/types";
import { buildLabors, getCurrentPriorities, getName, isSlave } from "./utils";

class GroupsBuilder {
  readonly colonists: Array<PawnParams>;
  availableColonists: Array<PawnParams>;
  readonly prisoners: Array<PawnParams>;
  readonly slaves: Array<PawnParams>;
  readonly config: ConfigParams;
  readonly modList: Array<string>;
  readonly labors: Array<LaborParams>;
  readonly priorities: Array<WorkPriorityParams>;
  groups: { home: Array<PawnParams>; away: Array<PawnParams> };
  errors: Array<string>;
  readonly importantLabors: Array<string>;

  constructor({
    colonists,
    prisoners,
    slaves,
    config,
    modList,
  }: {
    colonists: Array<PawnParams>;
    prisoners: Array<PawnParams>;
    slaves: Array<PawnParams>;
    config: ConfigParams;
    modList: Array<string>;
  }) {
    this.colonists = colonists;
    this.availableColonists = colonists;
    this.prisoners = prisoners;
    this.slaves = slaves;
    this.config = config;
    this.modList = modList;
    this.groups = { home: [], away: [] };
    // TODO make this come from config settings or at least be affected by it
    this.importantLabors = [
      LABORS_OBJ.medicine.name,
      LABORS_OBJ.wardening.name,
      LABORS_OBJ.childcare.name,
      LABORS_OBJ.cooking.name,
      LABORS_OBJ.growing.name,
    ];

    [this.labors] = buildLabors(this.modList);
    this.priorities = getCurrentPriorities([...this.colonists, ...this.slaves], this.labors);
    this.errors = [];
  }

  laborIsAssigned({ pawnName, laborName }: { pawnName: PawnName; laborName: string }) {
    const pawnPrios = this.priorities.find(({ name }) => name === pawnName);
    if (pawnPrios) {
      const foundPrio = pawnPrios.priorities.find(({ labor }) => labor === laborName);
      if (foundPrio) {
        if (foundPrio.currentPrio > 0 && foundPrio.currentPrio < 4) return true;
      }
    }
    return false;
  }

  makeGroups() {
    const homeGroup = [] as Array<PawnParams>;
    const awayGroup = [] as Array<PawnParams>;

    const importantCounts = this.countImportantLabors([...this.colonists, ...this.slaves]);

    // slaves are always assigned to home group (maybe make this a config thing)
    this.slaves.forEach((pawn) => homeGroup.push(pawn));

    // for a given labor, we first need to check if someone assigned to the home group can do it already
    // if so, we skip assigning it
    if (!this.isAnyAssigned(homeGroup, LABORS_OBJ.medicine.name)) {
      // first assign necessary pawns to home group, then assign remainder to away
      // first check for doctors. need at least one doctor in both teams. if we can't do that, bounce
      const doctors = this.countByAssignedLabor(
        [...this.availableColonists, ...this.slaves],
        LABORS_OBJ.medicine.name
      );
      if (doctors.length < 2) return;
      // look at importantLabors and choose the doctor with the highest value for the home team
      let candidate = this.getHighestCount({
        counts: importantCounts,
        primaryList: doctors,
      });
      if (candidate) homeGroup.push(candidate);
      // TODO come up with a better way to select an away doctor. preferably either medical skill or combat skill
      candidate = this.getHighestCount({
        counts: importantCounts,
        primaryList: doctors,
        nonSlave: true,
        listsToPrune: [this.availableColonists],
      });
      if (candidate) awayGroup.push(candidate);
    }

    // we only need wardens if we have slaves or prisoners
    if ([...this.slaves, ...this.prisoners].length) {
      if (!this.isAnyAssigned(homeGroup, LABORS_OBJ.wardening.name)) {
        const wardens = this.countByAssignedLabor(
          [...this.availableColonists, ...this.slaves],
          LABORS_OBJ.wardening.name
        );
        const candidate = this.getHighestCount({
          counts: importantCounts,
          primaryList: wardens,
          listsToPrune: [this.availableColonists],
        });
        if (candidate) homeGroup.push(candidate);
      }
    }

    // skipping childcare for now TODO
    // check cooking
    if (!this.isAnyAssigned(homeGroup, LABORS_OBJ.cooking.name)) {
      const cooks = this.countByAssignedLabor(
        [...this.availableColonists, ...this.slaves],
        LABORS_OBJ.cooking.name
      );
      const candidate = this.getHighestCount({
        counts: importantCounts,
        primaryList: cooks,
        listsToPrune: [this.availableColonists],
      });
      if (candidate) homeGroup.push(candidate);
    }

    // check growing
    // TODO pull info out of save file about time of year and growing season
    if (!this.isAnyAssigned(homeGroup, LABORS_OBJ.growing.name)) {
      const growers = this.countByAssignedLabor(
        [...this.availableColonists, ...this.slaves],
        LABORS_OBJ.growing.name
      );
      const candidate = this.getHighestCount({
        counts: importantCounts,
        primaryList: growers,
        listsToPrune: [this.availableColonists],
      });
      if (candidate) homeGroup.push(candidate);
    }

    this.availableColonists.forEach((pawn) => awayGroup.push(pawn));

    // at the end, assign home and away groups to this.groups. don't do this until the very end
    // so that if something goes wrong before here, we can bail

    this.groups.home = homeGroup;
    this.groups.away = awayGroup;
  }

  getHighestCount({
    counts,
    primaryList,
    nonSlave = false,
    prune = true,
    listsToPrune = [[]],
  }: {
    counts: StringIndexedValues;
    primaryList: Array<PawnParams>;
    nonSlave?: boolean;
    prune?: boolean;
    listsToPrune?: Array<Array<PawnParams>>;
  }) {
    if (primaryList.length > 1) {
      primaryList.sort((a, b) => counts[getName(b)] - counts[getName(a)]);
    }
    for (let i = 0; i < primaryList.length; i++) {
      const thisPawn = primaryList[i];
      if (!thisPawn) return;
      if (nonSlave === true && isSlave(thisPawn)) continue;
      if (prune) {
        [primaryList, ...listsToPrune].forEach((list) =>
          remove(list, (foundPawn: PawnParams) => getName(foundPawn) === getName(thisPawn))
        );
      }
      return thisPawn;
    }
  }

  countImportantLabors(pawns: Array<PawnParams>) {
    const counts = pawns.reduce(
      (total, cur) => ({ ...total, [getName(cur)]: 0 }),
      {} as { [key: string]: number }
    );
    pawns.forEach((pawn) => {
      const pawnName = getName(pawn);
      this.importantLabors.forEach((laborName) => {
        if (this.laborIsAssigned({ pawnName, laborName })) {
          counts[pawnName] += 1;
        }
      });
    });
    return counts;
  }

  isAnyAssigned(pawns: Array<PawnParams>, laborName: string) {
    let result = false;
    pawns.forEach((pawn) => {
      if (this.isAssignedToLabor(getName(pawn), laborName)) {
        result = true;
      }
    });
    return result;
  }

  isAssignedToLabor(pawnName: PawnName, laborName: string) {
    const pawnPrios = this.priorities.find(
      ({ name: foundName }) => foundName === pawnName
    ) as WorkPriorityParams;
    const laborObj = pawnPrios.priorities.find(({ labor: foundLabor }) => foundLabor === laborName);
    if (laborObj) {
      if (laborObj.currentPrio > 0 && laborObj.currentPrio < 4) {
        return true;
      }
    }
    return false;
  }

  countByAssignedLabor(pawns: Array<PawnParams>, laborName: string) {
    const countedPawns: Array<PawnParams> = [];
    pawns.forEach((pawn) => {
      if (this.isAssignedToLabor(getName(pawn), laborName)) {
        countedPawns.push(pawn);
      }
    });
    return countedPawns;
  }
}

export default GroupsBuilder;
