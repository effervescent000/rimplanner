import { useOutletContext } from "@remix-run/react";
import { useState, useEffect } from "react";

import { buildLaborsList } from "~/helpers/rosterHelpers";

import SaveFileDropzone from "~/components/save-file-dropzone";
import PawnRow from "~/components/pawn-display/pawn-display";
import PrioritiesWrapper from "~/components/work-priorities/priorities-wrapper";
import PriorityBuilder from "~/helpers/priorityBuilder";

export default function Index() {
  const {
    saveData: { playerPawns, modList },
  } = useOutletContext();
  const [priorities, setPriorities] = useState([]);
  let labors;

  let priorityBuilder;

  useEffect(() => {
    setPriorities(
      playerPawns.map(({ name, workSettings }) => ({
        name: name.nick,
        priorities: workSettings.priorities.vals.li,
      }))
    );
  }, [playerPawns]);

  if (modList.length && priorities.length) {
    labors = buildLaborsList(modList);

    priorityBuilder = new PriorityBuilder({
      pawns: playerPawns,
      modList,
      rawPriorities: priorities,
    });
    priorityBuilder.buildLaborsArray();
    priorityBuilder.buildSuggestions();
  }

  return (
    <div className="container mx-auto">
      <div className="relative">
        <SaveFileDropzone />
        <PawnRow />
        {modList.length && priorities.length && (
          <PrioritiesWrapper priorities={priorityBuilder.getOrderedPriorities()} labels={labors} />
        )}
      </div>
    </div>
  );
}
