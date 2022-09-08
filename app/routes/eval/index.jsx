import { useState, useEffect } from "react";
import { useFetcher, useOutletContext } from "@remix-run/react";

import ControlledTextInput from "~/components/common/controlled-text-input";
import PawnCard from "~/components/common/pawn-card";

const EvaluationIndex = () => {
  const {
    saveData: { worldPawns, mapPawns, colonists, slaves, modList },
  } = useOutletContext();
  const [search, setSearch] = useState("");
  const [selectedPawns, setSelectedPawns] = useState([]);
  const [evalStats, setEvalStats] = useState({ values: {}, ready: false });
  const fetcher = useFetcher();

  useEffect(() => {
    if (selectedPawns.length) {
      fetcher.submit(
        {
          values: JSON.stringify({
            selectedPawns,
            playerPawns: [...colonists, ...slaves],
            modList,
          }),
        },
        { method: "post", action: "/eval/builder" }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPawns, colonists, slaves, modList]);

  useEffect(() => {
    if (fetcher.type === "done") {
      setEvalStats({ ...fetcher.data, ready: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.type]);

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
        {evalStats.ready &&
          selectedPawns.map((pawn) => (
            <PawnCard key={pawn.id} pawn={pawn} eval={evalStats.values[pawn.id]} />
          ))}
      </div>
    </div>
  );
};

export default EvaluationIndex;
