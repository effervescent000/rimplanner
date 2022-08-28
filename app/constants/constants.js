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

export const LABORS = [
  { name: "Firefight" },
  { name: "Patient" },
  { name: "Doctor" },
  { name: "Bed rest" },
  { name: "Haul+", source: ALLOW_TOOL },
  { name: "Basic" },
  { name: "Warden" },
  { name: "Handle" },
  { name: "Entertain", source: HOSPITALITY },
  { name: "Cook" },
  { name: "Hunt" },
  { name: "Construct" },
  { name: "Grow" },
  { name: "Mine" },
  { name: "Quarry", source: QUARRY },
  { name: "Plant cut" },
  { name: "Smith" },
  { name: "Tailor" },
  { name: "Art" },
  { name: "Craft" },
  { name: "Haul" },
  { name: "Clean" },
  { name: "Genetics", source: VANILLA_GENETICS_EXPANDED },
  { name: "Research" },
  { name: "Managing", source: COLONY_MANAGER },
  { name: "Writing", source: VANILLA_BOOKS_EXPANDED },
];
