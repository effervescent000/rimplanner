import PropTypes from "prop-types";
import { FILL_BAR } from "~/constants/constants";

import FillBar from "../common/fillBar";
import Warning from "./warning";

const componentMapping = {
  [FILL_BAR]: FillBar,
};

const WarningsWrapper = ({ warnings }) => {
  return (
    <>
      {warnings.map((warning, idx) => {
        if (!warning.type) {
          return <Warning warning={warning} key={idx} />;
        }
        const Component = componentMapping[warning.type];
        return <Component key={idx} {...warning.props} />;
      })}
    </>
  );
};

WarningsWrapper.propTypes = {
  warnings: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default WarningsWrapper;
