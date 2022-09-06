export const GROW_DAY_DIVISOR = 0.5417;
// fertility will eventually be able to be changed in the settings
export const FERTILITY = 1;

export const PLANTS = {
  rice: { key: "Plant_Rice", growDays: 3, harvestYield: 6 },
  corn: { key: "Plant_Corn", growDays: 11.3, harvestYield: 22 },
  // modded foods after here
  peanuts: { key: "VCE_Peanut", growDays: 6.25, harvestYield: 12 },
  peppers: { key: "VCE_Pepper", growDays: 5.2, harvestYield: 10 },
};

export const PLANTS_BY_KEY = Object.values(PLANTS).reduce(
  (total, cur) => ({ ...total, [cur.key]: cur }),
  {}
);

export const FOOD_PLANTS_ARRAY = Object.values(PLANTS).map(({ key }) => key);
