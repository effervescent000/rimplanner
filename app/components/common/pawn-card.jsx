import PawnImage from "./pawn-image";

const PawnCard = ({ pawn, highlights }) => {
  const {
    name: { nick: name },
  } = pawn;
  return (
    <div>
      <div>{name}</div>
      <PawnImage pawn={pawn} />
      <div>
        {highlights &&
          highlights.map(
            (stat, idx) =>
              stat && (
                <div key={`${name}-${idx}`}>
                  {`${name} has a ${stat.skill} of ${stat.level}${
                    stat.passion ? ` with a ${stat.passion} passion` : ""
                  }!`}
                </div>
              )
          )}
      </div>
    </div>
  );
};

export default PawnCard;
