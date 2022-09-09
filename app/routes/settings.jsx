import { useState, useEffect } from "react";
import { useOutletContext } from "@remix-run/react";

import ControlledCheckbox from "~/components/common/controlledCheckbox";

const SettingsPage = () => {
  const { config, setConfig } = useOutletContext();
  return (
    <div>
      <ControlledCheckbox
        value={config.slaveryMode}
        callback={(x) => setConfig({ ...config, slaveryMode: x })}
        label="Slavery mode?"
      />
    </div>
  );
};

export default SettingsPage;
