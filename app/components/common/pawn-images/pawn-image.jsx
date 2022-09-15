import { useFetcher } from "@remix-run/react";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

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

  return (
    imageURI && (
      <div className="relative flex justify-center">
        <img src={imageURI} alt="test" />
      </div>
    )
  );
};

PawnImage.defaultProps = {
  bleedingOut: false,
};

PawnImage.propTypes = {
  pawn: PropTypes.shape({
    story: PropTypes.shape({
      bodyType: PropTypes.string,
      headGraphicPath: PropTypes.string,
      hairDef: PropTypes.string,
      hairColor: PropTypes.string,
      melanin: PropTypes.string,
    }),
    gender: PropTypes.string,
  }).isRequired,
  bleedingOut: PropTypes.bool,
};

export default PawnImage;
