import { LABORS_OBJ } from "../constants/constants";
import { SKILLS } from "../constants/skillsConstants";
import PriorityBuilder from "./priorityBuilder";
import { getBasicPawns, modListFactory } from "./test-helpers/shapes";
import { getName } from "./utils";

const pawns = getBasicPawns();
const rawPriorities = pawns.map((pawn) => {
  return { name: getName(pawn), priorities: pawn.workSettings.priorities.vals.li };
});

const findPawnPriority = ({ pawnName, pb, labor }) => {
  const prioObj = pb.priorities[pawnName].find(({ name }) => name === labor);
  if (!prioObj) return undefined;
  return prioObj.suggested;
};

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
    pb.sortBySkill(SKILLS.medicine.name);
    expect(pb.pawnSkills[0].name).toBe("Hakuja");
  });
});

describe("Suggestions testing", () => {
  it("Builds appropriate suggestions", () => {
    const pb = new PriorityBuilder({ pawns, modList: modListFactory(), rawPriorities });
    pb.buildSuggestions();
    expect(findPawnPriority({ pawnName: "Buck", pb, labor: LABORS_OBJ.crafting.name })).toEqual(3);
    expect(findPawnPriority({ pawnName: "Belsaas", pb, labor: LABORS_OBJ.crafting.name })).toEqual(
      3
    );
    expect(
      findPawnPriority({ pawnName: "Gennady", pb, labor: LABORS_OBJ.crafting.name })
    ).toBeUndefined();
    expect(
      findPawnPriority({ pawnName: "Buck", pb, labor: LABORS_OBJ.researching.name })
    ).toBeUndefined();
    expect(
      findPawnPriority({ pawnName: "Belsaas", pb, labor: LABORS_OBJ.researching.name })
    ).toEqual(3);
    expect(
      findPawnPriority({ pawnName: "Gennady", pb, labor: LABORS_OBJ.researching.name })
    ).toBeUndefined();
  });
  it("Ignores incapable pawns", () => {
    const pb = new PriorityBuilder({ pawns, modList: modListFactory(), rawPriorities });
    pb.buildSuggestions();
    expect(
      findPawnPriority({ pawnName: "Belsaas", pb, labor: LABORS_OBJ.firefighting.name })
    ).toBeUndefined();
    expect(findPawnPriority({ pawnName: "Buck", pb, labor: LABORS_OBJ.firefighting.name })).toEqual(
      3
    );
    expect(
      findPawnPriority({ pawnName: "Hakuja", pb, labor: LABORS_OBJ.wardening.name })
    ).toBeUndefined();
  });
});
