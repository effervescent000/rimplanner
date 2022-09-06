import { NUTRITION_REQUIRED_PER_DAY, NUTRITION_VALUE } from "~/constants/constants";
import { FOOD_PLANTS_ARRAY, GROW_DAY_DIVISOR, PLANTS_BY_KEY } from "~/constants/plantsConstants";

const roundToTwoDecimals = (num) => Math.round(num * 100) / 100;

class WarningsBuilder {
  constructor({
    saveData: { growingZones, playerPawns },
    config: { pctNutritionFromPlants, growingSeason },
  }) {
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
    this.pctNutritionFromPlants = pctNutritionFromPlants;
    this.growingSeason = growingSeason;
    this.numPawns = playerPawns.length;
    this.warnings = [];
  }

  calculateNutrition() {
    Object.entries(this.cropsPlanted).forEach(([key, value]) => {
      const plant = PLANTS_BY_KEY[key];
      this.nutritionPerDay[key] =
        ((plant.harvestYield * NUTRITION_VALUE) / (plant.growDays / GROW_DAY_DIVISOR)) * value;
    });
    const sumNutrition = Object.values(this.nutritionPerDay).reduce((total, cur) => total + cur, 0);
    const requiredNutrition =
      (this.numPawns * NUTRITION_REQUIRED_PER_DAY * this.pctNutritionFromPlants) /
      (this.growingSeason / 60);
    if (sumNutrition < requiredNutrition) {
      this.warnings.push({
        text: `Growing ${roundToTwoDecimals(sumNutrition)}, need ${roundToTwoDecimals(
          requiredNutrition
        )}`,
      });
    }
  }
}

export default WarningsBuilder;
