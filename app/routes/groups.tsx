/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useContext } from "react";
import { useFetcher } from "@remix-run/react";

import RWContext from "../context/RWContext";

import type { RimContextParams } from "../types/interfaces";

const GroupMakerIndex = () => {
  const fetcher = useFetcher();
  const {
    saveData: { colonists, slaves, prisoners, modList },
    config,
  }: RimContextParams = useContext(RWContext);

  useEffect(() => {
    fetcher.submit({
      values: JSON.stringify({
        colonists, prisoners, slaves, config, modList
      })
    }, {method: "post", action: "/groups/builder"})
  }, [colonists, slaves, prisoners, config]);

  return ( 
    <div>
      Nothing here yet, sorry!
    </div>
   );
}
 
export default GroupMakerIndex;