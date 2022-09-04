import PropTypes from "prop-types";

import PawnImage from "./pawn-image";

const PawnCard = ({ pawn, highlights, callback, selected }) => {
  const {
    name: { nick: name },
  } = pawn;
  return (
    <div onClick={() => callback(pawn)}>
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

PawnCard.defaultProps = {
  highlights: [],
  callback: () => {},
  selected: false,
};

PawnCard.propTypes = {
  pawn: PropTypes.shape({ name: PropTypes.shape({ nick: PropTypes.string.isRequired }) })
    .isRequired,
  highlights: PropTypes.arrayOf(PropTypes.shape({})),
  callback: PropTypes.func,
  selected: PropTypes.bool,
};

export default PawnCard;
