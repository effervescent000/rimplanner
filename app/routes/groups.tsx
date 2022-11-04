/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useContext } from "react";
// import { useFetcher } from "@remix-run/react";

import RWContext from "app/context/RWContext";

import type { RimContextParams } from "app/types/interfaces";

const GroupMakerIndex = () => {
  // const fetcher = useFetcher();
  const {
    saveData: { colonists, slaves, prisoners },
    config,
  }: RimContextParams = useContext(RWContext);

  useEffect(() => {
    // don't do anything yet
  }, [colonists, slaves, prisoners, config]);

  return ( 
    <div>
      Nothing here yet, sorry!
    </div>
   );
}
 
export default GroupMakerIndex;