import ControlledCheckbox from "app/components/common/controlledCheckbox";
import ControlledTextInput from "app/components/common/controlled-text-input";

export const makeSettings = () => [
  { key: "slaveryMode", Component: ControlledCheckbox, label: "Slavery mode?" },
  {
    key: "growingSeason",
    Component: ControlledTextInput,
    label: "Length of growing season in days",
  },
  {
    key: "pctNutritionFromGrowing",
    Component: ControlledTextInput,
    label: "% of food from growing",
  },
  {
    key: "cookingManHoursPerPawn",
    Component: ControlledTextInput,
    label: "# of hours of cooking per pawn in colony",
  },
  {
    key: "huntingManHoursPerPawn",
    Component: ControlledTextInput,
    label: "# of hours of hunting per pawn in colony",
  },
];
