import { NUTRITION_VALUE } from "~/constants/constants";
import { FOOD_PLANTS_ARRAY, GROW_DAY_DIVISOR, PLANTS_BY_KEY } from "~/constants/plantsConstants";

class WarningsBuilder {
  constructor({ growingZones }) {
    this.growingZones = growingZones;
    this.cropsPlanted = this.growingZones
      .filter(({ plantDefToGrow: plant }) => FOOD_PLANTS_ARRAY.includes(plant))
      .reduce(
        (total, cur) => ({
          ...total,
          [cur.plantDefToGrow]: (total[cur.plantDefToGrow] || 0) + cur.cells.li.length,
        }),
        {}
      );
    this.nutritionPerDay = {};
  }

  calculateNutrition() {
    Object.entries(this.cropsPlanted).forEach(([key, value]) => {
      const plant = PLANTS_BY_KEY[key];
      this.nutritionPerDay[key] =
        ((plant.harvestYield * NUTRITION_VALUE) / (plant.growDays / GROW_DAY_DIVISOR)) * value;
    });
  }
}

export default WarningsBuilder;
