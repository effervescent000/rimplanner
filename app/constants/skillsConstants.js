export const SKILLS = {
  shooting: { name: "Shooting" },
  melee: { name: "Melee" },
  construction: { name: "Construction" },
  mining: { name: "Mining" },
  cooking: { name: "Cooking" },
  plants: { name: "Plants" },
  animals: { name: "Animals" },
  crafting: { name: "Crafting" },
  artistic: { name: "Artistic" },
  medicine: { name: "Medicine" },
  social: { name: "Social" },
  intellectual: { name: "Intellectual" },
};

export const SKILLS_ARRAY = Object.values(SKILLS).map(({ name }) => name);
