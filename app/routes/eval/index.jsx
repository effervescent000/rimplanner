import { useState } from "react";
import { useOutletContext } from "@remix-run/react";

import ControlledTextInput from "~/components/common/controlled-text-input";
import PawnCard from "~/components/common/pawn-card";

const EvaluationIndex = () => {
  const {
    saveData: { worldPawns },
  } = useOutletContext();
  const [search, setSearch] = useState("");
  const [selectedPawn, setSelectedPawn] = useState({});

  return (
    <div>
      <div>
        <ControlledTextInput value={search} callback={setSearch} />
        {worldPawns
          .filter(({ name: { nick } }) => nick && nick.toLowerCase().includes(search.toLowerCase()))
          .map((pawn) => (
            <PawnCard
              key={pawn.id}
              pawn={pawn}
              callback={setSelectedPawn}
              selected={pawn.id === selectedPawn.id}
            />
          ))}
      </div>
      <div>
        <PawnCard pawn={selectedPawn} />
      </div>
    </div>
  );
};

export default EvaluationIndex;
