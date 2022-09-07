export const GROW_DAY_DIVISOR = 0.5417;
// fertility will eventually be able to be changed in the settings
export const FERTILITY = 1;

export const PLANTS = {
  Plant_Corn: { key: "Plant_Corn", growDays: 11.3, harvestYield: 22 },
  Plant_Potato: { key: "Plant_Potato", growDays: 5.8, harvestYield: 11 },
  Plant_Rice: { key: "Plant_Rice", growDays: 3, harvestYield: 6 },
  // modded foods after here
  VCE_Beans: { key: "VCE_Beans", growDays: 6, harvestYield: 8 },
  VCE_BellPepper: { key: "VCE_BellPepper", growDays: 4.7, harvestYield: 10 },
  VCE_Buckwheat: { key: "VCE_Buckwheat", growDays: 5, harvestYield: 9 },
  VCE_Carrot: { key: "VCE_Carrot", growDays: 6, harvestYield: 8 },
  VCE_Okra: { key: "VCE_Okra", growDays: 7.2, harvestYield: 14 },
  VCE_Onion: { key: "VCE_Onion", growDays: 5.6, harvestYield: 11 },
  VCE_Peanut: { key: "VCE_Peanut", growDays: 6.25, harvestYield: 12 },
  VCE_Pepper: { key: "VCE_Pepper", growDays: 5.2, harvestYield: 10 },
  VCE_SweetPotato: { key: "VCE_SweetPotato", growDays: 5.8, harvestYield: 10 },
  VCE_Tomato: { key: "VCE_Tomato", growDays: 7.2, harvestYield: 10 },
};

export const FOOD_PLANTS_ARRAY = Object.values(PLANTS).map(({ key }) => key);
