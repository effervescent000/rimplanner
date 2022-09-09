import PropTypes from "prop-types";

const ControlledCheckbox = ({ value, callback, label }) => {
  return (
    <div>
      <label>
        <input
          data-cy="slaveryModeInput"
          type="checkbox"
          checked={value}
          onChange={() => callback(!value)}
        />
        {label}
      </label>
    </div>
  );
};

ControlledCheckbox.defaultProps = {
  label: "",
};

ControlledCheckbox.propTypes = {
  value: PropTypes.bool.isRequired,
  callback: PropTypes.func.isRequired,
  label: PropTypes.string,
};

export default ControlledCheckbox;
