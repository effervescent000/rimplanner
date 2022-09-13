import { GROW_DAY_DIVISOR, PLANTS } from "~/constants/plantsConstants";
import {
  AVAILABLE_PAWN_HOURS,
  DEFAULT_LABOR_PRIO,
  HIGH_PRIO,
  HOUR,
  LABORS_OBJ,
  LABOR_CATEGORIES,
  MAJOR_PASSION,
  MAX_PRIO,
} from "../constants/constants";
import { buildLaborsList } from "./rosterHelpers";
import { buildLabors, isPawnCapable } from "./utils";

class PriorityBuilder {
  constructor({ pawns, modList, currentPriorities, config, homeZoneSize, growingZones }) {
    this.pawns = pawns;
    this.numPawns = this.pawns.length;
    this.modList = modList;
    this.currentPriorities = currentPriorities;
    this.config = config;
    this.homeZoneSize = homeZoneSize;
    this.growingZones = growingZones;

    this.priorities = {};
    this.pawns.forEach(({ name: { nick: name } }) => (this.priorities[name] = []));
    this.numToAssign = Math.ceil(this.numPawns * (1 / 3));
    [this.labors, this.laborsLookup] = buildLabors(this.modList);
    this.laborLabels = buildLaborsList(this.modList).reduce(
      (total, cur) => [...total, cur.name],
      []
    );
    // this is here instead of a constant because I want to optionally include shooting based on user config
    this.slaveIncapableLabors = [
      LABOR_CATEGORIES.intellectual,
      LABOR_CATEGORIES.social,
      LABOR_CATEGORIES.art,
      LABOR_CATEGORIES.violent,
    ];
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

  makeManHours() {
    const makeGrowingTimePerDay = () =>
      this.growingZones.map(({ plantDefToGrow: plant, cells: { li: cells } }) => {
        const plantInfo = PLANTS[plant];
        return {
          plant,
          manHoursPerDay:
            ((plantInfo.sowWork || 170) +
              ((plantInfo.harvestWork || 200) / (plantInfo.growDays / GROW_DAY_DIVISOR)) *
                cells.length) /
            HOUR,
        };
      });

    return {
      [LABORS_OBJ.construction.name]: (this.homeZoneSize / 1000) * 4,
      [LABORS_OBJ.growing.name]:
        makeGrowingTimePerDay().reduce((total, cur) => total + cur.manHoursPerDay, 0) * 1.05,
      [LABORS_OBJ.hunting.name]: this.config.huntingManHoursPerPawn * this.numPawns,
      [LABORS_OBJ.cooking.name]: this.config.cookingManHoursPerPawn * this.numPawns,
      [LABORS_OBJ.researching.name]: AVAILABLE_PAWN_HOURS,
    };
  }

  pawnHasAvailableTime(pawnName) {
    const tasksWithHours = this.priorities[pawnName].filter(({ hours }) => hours);
    const currentHours = tasksWithHours.reduce((total, cur) => total + cur.hours, 0);
    return currentHours < AVAILABLE_PAWN_HOURS * 0.8;
  }

  buildSuggestionsV2() {
    const manHours = this.makeManHours();
    this.labors.forEach((labor, idx) => {
      if (labor.allDo) {
        this.pawns.forEach((pawn) => {
          const {
            name: { nick: name },
          } = pawn;
          if (
            isPawnCapable({
              pawn,
              laborName: labor.name,
              laborsLookup: this.laborsLookup,
              slaveIncapableSkills: this.slaveIncapableLabors,
            })
          ) {
            this.addLaborPriority({
              pawnName: name,
              laborName: labor.name,
              suggestedPrio: labor.maxPrio ? MAX_PRIO : DEFAULT_LABOR_PRIO,
              laborIdx: idx,
            });
          }
        });
      } else {
        if (labor.skill) {
          this.sortBySkill(labor.skill);
        }
        if (labor.focusTask) {
          let hoursForTask = manHours[labor.name];
          const pawnsNeededForTask = Math.ceil(hoursForTask / AVAILABLE_PAWN_HOURS);
          let counter = 0;
          while (
            this.countPawnsAssignedToLabor({ labor: labor.name, focus: true }) < pawnsNeededForTask
          ) {
            if (counter === this.numPawns) break;
            const pawnName = this.pawnSkills[counter].name;
            const pawn = this.pawns.find(({ name: { nick } }) => nick === pawnName);
            if (
              isPawnCapable({
                pawn,
                laborName: labor.name,
                laborsLookup: this.laborsLookup,
                slaveIncapableSkills: this.slaveIncapableLabors,
              }) &&
              hoursForTask > 0 &&
              this.pawnHasAvailableTime(pawnName)
            ) {
              const hours = Math.min(hoursForTask, AVAILABLE_PAWN_HOURS);
              this.addLaborPriority({
                pawnName,
                laborName: labor.name,
                suggestedPrio: labor.maxPrio ? MAX_PRIO : HIGH_PRIO,
                laborIdx: idx,
                hours: Math.min(hoursForTask, AVAILABLE_PAWN_HOURS),
              });
              hoursForTask -= hours;
            }
            counter++;
          }
        } else {
          let counter = 0;
          while (this.countPawnsAssignedToLabor({ labor: labor.name }) < this.numToAssign) {
            if (counter === this.numPawns) break;
            const pawn = this.pawnSkills[counter].name;
            if (
              isPawnCapable({
                pawn: this.pawns.find(({ name: { nick } }) => nick === pawn),
                laborName: labor.name,
                laborsLookup: this.laborsLookup,
                slaveIncapableSkills: this.slaveIncapableLabors,
              })
            ) {
              this.addLaborPriority({
                pawnName: pawn,
                laborName: labor.name,
                suggestedPrio: labor.maxPrio ? MAX_PRIO : DEFAULT_LABOR_PRIO,
                laborIdx: idx,
              });
            }

            counter++;
          }
        }
      }
    });
  }

  addLaborPriority({ pawnName, laborName, suggestedPrio, laborIdx, hours }) {
    this.priorities[pawnName].push({
      name: laborName,
      suggested: suggestedPrio,
      current: this.getCurrentPriority(pawnName, laborIdx),
      hours,
    });
  }

  buildSuggestions() {
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
            this.addLaborPriority({
              pawnName: name,
              laborName: labor.name,
              suggestedPrio: DEFAULT_LABOR_PRIO,
              laborIdx: idx,
            });
          }
        });
      } else {
        if (labor.skill) {
          this.sortBySkill(labor.skill);
        }
      }
      let counter = 0;
      while (this.countPawnsAssignedToLabor({ labor: labor.name }) < this.numToAssign) {
        const pawn = this.pawnSkills[counter].name;
        if (
          isPawnCapable({
            pawn: this.pawns.find(({ name: { nick } }) => nick === pawn),
            laborName: labor.name,
            laborsLookup: this.laborsLookup,
          })
        ) {
          this.addLaborPriority({
            pawnName: pawn,
            laborName: labor.name,
            suggestedPrio: DEFAULT_LABOR_PRIO,
            laborIdx: idx,
          });
        }
        if (counter === this.numPawns) break;
        counter++;
      }
    });
  }

  countPawnsAssignedToLabor({ labor, focus }) {
    return Object.keys(this.priorities).filter(
      (pawn) =>
        !!this.priorities[pawn].find(
          ({ name, suggested }) =>
            name === labor && (focus ? suggested === 1 || suggested === 2 : suggested > 0)
        )
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
    return this.currentPriorities.find(({ name }) => name === pawn).priorities[idx].currentPrio;
  }
}

export default PriorityBuilder;
