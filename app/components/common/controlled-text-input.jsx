import PropTypes from "prop-types";

const ControlledTextInput = ({ value, callback, placeholder, label }) => {
  return (
    <label>
      <input
        className="m-2"
        value={value}
        placeholder={placeholder}
        onChange={(event) => callback(event.target.value)}
      />
      {label}
    </label>
  );
};

ControlledTextInput.defaultProps = {
  placeholder: undefined,
  label: "",
};

ControlledTextInput.propTypes = {
  value: PropTypes.string.isRequired,
  callback: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  label: PropTypes.string,
};

export default ControlledTextInput;
