import { useOutletContext } from "@remix-run/react";
import { useState, useEffect } from "react";

import SaveFileDropzone from "~/components/save-file-dropzone";
import PawnRow from "~/components/pawn-display/pawn-display";
import PrioritiesWrapper from "~/components/work-priorities/priorities-wrapper";
import { buildLaborsList, buildPrioritySuggestions } from "~/helpers/rosterHelpers";

export default function Index() {
  const {
    saveData: { playerPawns, modList },
  } = useOutletContext();
  const [priorities, setPriorities] = useState([]);
  let labors;
  let suggestedLabors;

  useEffect(() => {
    setPriorities(
      playerPawns.map(({ name, workSettings }) => ({
        name: name.nick,
        priorities: workSettings.priorities.vals.li,
      }))
    );
  }, [playerPawns]);

  if (modList.length) {
    labors = buildLaborsList(modList);
    suggestedLabors = buildPrioritySuggestions({ labors, playerPawns });
  }

  return (
    <div className="container mx-auto">
      <div className="relative">
        <SaveFileDropzone />
        <PawnRow />
        {modList.length && (
          <PrioritiesWrapper priorities={priorities} labels={labors} suggested={suggestedLabors} />
        )}
      </div>
    </div>
  );
}
