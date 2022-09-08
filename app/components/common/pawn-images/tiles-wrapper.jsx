import Tile from "./tile";

import bloodImg from "assets/Bleeding.png";
import townImg from "assets/Town.png";
import slaveImg from "assets/Slavery.png";

const IMAGE_MAP = {
  bleedingOut: bloodImg,
  colonistValue: townImg,
  slaveValue: slaveImg,
};

const makeTiles = (evalValues) => {
  const tiles = [];
  Object.entries(evalValues).forEach(([key, value]) => {
    if (value) {
      tiles.push({ imgSrc: IMAGE_MAP[key], label: value === true ? undefined : value });
    }
  });
  return tiles;
};

const TilesWrapper = ({ id, evalValues }) => {
  const tiles = makeTiles(evalValues);
  return (
    <div className="w-[120px] flex absolute justify-between bottom-[-5px]">
      {tiles.map((tile, idx) => (
        <Tile key={`${id}-${idx}`} {...tile} />
      ))}
    </div>
  );
};

export default TilesWrapper;
