import { getName } from "app/helpers/utils";

import PawnImage from "./pawn-images/pawn-image";
import TilesWrapper from "./pawn-images/tiles-wrapper";
import type { ConfigParams, PawnParams } from "app/types/interfaces";

const PawnCard = ({
  pawn,
  callback,
  selected,
  evalValues = {},
  config,
  hideImage,
}: {
  pawn: PawnParams;
  callback: (arg1: PawnParams) => void;
  selected?: boolean;
  evalValues?: {};
  config?: ConfigParams;
  hideImage?: boolean;
}) => {
  const name = getName(pawn);
  return (
    <div className="w-[120px]" onClick={() => callback(pawn)}>
      <div>{name}</div>
      {!hideImage ? (
        <div className="relative">
          <PawnImage pawn={pawn} />
          {Object.keys(evalValues).length ? (
            <TilesWrapper id={pawn.id} evalValues={evalValues} config={config} />
          ) : (
            <></>
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

PawnCard.defaultProps = {
  selected: false,
  evalValues: {},
  callback: () => {},
  config: { slaveryMode: false },
  hideImage: false,
};

export default PawnCard;
