import PropTypes from "prop-types";

import Tile from "./tile";

import bloodImg from "assets/Bleeding.png";
import townImg from "assets/Town.png";
import slaveImg from "assets/Slavery.png";

const IMAGE_MAP = {
  bleedingOut: bloodImg,
  colonist: townImg,
  slave: slaveImg,
};

const makeTiles = (evalValues, { slaveryMode }) => {
  const tiles = [];
  Object.entries(evalValues).forEach(([key, value]) => {
    if (value.value !== undefined && (key !== "slave" || slaveryMode)) {
      tiles.push({
        imgSrc: IMAGE_MAP[key],
        label: value.value === true ? undefined : `${value.value}`,
        reasons: value.reasons,
      });
    }
  });
  return tiles;
};

const TilesWrapper = ({ id, evalValues, config }) => {
  const tiles = makeTiles(evalValues, config);
  return (
    <div className="w-[120px] flex absolute justify-between bottom-[-5px]">
      {tiles.map((tile, idx) => (
        <Tile key={`${id}-${idx}`} {...tile} />
      ))}
    </div>
  );
};

TilesWrapper.propTypes = {
  id: PropTypes.string.isRequired,
  evalValues: PropTypes.shape({}).isRequired,
  config: PropTypes.shape({}).isRequired,
};

export default TilesWrapper;
