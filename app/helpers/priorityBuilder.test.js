import PriorityBuilder from "./priorityBuilder";
import { getThreePawns, modListFactory } from "./test-helpers/priorityBuilderShapes";

describe("Testing constructor", () => {
  it("initializes properly", () => {
    const pawns = getThreePawns();
    const pb = PriorityBuilder({
      pawns,
      modListL: modListFactory(),
      rawPriorities: pawns.map(({ name, workSettings }) => ({
        name: name.nick,
        priorities: workSettings.priorities.vals.li,
      })),
    });
    expect(pb.labors.length).toBe(20);
  });
});
