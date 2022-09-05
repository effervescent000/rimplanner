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
  const [selectedPawns, setSelectedPawns] = useState([]);
  const [evalStats, setEvalStats] = useState({});

  useEffect(() => {
    if (selectedPawns.length) {
      const eb = new EvaluationBuilder({ target: selectedPawns, playerPawns });
      eb.compareStats();
      setEvalStats({ value: eb.value });
    }
  }, [selectedPawns, playerPawns]);

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
              callback={setSelectedPawns}
              selected={pawn.id === selectedPawns.id}
            />
          ))}
      </div>
      <div>{selectedPawns.id ? <PawnCard pawn={selectedPawns} {...evalStats} /> : ""}</div>
    </div>
  );
};

export default EvaluationIndex;
