export const GROW_DAY_DIVISOR = 0.5417;
// fertility will eventually be able to be changed in the settings
export const FERTILITY = 1;

export const PLANTS = {
  Plant_Corn: { key: "Plant_Corn", growDays: 11.3, harvestYield: 22 },
  Plant_Potato: { key: "Plant_Potato", growDays: 5.8, harvestYield: 11 },
  Plant_Rice: { key: "Plant_Rice", growDays: 3, harvestYield: 6 },
  // modded foods after here
  VCE_Agave: { key: "VCE_Agave", growDays: 6, harvestYield: 10, harvestWork: 300 },
  VCE_Beans: { key: "VCE_Beans", growDays: 6, harvestYield: 8 },
  VCE_BellPepper: { key: "VCE_BellPepper", growDays: 4.7, harvestYield: 10 },
  VCE_Buckwheat: { key: "VCE_Buckwheat", growDays: 5, harvestYield: 9 },
  VCE_ButternutSquash: {
    key: "VCE_ButternutSquash",
    growDays: 14,
    harvestYield: 25,
    harvestWork: 1000,
    sowWork: 1000,
  },
  VCE_Carrot: { key: "VCE_Carrot", growDays: 6, harvestYield: 8 },
  VCE_Cucumber: {
    key: "VCE_Cucumber",
    growDays: 3,
    harvestYield: 5,
    harvestWork: 1000,
    sowWork: 1000,
  },
  VCE_Lotus: { key: "VCE_Lotus", growDays: 18, harvestYield: 34, harvestWork: 1000, sowWork: 1000 },
  VCE_Melon: {
    key: "VCE_Melon",
    growDays: 10.4,
    harvestYield: 19,
    harvestWork: 1000,
    sowWork: 1000,
  },
  VCE_Okra: { key: "VCE_Okra", growDays: 7.2, harvestYield: 14 },
  VCE_Onion: { key: "VCE_Onion", growDays: 5.6, harvestYield: 11, harvestWork: 300 },
  VCE_Peanut: { key: "VCE_Peanut", growDays: 6.25, harvestYield: 12 },
  VCE_Pepper: { key: "VCE_Pepper", growDays: 5.2, harvestYield: 10 },
  VCE_Pumpkin: { key: "VCE_Pumpkin", growDays: 10.4, harvestYield: 19, harvestWork: 300 },
  VCE_SweetPotato: { key: "VCE_SweetPotato", growDays: 5.8, harvestYield: 10 },
  VCE_Taro: { key: "VCE_Taro", growDays: 5.8, harvestYield: 11, harvestWork: 1000, sowWork: 1000 },
  VCE_Tomato: { key: "VCE_Tomato", growDays: 7.2, harvestYield: 10 },
  VCE_WaterChestnut: {
    key: "VCE_WaterChestnut",
    growDays: 6,
    harvestYield: 9,
    harvestWork: 1000,
    sowWork: 1000,
  },
  VCE_Watercress: {
    key: "VCE_Watercress",
    growDays: 3,
    harvestYield: 6,
    harvestWork: 1000,
    sowWork: 1000,
  },
};

export const FOOD_PLANTS_ARRAY = Object.values(PLANTS).map(({ key }) => key);
