import { useOutletContext } from "@remix-run/react";
import { useState, useEffect } from "react";

import { buildLaborsList } from "~/helpers/rosterHelpers";

import PrioritiesWrapper from "~/components/work-priorities/priorities-wrapper";
import PriorityBuilder from "~/helpers/priorityBuilder";

const WorkPriorityIndex = () => {
  const {
    saveData: { colonists, slaves, modList },
  } = useOutletContext();
  const [priorities, setPriorities] = useState([]);
  let labors;

  let priorityBuilder;

  useEffect(() => {
    setPriorities(
      [...colonists, ...slaves].map(({ name, workSettings }) => ({
        name: name.nick,
        priorities: workSettings.priorities.vals.li,
      }))
    );
  }, [colonists, slaves]);

  if (modList.length && priorities.length) {
    labors = buildLaborsList(modList);

    priorityBuilder = new PriorityBuilder({
      pawns: [...colonists, ...slaves],
      modList,
      rawPriorities: priorities,
    });
    priorityBuilder.buildSuggestions();
  }
  return (
    <div>
      {modList.length && priorities.length && (
        <PrioritiesWrapper priorities={priorityBuilder.getOrderedPriorities()} labels={labors} />
      )}
    </div>
  );
};

export default WorkPriorityIndex;
