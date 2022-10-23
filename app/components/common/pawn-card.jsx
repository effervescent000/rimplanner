import PropTypes from "prop-types";
import { getName } from "~/helpers/utils";

import PawnImage from "./pawn-images/pawn-image";
import TilesWrapper from "./pawn-images/tiles-wrapper";

const PawnCard = ({ pawn, callback, selected, evalValues, config, hideImage }) => {
  const name = getName(pawn);
  return (
    <div className="w-[120px]" onClick={() => callback(pawn)}>
      <div>{name}</div>
      {!hideImage ? (
        <div className="relative">
          <PawnImage pawn={pawn} />
          {Object.keys(evalValues).length ? (
            <TilesWrapper id={pawn.id} evalValues={evalValues} config={config} />
          ) : (
            <></>
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

PawnCard.defaultProps = {
  callback: () => {},
  selected: false,
  evalValues: {},
  hideImage: false,
};

PawnCard.propTypes = {
  pawn: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
  callback: PropTypes.func,
  selected: PropTypes.bool,
  evalValues: PropTypes.shape({}),
  hideImage: PropTypes.bool,
};

export default PawnCard;
