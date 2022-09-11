import { useState, useEffect, useContext } from "react";
import { useFetcher } from "@remix-run/react";

import RWContext from "~/context/RWContext";

import ControlledTextInput from "~/components/common/controlled-text-input";
import PawnCard from "~/components/common/pawn-card";

const EvaluationIndex = () => {
  const {
    saveData: { worldPawns, mapPawns, colonists, slaves, modList },
    config,
  } = useContext(RWContext);
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
            config,
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
        <div className="flex">
          <ControlledTextInput value={search} callback={setSearch} />
          <div className="flex flex-col">
            <button
              className="border-slate-400 border-2 bg-slate-200 rounded-sm p-1"
              onClick={() => setSelectedPawns(mapPawns)}
            >
              All on map
            </button>
            <button
              className="border-slate-400 border-2 bg-slate-200 rounded-sm p-1"
              onClick={() =>
                setSelectedPawns(
                  mapPawns.filter(({ healthTracker: { healthState: state } }) => state === "Down")
                )
              }
            >
              All downed on map
            </button>
          </div>
        </div>
        {[...worldPawns, ...mapPawns]
          .filter(({ name: { nick } }) => nick && nick.toLowerCase().includes(search.toLowerCase()))
          .map((pawn) => (
            <PawnCard
              key={pawn.id}
              pawn={pawn}
              callback={(pawn) => setSelectedPawns([pawn])}
              selected={pawn.id === selectedPawns.id}
              hideImage
            />
          ))}
      </div>
      <div className="flex gap-2">
        {evalStats.ready &&
          selectedPawns.map((pawn) => (
            <PawnCard
              key={pawn.id}
              pawn={pawn}
              evalValues={evalStats.values[pawn.id]}
              config={config}
            />
          ))}
      </div>
    </div>
  );
};

export default EvaluationIndex;
