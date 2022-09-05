import { SKILLS } from "../constants/skillsConstants";
import PriorityBuilder from "./priorityBuilder";
import { getThreePawns, modListFactory } from "./test-helpers/shapes";

describe("Testing constructor", () => {
  it("initializes properly with a minimal setup", () => {
    const pawns = getThreePawns();
    const pb = new PriorityBuilder({
      pawns,
      modList: modListFactory(),
      rawPriorities: pawns.map(({ name, workSettings }) => ({
        name: name.nick,
        priorities: workSettings.priorities.vals.li,
      })),
    });
    expect(pb.labors.length).toBe(20);
  });
  it("Initializes properly with a more robust setup", () => {
    const pawns = getThreePawns();
    const pb = new PriorityBuilder({
      pawns,
      modList: modListFactory({ full: true }),
      rawPriorities: pawns.map(({ name, workSettings }) => ({
        name: name.nick,
        priorities: workSettings.priorities.vals.li,
      })),
    });
    expect(pb.labors.length).toBe(23);
  });
});

describe("Test sorting", () => {
  it("Sorts correctly", () => {
    const pawns = getThreePawns();
    const pb = new PriorityBuilder({
      pawns,
      modList: modListFactory(),
      rawPriorities: pawns.map(({ name, workSettings }) => ({
        name: name.nick,
        priorities: workSettings.priorities.vals.li,
      })),
    });
    pb.sortBySkill(SKILLS.intellectual.name);
    expect(pb.pawnSkills[0].name).toBe("Belsaas");
    pb.sortBySkill(SKILLS.crafting.name);
    expect(pb.pawnSkills[0].name).toBe("Buck");
  });
});
