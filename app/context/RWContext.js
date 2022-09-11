import { createContext } from "react";

const RWContext = createContext({
  saveData: {},
  setSaveData: () => {},
  config: {},
  setConfig: () => {},
});
export default RWContext;
