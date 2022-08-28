import { useOutletContext } from "@remix-run/react";
import { useState, useEffect } from "react";

import SaveFileDropzone from "~/components/save-file-dropzone";
import PawnRow from "~/components/pawn-display/pawn-display";
import PrioritiesWrapper from "~/components/work-priorities/priorities-wrapper";
import { buildWorkPriorityLabels } from "~/helpers/rosterHelpers";

export default function Index() {
  const {
    saveData: { playerPawns, modList },
  } = useOutletContext();
  const [priorities, setPriorities] = useState([]);

  useEffect(() => {
    setPriorities(
      playerPawns.map(({ name, workSettings }) => ({
        name: name.nick,
        priorities: workSettings.priorities.vals.li,
      }))
    );
  }, [playerPawns]);

  return (
    <div className="container mx-auto">
      <div className="relative">
        <SaveFileDropzone />
        <PawnRow />
        {modList.length && (
          <PrioritiesWrapper priorities={priorities} labels={buildWorkPriorityLabels(modList)} />
        )}
      </div>
    </div>
  );
}
