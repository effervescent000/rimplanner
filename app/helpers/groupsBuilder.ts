import type {
  ConfigParams,
  LaborParams,
  PawnParams,
  WorkPriorityParams,
} from "app/types/interfaces";
import { buildLabors, getCurrentPriorities } from "./utils";

class GroupsBuilder {
  readonly colonists: Array<PawnParams>;
  readonly prisoners: Array<PawnParams>;
  readonly slaves: Array<PawnParams>;
  readonly config: ConfigParams;
  readonly modList: Array<string>;
  readonly labors: Array<LaborParams>;
  readonly priorities: Array<WorkPriorityParams>;

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
    this.prisoners = prisoners;
    this.slaves = slaves;
    this.config = config;
    this.modList = modList;

    [this.labors] = buildLabors(this.modList);
    this.priorities = getCurrentPriorities([...this.colonists, ...this.slaves], this.labors);
  }
}

export default GroupsBuilder;
