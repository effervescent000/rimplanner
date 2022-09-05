import PropTypes from "prop-types";

import PawnImage from "./pawn-image";

const PawnCard = ({ pawn, callback, selected, value }) => {
  const {
    name: { nick: name },
  } = pawn;
  return (
    <div onClick={() => callback(pawn)}>
      <div>{name}</div>
      <PawnImage pawn={pawn} />
      {value ? <div>{value} points</div> : ""}
    </div>
  );
};

PawnCard.defaultProps = {
  callback: () => {},
  selected: false,
  value: 0,
};

PawnCard.propTypes = {
  pawn: PropTypes.shape({ name: PropTypes.shape({ nick: PropTypes.string.isRequired }) })
    .isRequired,
  callback: PropTypes.func,
  selected: PropTypes.bool,
  value: PropTypes.number,
};

export default PawnCard;
