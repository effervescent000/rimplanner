import PropTypes from "prop-types";

const ControlledCheckbox = ({ value, callback, label }) => {
  return (
    <div>
      <input type="checkbox" checked={value} onChange={() => callback(!value)} />
      <span>{label}</span>
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
