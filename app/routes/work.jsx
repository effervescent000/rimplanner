/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from "react";
import { useFetcher } from "@remix-run/react";

import PrioritiesWrapper from "app/components/work-priorities/priorities-wrapper";

import RWContext from "app/context/RWContext";

import { buildLaborsList } from "app/helpers/rosterHelpers";
import { buildLabors, getCurrentPriorities } from "app/helpers/utils";

const WorkPriorityIndex = () => {
  const fetcher = useFetcher();
  const {
    saveData: { colonists, slaves, modList, homeZoneSize, growingZones },
    config,
  } = useContext(RWContext);
  const [finalPrios, setFinalPrios] = useState({});

  useEffect(() => {
    const [laborLabels] = buildLabors(modList);
    const currentPriorities = getCurrentPriorities([...colonists, ...slaves], laborLabels);
    if (modList.length && currentPriorities.length) {
      fetcher.submit(
        {
          values: JSON.stringify({
            colonists,
            slaves,
            modList,
            config,
            currentPriorities,
            homeZoneSize,
            growingZones,
          }),
        },
        { method: "post", action: "/work/builder" }
      );
    }
  }, [colonists, slaves, modList, config]);

  useEffect(() => {
    if (fetcher.type === "done") {
      setFinalPrios(fetcher.data.suggestions);
    }
  }, [fetcher.type]);

  return (
    <div>
      {modList.length && Object.keys(finalPrios).length && (
        <PrioritiesWrapper priorities={finalPrios} labels={buildLaborsList(modList)} />
      )}
    </div>
  );
};

export default WorkPriorityIndex;
