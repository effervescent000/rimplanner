import { useState, useEffect } from "react";
import { useOutletContext } from "@remix-run/react";

import ControlledTextInput from "~/components/common/controlled-text-input";
import PawnCard from "~/components/common/pawn-card";
import EvaluationBuilder from "~/helpers/evaluationBuilder";

const EvaluationIndex = () => {
  const {
    saveData: { worldPawns, playerPawns },
  } = useOutletContext();
  const [search, setSearch] = useState("");
  const [selectedPawn, setSelectedPawn] = useState({});
  const [evalStats, setEvalStats] = useState({});

  useEffect(() => {
    if (selectedPawn.id) {
      const eb = new EvaluationBuilder({ target: selectedPawn, playerPawns });
      eb.compareStats();
      setEvalStats({ value: eb.value });
    }
  }, [selectedPawn, playerPawns]);

  return (
    <div className="flex">
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
      <div>{selectedPawn.id ? <PawnCard pawn={selectedPawn} {...evalStats} /> : ""}</div>
    </div>
  );
};

export default EvaluationIndex;
