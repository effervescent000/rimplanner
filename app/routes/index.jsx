import { useOutletContext } from "@remix-run/react";
import { useState, useEffect } from "react";

import SaveFileDropzone from "~/components/save-file-dropzone";
import PawnRow from "~/components/pawn-display/pawn-display";
import PrioritiesWrapper from "~/components/work-priorities/priorities-wrapper";

export default function Index() {
  const {
    saveData: { playerPawns },
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
        <PrioritiesWrapper priorities={priorities} />
      </div>
    </div>
  );
}
