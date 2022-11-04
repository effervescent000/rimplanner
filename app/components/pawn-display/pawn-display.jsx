import { useState, useEffect, useContext } from "react";

import RWContext from "app/context/RWContext";

import PawnCard from "../common/pawn-card";

const PawnRow = () => {
  const {
    saveData: { colonists, slaves },
  } = useContext(RWContext);

  const [playerPawns, setPlayerPawns] = useState([]);

  useEffect(() => {
    setPlayerPawns([...colonists, ...slaves]);
  }, [colonists, slaves]);

  return (
    <div className="flex">
      {playerPawns.length && playerPawns.map((pawn) => <PawnCard key={pawn.id} pawn={pawn} />)}
    </div>
  );
};

export default PawnRow;
