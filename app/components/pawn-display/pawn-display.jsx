import { useState, useEffect } from "react";

import { buildRosterHighlights } from "~/helpers/rosterHelpers";

import PawnCard from "../common/pawn-card";

const PawnRow = ({ playerPawns }) => {
  const [colonyStats, setColonyStats] = useState({});

  useEffect(() => {
    playerPawns.length && setColonyStats(buildRosterHighlights(playerPawns));
  }, [playerPawns]);

  return (
    <div className="flex">
      {playerPawns.length &&
        Object.keys(colonyStats).length &&
        playerPawns.map((pawn) => (
          <PawnCard key={pawn.id} pawn={pawn} highlights={colonyStats[pawn.name.nick].highlights} />
        ))}
    </div>
  );
};

export default PawnRow;
