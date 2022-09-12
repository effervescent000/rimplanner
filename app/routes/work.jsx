/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from "react";
import { useFetcher } from "@remix-run/react";

import { buildLaborsList } from "~/helpers/rosterHelpers";
import RWContext from "~/context/RWContext";

import PrioritiesWrapper from "~/components/work-priorities/priorities-wrapper";

const WorkPriorityIndex = () => {
  const fetcher = useFetcher();
  const {
    saveData: { colonists, slaves, modList, homeZoneSize, growingZones },
    config,
  } = useContext(RWContext);
  const [finalPrios, setFinalPrios] = useState({});

  useEffect(() => {
    const currentPriorities = [...colonists, ...slaves].map(({ name, workSettings }) => ({
      name: name.nick,
      priorities: workSettings.priorities.vals.li,
    }));
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
