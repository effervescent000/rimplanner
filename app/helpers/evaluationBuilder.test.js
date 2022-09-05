import { MAJOR_PASSION } from "../constants/constants";
import { SKILLS } from "../constants/skillsConstants";
import EvaluationBuilder from "./evaluationBuilder";
import { getThreePawns, modListFactory, pawnFactory } from "./test-helpers/shapes";

describe("Test constructor", () => {
  it("Builds necessary variables correctly", () => {
    const playerPawns = getThreePawns();
    const modList = modListFactory();
    const comparisonPawns = [
      pawnFactory({
        name: "Bob",
        skills: { [SKILLS.shooting.name]: { level: 5, passion: MAJOR_PASSION } },
        modList,
      }),
      pawnFactory({ name: "Jane", skills: { [SKILLS.construction.name]: { level: 10 } }, modList }),
    ];
    const eb = new EvaluationBuilder({ targets: comparisonPawns, playerPawns });
    expect(Object.keys(eb.values)).toHaveLength(2);
    expect(eb.values[comparisonPawns[0].id]).toBeDefined();
  });
});
