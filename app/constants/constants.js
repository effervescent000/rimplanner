import {
  ALLOW_TOOL,
  COLONY_MANAGER,
  HOSPITALITY,
  QUARRY,
  VANILLA_BOOKS_EXPANDED,
  VANILLA_GENETICS_EXPANDED,
} from "./modConstants";

export const PLAYER_COLONY = "PlayerColony";
export const PAWN_CONSTANT = "Pawn";
export const HUMAN_CONSTANT = "Human";
export const MINOR_PASSION = "Minor";
export const MAJOR_PASSION = "Major";

export const SKILLS = [
  "Shooting",
  "Melee",
  "Construction",
  "Mining",
  "Cooking",
  "Plants",
  "Animals",
  "Crafting",
  "Artistic",
  "Medicine",
  "Social",
  "Intellectual",
];

export const DEFAULT_LABOR_PRIO = 3;

export const LABORS = [
  { name: "Firefight", allDo: true },
  { name: "Patient", allDo: true },
  { name: "Doctor", skill: "Medicine" },
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
  { name: "Managing", source: COLONY_MANAGER },
  { name: "Writing", source: VANILLA_BOOKS_EXPANDED },
];
