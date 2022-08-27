import { useState, useEffect } from "react";
import { useOutletContext } from "@remix-run/react";
import { buildRosterHighlights } from "~/helpers/rosterHelpers";
import PawnCard from "./pawn-card";

const PawnRow = () => {
  const [colonyStats, setColonyStats] = useState({});
  const {
    saveData: { playerPawns },
  } = useOutletContext();

  useEffect(() => {
    playerPawns.length && setColonyStats(buildRosterHighlights(playerPawns));
  }, [playerPawns]);

  return (
    <div>
      {playerPawns.map((pawn) => (
        <PawnCard key={pawn.id} pawn={pawn} stats={colonyStats[pawn.name.nick]} />
      ))}
    </div>
  );
};

export default PawnRow;
