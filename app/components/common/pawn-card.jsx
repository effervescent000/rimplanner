import PropTypes from "prop-types";

import PawnImage from "./pawn-images/pawn-image";

const PawnCard = ({
  pawn,
  callback,
  selected,
  eval: { colonistValue, slaveValue, bleedingOut },
}) => {
  const {
    name: { nick: name },
  } = pawn;
  return (
    <div className="max-w-[150px]" onClick={() => callback(pawn)}>
      <div>{name}</div>
      <PawnImage pawn={pawn} bleedingOut={bleedingOut} />
      {colonistValue ? <div>{colonistValue} points</div> : ""}
      {slaveValue > colonistValue ? (
        <div>{name} might be more useful as a slave than a colonist</div>
      ) : (
        ""
      )}
    </div>
  );
};

PawnCard.defaultProps = {
  callback: () => {},
  selected: false,
  eval: { colonistValue: 0, slaveValue: 0, bleedingOut: false },
};

PawnCard.propTypes = {
  pawn: PropTypes.shape({ name: PropTypes.shape({ nick: PropTypes.string.isRequired }) })
    .isRequired,
  callback: PropTypes.func,
  selected: PropTypes.bool,
  eval: PropTypes.shape({
    colonistValue: PropTypes.number,
    slaveValue: PropTypes.number,
    bleedingOut: PropTypes.bool,
  }),
};

export default PawnCard;
