import PropTypes from "prop-types";

import PawnImage from "./pawn-images/pawn-image";
import TilesWrapper from "./pawn-images/tiles-wrapper";

const PawnCard = ({ pawn, callback, selected, evalValues }) => {
  const {
    name: { nick: name },
  } = pawn;
  return (
    <div className="w-[120px]" onClick={() => callback(pawn)}>
      <div>{name}</div>
      <div className="relative">
        <PawnImage pawn={pawn} />
        <TilesWrapper id={pawn.id} evalValues={evalValues} />
      </div>
    </div>
  );
};

PawnCard.defaultProps = {
  callback: () => {},
  selected: false,
  evalValues: {},
};

PawnCard.propTypes = {
  pawn: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.shape({ nick: PropTypes.string.isRequired }),
  }).isRequired,
  callback: PropTypes.func,
  selected: PropTypes.bool,
  evalValues: PropTypes.shape({}),
};

export default PawnCard;
