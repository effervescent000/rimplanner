import { useState } from "react";
import { useOutletContext } from "@remix-run/react";
import ControlledTextInput from "../common/controlled-text-input";

const Evaluation = () => {
  const {
    saveData: { worldPawns },
  } = useOutletContext();
  const [search, setSearch] = useState("");

  return <ControlledTextInput value={search} callback={setSearch} />;
};

export default Evaluation;
