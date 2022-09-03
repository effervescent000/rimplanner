import { BACKSTORIES_LOOKUP } from "../constants/backstoryConstants";
import {
  BASE_GAME_LABORS,
  DEFAULT_LABOR_PRIO,
  MAJOR_PASSION,
  MOD_LABORS,
} from "../constants/constants";
import {
  ALLOW_TOOL,
  COLONY_MANAGER,
  HOSPITALITY,
  QUARRY,
  VANILLA_BOOKS_EXPANDED,
  VANILLA_GENETICS_EXPANDED,
} from "../constants/modConstants";
import { buildLaborsList } from "./rosterHelpers";

export const buildLabors = (modList) => {
  const labors = [...BASE_GAME_LABORS];
  modList.forEach((mod) => {
    switch (mod) {
      case ALLOW_TOOL:
        labors.push(MOD_LABORS.haulPlus);
        labors.push(MOD_LABORS.hiddenLabor);
        break;
      case COLONY_MANAGER:
        labors.push(MOD_LABORS.managing);
        break;
      case HOSPITALITY:
        labors.push(MOD_LABORS.entertaining);
        break;
      case QUARRY:
        labors.push(MOD_LABORS.quarrying);
        break;
      case VANILLA_BOOKS_EXPANDED:
        labors.push(MOD_LABORS.writing);
        break;
      case VANILLA_GENETICS_EXPANDED:
        labors.push(MOD_LABORS.genetics);
        break;
      default:
        break;
    }
  });
  return [labors, labors.reduce((total, cur) => ({ ...total, [cur.name]: cur }), {})];
};

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
      (a, b) => this.getSkillValue(a.skills[skill]) - this.getSkillValue(b.skills[skill])
    );
  }

  buildSuggestions() {
    this.pawns.forEach(({ name: { nick: name } }) => (this.priorities[name] = []));
    this.labors.forEach((labor, idx) => {
      if (labor.allDo) {
        Object.keys(this.priorities).forEach((name) => {
          if (this.isPawnCapable(name, labor.name)) {
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
        if (this.isPawnCapable(pawn, labor.name)) {
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

  isPawnCapable(pawn, labor) {
    const {
      story: { childhood, adulthood },
    } = this.pawns.find(({ name: { nick: name } }) => name === pawn);
    const incapableSkills = [
      ...(BACKSTORIES_LOOKUP[childhood] || []),
      ...(BACKSTORIES_LOOKUP[adulthood] || []),
    ];
    const pawnCantDo = incapableSkills.filter((skill) =>
      (this.laborsLookup[labor].categories || []).includes(skill)
    );
    return !pawnCantDo.length;
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
