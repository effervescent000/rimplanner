import { useOutletContext } from "@remix-run/react";
import PawnCard from "./pawn-card";

const PawnRow = () => {
  const {
    saveData: { playerPawns },
  } = useOutletContext();

  return (
    <div>
      {playerPawns.map((pawn) => (
        <PawnCard key={pawn.id} pawn={pawn} />
      ))}
    </div>
  );
};

export default PawnRow;
