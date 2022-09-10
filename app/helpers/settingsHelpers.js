import ControlledCheckbox from "~/components/common/controlledCheckbox";
import ControlledTextInput from "~/components/common/controlled-text-input";

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
];
