import {
  ALLOW_TOOL,
  COLONY_MANAGER,
  HOSPITALITY,
  QUARRY,
  VANILLA_BOOKS_EXPANDED,
  VANILLA_GENETICS_EXPANDED,
} from "./modConstants";
import { SKILLS } from "./skillsConstants";

export const BASE_ASSET_URL = "./assets/";

export const PLAYER_COLONY = "PlayerColony";
export const PAWN_CONSTANT = "Pawn";
export const HUMAN_CONSTANT = "Human";
export const COLONIST = "Colonist";
export const SLAVE = "Slave";
export const MINOR_PASSION = "Minor";
export const MAJOR_PASSION = "Major";

export const DEFAULT_LABOR_PRIO = 3;

export const LABORS = [
  { name: "Firefight", allDo: true },
  { name: "Patient", allDo: true },
  { name: "Doctor", skill: SKILLS.medicine.name },
  { name: "Bed rest", allDo: true },
  { name: "Haul+", source: ALLOW_TOOL },
  { name: "Basic", allDo: true },
  { name: "Warden", skill: "Social" },
  { name: "Handle", skill: "Animals" },
  { name: "Entertain", source: HOSPITALITY, skill: "Social" },
  { name: "Cook", skill: "Cooking" },
  { name: "Hunt", skill: "Shooting" },
  { name: "Construct", skill: "Construction" },
  { name: "Grow", skill: "Plants" },
  { name: "Mine", skill: "Mining" },
  { name: "Quarry", source: QUARRY, skill: "Mining" },
  { name: "Plant cut" },
  { name: "Smith", skill: "Crafting" },
  { name: "Tailor", skill: "Crafting" },
  { name: "Art", skill: "Artistic" },
  { name: "Craft", skill: "Crafting" },
  { name: "Haul" },
  { name: "Clean" },
  { name: "Genetics", source: VANILLA_GENETICS_EXPANDED, skill: "Intellectual" },
  { name: "Research", skill: "Intellectual" },
  { name: "Managing", source: COLONY_MANAGER, skill: "Intellectual" },
  { name: "Writing", source: VANILLA_BOOKS_EXPANDED, skill: "Intellectual" },
];

export const LABOR_CATEGORIES = {
  violent: "Violent",
  firefighting: "Firefighting",
  caring: "Caring",
  plantWork: "Plant Work",
  social: "Social",
  dumb: "Dumb Labor",
  skilled: "Skilled Labor",
  intellectual: "Intellectual",
  animals: "Animals",
  cooking: "Cooking",
  hauling: "Hauling",
  cleaning: "Cleaning",
  mining: "Mining",
};

export const BASE_GAME_LABORS = [
  { name: "Firefight", allDo: true, categories: [LABOR_CATEGORIES.firefighting] },
  { name: "Patient", allDo: true },
  { name: "Doctor", skill: SKILLS.medicine.name, categories: [LABOR_CATEGORIES.caring] },
  { name: "Bed rest", allDo: true },
  { name: "Basic", allDo: true },
  { name: "Warden", skill: "Social", categories: [LABOR_CATEGORIES.social] },
  { name: "Handle", skill: "Animals", categories: [LABOR_CATEGORIES.animals] },
  {
    name: "Cook",
    skill: "Cooking",
    categories: [LABOR_CATEGORIES.cooking, LABOR_CATEGORIES.skilled],
  },
  { name: "Hunt", skill: "Shooting", categories: [LABOR_CATEGORIES.violent] },
  { name: "Construct", skill: "Construction" },
  { name: "Grow", skill: SKILLS.plants.name },
  { name: "Mine", skill: "Mining" },
  { name: "Plant cut", skill: SKILLS.plants.name },
  { name: "Smith", skill: "Crafting" },
  { name: "Tailor", skill: "Crafting" },
  { name: "Art", skill: "Artistic" },
  { name: "Craft", skill: "Crafting" },
  { name: "Haul", allDo: true, categories: [LABOR_CATEGORIES.dumb, LABOR_CATEGORIES.hauling] },
  { name: "Clean", allDo: true, categories: [LABOR_CATEGORIES.dumb, LABOR_CATEGORIES.cleaning] },
  { name: "Research", skill: "Intellectual", categories: [LABOR_CATEGORIES.intellectual] },
];

export const MOD_LABORS = () => ({
  haulPlus: { name: "Haul+", source: ALLOW_TOOL },
  hiddenLabor: { name: "Hidden", source: ALLOW_TOOL },
  entertaining: {
    name: "Entertain",
    source: HOSPITALITY,
    skill: "Social",
    categories: [LABOR_CATEGORIES.social],
  },
  quarrying: { name: "Quarry", source: QUARRY, skill: "Mining" },
  genetics: {
    name: "Genetics",
    source: VANILLA_GENETICS_EXPANDED,
    skill: "Intellectual",
    categories: [LABOR_CATEGORIES.intellectual],
  },
  managing: {
    name: "Managing",
    source: COLONY_MANAGER,
    skill: "Intellectual",
    categories: [LABOR_CATEGORIES.intellectual],
  },
  writing: {
    name: "Writing",
    source: VANILLA_BOOKS_EXPANDED,
    skill: "Intellectual",
    categories: [LABOR_CATEGORIES.intellectual],
  },
});

export const LABORS_OBJ = {
  firefighting: { name: "Firefight", allDo: true },
  patient: { name: "Patient", allDo: true },
  medicine: { name: "Doctor", skill: SKILLS.medicine.name },
  bedRest: { name: "Bed rest", allDo: true },
  haulPlus: { name: "Haul+", source: ALLOW_TOOL },
  basic: { name: "Basic", allDo: true },
  wardening: { name: "Warden", skill: "Social" },
  handling: { name: "Handle", skill: "Animals" },
  entertaining: { name: "Entertain", source: HOSPITALITY, skill: "Social" },
  cooking: { name: "Cook", skill: "Cooking" },
  hunting: { name: "Hunt", skill: "Shooting" },
  construction: { name: "Construct", skill: "Construction" },
  growing: { name: "Grow", skill: "Plants" },
  mining: { name: "Mine", skill: "Mining" },
  quarrying: { name: "Quarry", source: QUARRY, skill: "Mining" },
  plantCutting: { name: "Plant cut" },
  smithing: { name: "Smith", skill: "Crafting" },
  tailoring: { name: "Tailor", skill: "Crafting" },
  art: { name: "Art", skill: "Artistic" },
  crafting: { name: "Craft", skill: "Crafting" },
  hauling: { name: "Haul" },
  cleaning: { name: "Clean" },
  genetics: { name: "Genetics", source: VANILLA_GENETICS_EXPANDED, skill: "Intellectual" },
  researching: { name: "Research", skill: "Intellectual" },
  managing: { name: "Managing", source: COLONY_MANAGER, skill: "Intellectual" },
  writing: { name: "Writing", source: VANILLA_BOOKS_EXPANDED, skill: "Intellectual" },
};
