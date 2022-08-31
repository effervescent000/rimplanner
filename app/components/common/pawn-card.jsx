const PawnCard = ({
  pawn: {
    name: { nick: name },
  },
  stats: { highlights },
}) => {
  return (
    <div>
      <div>{name}</div>
      <div>
        {highlights.map(
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
