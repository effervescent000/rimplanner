import { BACKSTORIES_LOOKUP } from "~/constants/backstoryConstants";
import { BASE_GAME_LABORS, DEFAULT_LABOR_PRIO, MOD_LABORS } from "~/constants/constants";
import {
  ALLOW_TOOL,
  COLONY_MANAGER,
  HOSPITALITY,
  QUARRY,
  VANILLA_BOOKS_EXPANDED,
  VANILLA_GENETICS_EXPANDED,
} from "~/constants/modConstants";
import { buildLaborsList } from "./rosterHelpers";

class PriorityBuilder {
  constructor({ pawns, modList, rawPriorities }) {
    this.pawns = pawns;
    this.numPawns = this.pawns.length;
    this.modList = modList;
    this.rawPriorities = rawPriorities;
    this.priorities = {};
    this.numToAssign = Math.ceil(this.numPawns * (1 / 3));

    this.labors = [...BASE_GAME_LABORS];
    this.laborsLookup = {};
    this.pawnSkills = this.pawns.map(
      ({
        name: { nick: name },
        skills: {
          skills: { li: skills },
        },
      }) => ({ name, skills })
    );
  }

  buildLaborsArray() {
    this.modList.forEach((mod) => {
      switch (mod) {
        case ALLOW_TOOL:
          this.labors.push(MOD_LABORS.haulPlus);
          this.labors.push(MOD_LABORS.hiddenLabor);
          break;
        case COLONY_MANAGER:
          this.labors.push(MOD_LABORS.managing);
          break;
        case HOSPITALITY:
          this.labors.push(MOD_LABORS.entertaining);
          break;
        case QUARRY:
          this.labors.push(MOD_LABORS.quarrying);
          break;
        case VANILLA_BOOKS_EXPANDED:
          this.labors.push(MOD_LABORS.writing);
          break;
        case VANILLA_GENETICS_EXPANDED:
          this.labors.push(MOD_LABORS.genetics);
          break;
        default:
          break;
      }
    });
    this.laborsLookup = this.labors.reduce((total, cur) => ({ ...total, [cur.name]: cur }), {});
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
          this.pawnSkills.sort(
            (a, b) =>
              (+b.skills.find(({ def }) => def === labor.skill).level || 0) -
              (+a.skills.find(({ def }) => def === labor.skill).level || 0)
          );
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
