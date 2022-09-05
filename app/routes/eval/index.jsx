import { useState, useEffect } from "react";
import { useOutletContext } from "@remix-run/react";

import ControlledTextInput from "~/components/common/controlled-text-input";
import PawnCard from "~/components/common/pawn-card";
import EvaluationBuilder from "~/helpers/evaluationBuilder";

const EvaluationIndex = () => {
  const {
    saveData: { worldPawns, mapPawns, playerPawns },
  } = useOutletContext();
  const [search, setSearch] = useState("");
  const [selectedPawns, setSelectedPawns] = useState([]);
  const [evalStats, setEvalStats] = useState({ values: {} });

  useEffect(() => {
    if (selectedPawns.length) {
      const eb = new EvaluationBuilder({ targets: selectedPawns, playerPawns });
      eb.compareStats();
      setEvalStats({ values: eb.values });
    }
  }, [selectedPawns, playerPawns]);

  return (
    <div className="flex">
      <div>
        <ControlledTextInput value={search} callback={setSearch} />
        <button onClick={() => setSelectedPawns(mapPawns)}>All on map</button>
        {[...worldPawns, ...mapPawns]
          .filter(({ name: { nick } }) => nick && nick.toLowerCase().includes(search.toLowerCase()))
          .map((pawn) => (
            <PawnCard
              key={pawn.id}
              pawn={pawn}
              callback={(pawn) => setSelectedPawns([pawn])}
              selected={pawn.id === selectedPawns.id}
            />
          ))}
      </div>
      <div className="flex">
        {selectedPawns.map((pawn) => (
          <PawnCard key={pawn.id} pawn={pawn} value={evalStats.values[pawn.id]} />
        ))}
      </div>
    </div>
  );
};

export default EvaluationIndex;
