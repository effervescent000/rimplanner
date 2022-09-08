import PropTypes from "prop-types";

const Tile = ({ imgSrc, label }) => {
  return (
    <div className="flex flex-col items-center h-10">
      <img style={{ height: label ? "50%" : "100%" }} src={imgSrc} alt="tile" />
      {label ? <span>{label}</span> : ""}
    </div>
  );
};

Tile.defaultProps = {
  label: undefined,
};

Tile.propTypes = {
  imgSrc: PropTypes.string.isRequired,
  label: PropTypes.string,
};

export default Tile;
