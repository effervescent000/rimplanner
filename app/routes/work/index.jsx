import { useState, useEffect, useContext } from "react";

import { buildLaborsList } from "~/helpers/rosterHelpers";
import RWContext from "~/context/RWContext";

import PrioritiesWrapper from "~/components/work-priorities/priorities-wrapper";
import PriorityBuilder from "~/helpers/priorityBuilder";

const WorkPriorityIndex = () => {
  const {
    saveData: { colonists, slaves, modList },
  } = useContext(RWContext);
  const [finalPrios, setFinalPrios] = useState({});

  useEffect(() => {
    const priorities = [...colonists, ...slaves].map(({ name, workSettings }) => ({
      name: name.nick,
      priorities: workSettings.priorities.vals.li,
    }));
    if (modList.length && priorities.length) {
      const priorityBuilder = new PriorityBuilder({
        pawns: [...colonists, ...slaves],
        modList,
        rawPriorities: priorities,
      });
      priorityBuilder.buildSuggestions();
      setFinalPrios(priorityBuilder.getOrderedPriorities());
    }
  }, [colonists, slaves, modList]);

  return (
    <div>
      {modList.length && Object.keys(finalPrios).length && (
        <PrioritiesWrapper priorities={finalPrios} labels={buildLaborsList(modList)} />
      )}
    </div>
  );
};

export default WorkPriorityIndex;
