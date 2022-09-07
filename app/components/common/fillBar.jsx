import PropTypes from "prop-types";

const BAR_HEIGHT = 115;
const BAR_WIDTH = 20;

const FillBar = ({ target, currentValue }) => {
  const max = Math.max(target, currentValue) * 1.25;
  const fillLevel = Math.round((currentValue / max) * BAR_HEIGHT);
  const targetLine = Math.round((target / max) * BAR_HEIGHT);

  return (
    <div
      className={`relative bg-green-900 p-0.5 rounded-sm`}
      style={{ height: `${BAR_HEIGHT + 4}px`, width: `${BAR_WIDTH + 4}px` }}
    >
      <div
        className={`absolute bg-green-300 bottom-[2px] z-10 rounded-sm`}
        style={{ height: `${fillLevel}px`, width: `${BAR_WIDTH}px` }}
      />
      <div
        className={`absolute bg-yellow-500 h-1 z-20 rounded-sm`}
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
