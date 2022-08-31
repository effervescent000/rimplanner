import { useState } from "react";
import { useOutletContext } from "@remix-run/react";
import ControlledTextInput from "../common/controlled-text-input";

const Evaluation = () => {
  const {
    saveData: { worldPawns },
  } = useOutletContext();
  const [search, setSearch] = useState("");

  return (
    <div>
      <ControlledTextInput value={search} callback={setSearch} />
    </div>
  );
};

export default Evaluation;
