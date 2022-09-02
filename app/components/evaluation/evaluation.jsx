import { useState } from "react";
import { useOutletContext } from "@remix-run/react";
import ControlledTextInput from "../common/controlled-text-input";
import PawnCard from "../common/pawn-card";

const Evaluation = () => {
  const {
    saveData: { worldPawns },
  } = useOutletContext();
  const [search, setSearch] = useState("");

  return (
    <div>
      <ControlledTextInput value={search} callback={setSearch} />
      {worldPawns
        .filter(({ name: { nick } }) => nick && nick.toLowerCase().includes(search.toLowerCase()))
        .map((pawn) => (
          <PawnCard key={pawn.id} pawn={pawn} />
        ))}
    </div>
  );
};

export default Evaluation;
