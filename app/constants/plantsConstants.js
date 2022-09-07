export const GROW_DAY_DIVISOR = 0.5417;
// fertility will eventually be able to be changed in the settings
export const FERTILITY = 1;

export const PLANTS = {
  bellPeppers: { key: "VCE_BellPepper", growDays: 4.7, harvestYield: 10 },
  carrots: { key: "VCE_Carrot", growDays: 6, harvestYield: 8 },
  corn: { key: "Plant_Corn", growDays: 11.3, harvestYield: 22 },
  greenBeans: { key: "VCE_Beans", growDays: 6, harvestYield: 8 },
  potatoes: { key: "Plant_Potato", growDays: 5.8, harvestYield: 11 },
  rice: { key: "Plant_Rice", growDays: 3, harvestYield: 6 },
  // modded foods after here
  buckwheat: { key: "VCE_Buckwheat", growDays: 5, harvestYield: 9 },
  okra: { key: "VCE_Okra", growDays: 7.2, harvestYield: 14 },
  onions: { key: "VCE_Onion", growDays: 5.6, harvestYield: 11 },
  peanuts: { key: "VCE_Peanut", growDays: 6.25, harvestYield: 12 },
  peppers: { key: "VCE_Pepper", growDays: 5.2, harvestYield: 10 },
  sweetPotato: { key: "VCE_SweetPotato", growDays: 5.8, harvestYield: 10 },
  tomatoes: { key: "VCE_Tomato", growDays: 7.2, harvestYield: 10 },
};

export const PLANTS_BY_KEY = Object.values(PLANTS).reduce(
  (total, cur) => ({ ...total, [cur.key]: cur }),
  {}
);

export const FOOD_PLANTS_ARRAY = Object.values(PLANTS).map(({ key }) => key);
