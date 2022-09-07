import PropTypes from "prop-types";

const BAR_HEIGHT = 100;
const BAR_WIDTH = 20;

const FillBar = ({ target, currentValue }) => {
  const max = Math.max(target, currentValue) * 1.25;
  const fillLevel = Math.round((currentValue / max) * BAR_HEIGHT);
  const targetLine = Math.round((target / max) * BAR_HEIGHT);

  return (
    <div
      className={`relative bg-black`}
      style={{ height: `${BAR_HEIGHT}px`, width: `${BAR_WIDTH}px` }}
    >
      <div
        className={`absolute bg-white bottom-0 z-10`}
        style={{ height: `${fillLevel}px`, width: `${BAR_WIDTH}px` }}
      />
      <div
        className={`absolute bg-red-700 h-0.5 w-[${BAR_WIDTH}px] z-20`}
        style={{ width: `${BAR_WIDTH}px`, bottom: `${targetLine}px` }}
      />
    </div>
  );
};

FillBar.propTypes = {
  target: PropTypes.number.isRequired,
  currentValue: PropTypes.number.isRequired,
};

export default FillBar;
