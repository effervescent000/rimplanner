import { useState, useEffect, useContext } from "react";

import { buildRosterHighlights } from "~/helpers/rosterHelpers";
import RWContext from "~/context/RWContext";

import PawnCard from "../common/pawn-card";

const PawnRow = () => {
  const {
    saveData: { colonists, slaves },
  } = useContext(RWContext);
  const [colonyStats, setColonyStats] = useState({});
  const [playerPawns, setPlayerPawns] = useState([]);

  useEffect(() => {
    playerPawns.length && setColonyStats(buildRosterHighlights(playerPawns));
  }, [playerPawns]);

  useEffect(() => {
    setPlayerPawns([...colonists, ...slaves]);
  }, [colonists, slaves]);

  return (
    <div className="flex">
      {playerPawns.length &&
        Object.keys(colonyStats).length &&
        playerPawns.map((pawn) => <PawnCard key={pawn.id} pawn={pawn} />)}
    </div>
  );
};

export default PawnRow;
