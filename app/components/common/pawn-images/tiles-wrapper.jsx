import PropTypes from "prop-types";
import { BASE_ASSET_URL } from "app/constants/constants";

import Tile from "./tile";

const IMAGE_MAP = {
  bleedingOut: BASE_ASSET_URL + "/Bleeding.png",
  colonist: BASE_ASSET_URL + "/Town.png",
  slave: BASE_ASSET_URL + "/Slavery.png",
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
    } else if (key === "bleedingOut") {
      tiles.push({
        imgSrc: IMAGE_MAP[key],
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

TilesWrapper.defaultProps = {
  config: { slaveryMode: false },
};

TilesWrapper.propTypes = {
  id: PropTypes.string.isRequired,
  evalValues: PropTypes.shape({}).isRequired,
  config: PropTypes.shape({}),
};

export default TilesWrapper;
