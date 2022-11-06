/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from "react";
import { useFetcher } from "@remix-run/react";

import RWContext from "../context/RWContext";

import type { PawnParams, RimContextParams } from "../types/interfaces";
import PawnCard from "app/components/common/pawn-card";

const GroupMakerIndex = () => {
  const [groups, setGroups] = useState({
    home: [] as Array<PawnParams>,
    away: [] as Array<PawnParams>,
  });
  const fetcher = useFetcher();
  const {
    saveData: { colonists, slaves, prisoners, modList },
    config,
  }: RimContextParams = useContext(RWContext);

  useEffect(() => {
    fetcher.submit(
      {
        values: JSON.stringify({
          colonists,
          prisoners,
          slaves,
          config,
          modList,
        }),
      },
      { method: "post", action: "/groups/builder" }
    );
  }, [colonists, slaves, prisoners, config]);

  useEffect(() => {
    if (fetcher.type === "done") {
      setGroups(fetcher.data.groups);
    }
  }, [fetcher.type]);

  return (
    <>
      {groups.home.length || groups.away.length ? (
        <div>
          <div>
            <div>Home group</div>
            <div className="flex">
              {groups.home.map((pawn) => (
                <PawnCard pawn={pawn} key={pawn.id} />
              ))}
            </div>
          </div>
          <div>Away group</div>
          <div className="flex">
            {groups.away.map((pawn) => (
              <PawnCard pawn={pawn} key={pawn.id} />
            ))}
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default GroupMakerIndex;
