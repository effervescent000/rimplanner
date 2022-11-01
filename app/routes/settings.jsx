import { useState, useEffect, useCallback, useContext } from "react";
import { debounce } from "lodash";

// HELPERS
import { makeSettings } from "app/helpers/settingsHelpers";
import RWContext from "app/context/RWContext";

const SettingsPage = () => {
  const { config, setConfig } = useContext(RWContext);
  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState(
    Object.keys(config).reduce(
      (total, cur) => ({ ...total, [cur]: { value: config[cur], validators: [] } }),
      {}
    )
  );
  const rawUpdateConfig = (values) =>
    setConfig(
      Object.keys(values).reduce((total, cur) => ({ ...total, [cur]: values[cur].value }), {})
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateConfig = useCallback(debounce(rawUpdateConfig, 500), []);
  const settingsList = makeSettings();

  useEffect(() => {
    if (Object.keys(errors).length === 0) {
      updateConfig(formValues);
    }
  }, [formValues, errors, setConfig]);

  return (
    <div className="flex gap-5 items-center">
      {settingsList.map(({ key, Component, label, callback, validators }) => (
        <Component
          key={key}
          value={formValues[key].value}
          callback={
            callback || ((x) => setFormValues({ ...formValues, [key]: { value: x, validators } }))
          }
          label={label}
        />
      ))}
    </div>
  );
};

export default SettingsPage;
