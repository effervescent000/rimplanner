import { FILL_BAR, NUTRITION_VALUE } from "../constants/constants";
import { PLANTS, FOOD_PLANTS_ARRAY, GROW_DAY_DIVISOR } from "../constants/plantsConstants";
import { getNutritionRequired, roundToTwoDecimals } from "./utils";

class WarningsBuilder {
  constructor({
    saveData: { growingZones, colonists, slaves, prisoners },
    config: { pctNutritionFromGrowing, growingSeason },
  }) {
    this.growingZones = growingZones.filter(({ allowSow }) => allowSow !== "False");
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
    this.pctNutritionFromGrowing = pctNutritionFromGrowing;
    this.growingSeason = growingSeason;
    this.numPawns = [...colonists, ...slaves, ...prisoners].length;
    this.baseNutritionRequired = () => {
      const nutritionPerColonist = [...colonists, ...slaves, ...prisoners].map((pawn) =>
        getNutritionRequired(pawn)
      );
      return nutritionPerColonist.reduce((x, y) => x + y, 0);
    };
    this.warnings = [];
  }

  calculateNutrition() {
    Object.entries(this.cropsPlanted).forEach(([key, value]) => {
      const plant = PLANTS[key];
      this.nutritionPerDay[key] =
        ((plant.harvestYield * NUTRITION_VALUE) / (plant.growDays / GROW_DAY_DIVISOR)) * value;
    });
    const sumNutrition = Object.values(this.nutritionPerDay).reduce((total, cur) => total + cur, 0);
    const requiredNutrition =
      (this.baseNutritionRequired() * this.pctNutritionFromGrowing) / (this.growingSeason / 60);
    this.warnings.push({
      text: `Growing ${roundToTwoDecimals(
        sumNutrition
      )} points of nutrition, need ${roundToTwoDecimals(requiredNutrition)}.`,
      type: FILL_BAR,
      props: {
        target: requiredNutrition,
        currentValue: sumNutrition,
      },
    });
  }
}

export default WarningsBuilder;
