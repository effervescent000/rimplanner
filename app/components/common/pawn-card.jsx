import PropTypes from "prop-types";

import PawnImage from "./pawn-image";

const PawnCard = ({ pawn, callback, selected, eval: { colonistValue, bleedingOut } }) => {
  const {
    name: { nick: name },
  } = pawn;
  return (
    <div onClick={() => callback(pawn)}>
      <div>{name}</div>
      <PawnImage pawn={pawn} bleedingOut={bleedingOut} />
      {colonistValue ? <div>{colonistValue} points</div> : ""}
    </div>
  );
};

PawnCard.defaultProps = {
  callback: () => {},
  selected: false,
  eval: { colonistValue: 0, bleedingOut: false },
};

PawnCard.propTypes = {
  pawn: PropTypes.shape({ name: PropTypes.shape({ nick: PropTypes.string.isRequired }) })
    .isRequired,
  callback: PropTypes.func,
  selected: PropTypes.bool,
  eval: PropTypes.shape({ colonistValue: PropTypes.number, bleedingOut: PropTypes.bool }),
};

export default PawnCard;
