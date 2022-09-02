import { useFetcher } from "@remix-run/react";
import { useState, useEffect } from "react";

const encodeSearchParams = (params) => {
  const searchTerms = Object.entries(params)
    .filter(([key, value]) => value)
    .map(([key, value]) => `${key}=${value}`);
  return searchTerms.join("&");
};

const PawnImage = ({
  pawn: {
    story: { bodyType, headGraphicPath, hairDef, hairColor, melanin },
    gender,
  },
}) => {
  const [imageURI, setImageURI] = useState("");
  const fetcher = useFetcher();

  useEffect(() => {
    fetcher.load(
      `/pawn-images?${encodeSearchParams({
        body: bodyType,
        gender,
        head: headGraphicPath,
        hairDef,
        hairColor,
        melanin,
      })}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bodyType, gender, headGraphicPath, melanin, hairDef, hairColor]);

  useEffect(() => {
    setImageURI(fetcher.data);
  }, [fetcher]);

  return imageURI && <img src={imageURI} alt="test" />;
};

export default PawnImage;
