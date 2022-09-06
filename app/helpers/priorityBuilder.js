import { DEFAULT_LABOR_PRIO, MAJOR_PASSION } from "../constants/constants";
import { buildLaborsList } from "./rosterHelpers";
import { buildLabors, isPawnCapable } from "./utils";

class PriorityBuilder {
  constructor({ pawns, modList, rawPriorities }) {
    this.pawns = pawns;
    this.numPawns = this.pawns.length;
    this.modList = modList;
    this.rawPriorities = rawPriorities;
    this.priorities = {};
    this.numToAssign = Math.ceil(this.numPawns * (1 / 3));
    [this.labors, this.laborsLookup] = buildLabors(this.modList);
    this.pawnSkills = this.pawns.map(
      ({
        name: { nick: name },
        skills: {
          skills: { li: skills },
        },
      }) => ({ name, skills: skills.reduce((total, cur) => ({ ...total, [cur.def]: cur }), {}) })
    );
  }

  getSkillValue(skillObj) {
    if (skillObj) {
      const passionValue = skillObj.passion ? (skillObj.passion === MAJOR_PASSION ? 5 : 2) : 0;
      return Math.min(+skillObj.level + passionValue, 20);
    }
    return 0;
  }

  sortBySkill(skill) {
    this.pawnSkills.sort(
      (a, b) => this.getSkillValue(b.skills[skill]) - this.getSkillValue(a.skills[skill])
    );
  }

  buildSuggestions() {
    this.pawns.forEach(({ name: { nick: name } }) => (this.priorities[name] = []));
    this.labors.forEach((labor, idx) => {
      if (labor.allDo) {
        Object.keys(this.priorities).forEach((name) => {
          if (
            isPawnCapable({
              pawn: this.pawns.find(({ name: { nick } }) => nick === name),
              laborName: labor.name,
              laborsLookup: this.laborsLookup,
            })
          ) {
            this.priorities[name] = [
              ...this.priorities[name],
              {
                name: labor.name,
                suggested: DEFAULT_LABOR_PRIO,
                current: this.getCurrentPriority(name, idx),
              },
            ];
          }
        });
      } else {
        if (labor.skill) {
          this.sortBySkill(labor.skill);
        }
      }
      let counter = 0;
      while (this.countPawnsAssignedToLabor(labor.name) < this.numToAssign) {
        const pawn = this.pawnSkills[counter].name;
        if (
          isPawnCapable({
            pawn: this.pawns.find(({ name: { nick } }) => nick === pawn),
            laborName: labor.name,
            laborsLookup: this.laborsLookup,
          })
        ) {
          this.priorities[pawn] = [
            ...this.priorities[pawn],
            {
              name: labor.name,
              suggested: DEFAULT_LABOR_PRIO,
              current: this.getCurrentPriority(pawn, idx),
            },
          ];
        }
        if (counter === this.numPawns) break;
        counter++;
      }
    });
  }

  countPawnsAssignedToLabor(labor) {
    return Object.keys(this.priorities).filter(
      (pawn) =>
        !!this.priorities[pawn].find(({ name, suggested }) => name === labor && suggested > 0)
    ).length;
  }

  getOrderedPriorities() {
    const finalPrios = {};
    const laborLabels = buildLaborsList(this.modList).reduce(
      (total, cur) => [...total, cur.name],
      []
    );
    Object.keys(this.priorities).forEach((pawn) => {
      finalPrios[pawn] = laborLabels.map((labor) => {
        const foundLabor = this.priorities[pawn].find(({ name }) => name === labor);
        if (foundLabor) return foundLabor;
        return {
          name: labor,
          suggested: "",
          current: this.getCurrentPriority(
            pawn,
            this.labors.findIndex(({ name }) => name === labor)
          ),
        };
      });
    });
    return finalPrios;
  }

  getCurrentPriority(pawn, idx) {
    return this.rawPriorities.find(({ name }) => name === pawn).priorities[idx];
  }
}

export default PriorityBuilder;
