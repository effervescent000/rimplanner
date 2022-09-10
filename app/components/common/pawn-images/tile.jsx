import PropTypes from "prop-types";
import { Tooltip, Whisper } from "rsuite";

const Tile = ({ imgSrc, label, reasons }) => {
  return (
    <div className="flex flex-col items-center h-10">
      <img style={{ height: label ? "50%" : "100%" }} src={imgSrc} alt="tile" />
      {label ? (
        <Whisper
          placement="bottom"
          trigger="hover"
          speaker={
            <Tooltip>
              {reasons.map(({ reason, value }, idx) => (
                <div key={idx}>
                  {reason}: {value}
                </div>
              ))}
            </Tooltip>
          }
        >
          <span>{label}</span>
        </Whisper>
      ) : (
        ""
      )}
    </div>
  );
};

Tile.defaultProps = {
  label: undefined,
  reasons: [],
};

Tile.propTypes = {
  imgSrc: PropTypes.string.isRequired,
  label: PropTypes.string,
  reasons: PropTypes.arrayOf(PropTypes.shape({})),
};

export default Tile;
