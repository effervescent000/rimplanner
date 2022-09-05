import { LABORS_OBJ } from "../constants/constants";
import { SKILLS } from "../constants/skillsConstants";
import PriorityBuilder from "./priorityBuilder";
import { getThreePawns, modListFactory } from "./test-helpers/shapes";

const pawns = getThreePawns();
const rawPriorities = pawns.map(({ name, workSettings }) => ({
  name: name.nick,
  priorities: workSettings.priorities.vals.li,
}));

describe("Testing constructor", () => {
  it("initializes properly with a minimal setup", () => {
    const pb = new PriorityBuilder({
      pawns,
      modList: modListFactory(),
      rawPriorities,
    });
    expect(pb.labors.length).toBe(20);
  });
  it("Initializes properly with a more robust setup", () => {
    const pb = new PriorityBuilder({
      pawns,
      modList: modListFactory({ full: true }),
      rawPriorities,
    });
    expect(pb.labors.length).toBe(23);
  });
});

describe("Test sorting", () => {
  it("Sorts correctly", () => {
    const pb = new PriorityBuilder({
      pawns,
      modList: modListFactory(),
      rawPriorities,
    });
    pb.sortBySkill(SKILLS.intellectual.name);
    expect(pb.pawnSkills[0].name).toBe("Belsaas");
    pb.sortBySkill(SKILLS.crafting.name);
    expect(pb.pawnSkills[0].name).toBe("Buck");
  });
});

describe("Suggestions testing", () => {
  it("Builds appropriate suggestions", () => {
    const pb = new PriorityBuilder({ pawns, modList: modListFactory(), rawPriorities });
    pb.buildSuggestions();
    expect(
      pb.priorities[pawns[0].name.nick].find(({ name }) => name === LABORS_OBJ.crafting.name)
        .suggested
    ).toEqual(3);
    expect(
      pb.priorities[pawns[1].name.nick].find(({ name }) => name === LABORS_OBJ.crafting.name)
    ).toBeUndefined();
  });
});
