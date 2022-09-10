import { useState, useEffect } from "react";
import { useOutletContext } from "@remix-run/react";

// HELPERS
import { makeSettings } from "~/helpers/settingsHelpers";

const SettingsPage = () => {
  const { config, setConfig } = useOutletContext();
  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState({ ...config });
  const settingsList = makeSettings();

  useEffect(() => {
    if (errors.length === 0) {
      setConfig(
        Object.entries(formValues)
          .map(([key, value]) => ({ [key]: value.value }))
          .reduce((total, cur) => ({ ...total, cur }))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues, errors]);

  return (
    <div>
      {settingsList.map(({ key, Component, label, callback, validators }) => (
        <Component
          key={key}
          value={formValues[key]}
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
