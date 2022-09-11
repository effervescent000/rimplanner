import { useState, useCallback, useContext } from "react";
import { useDropzone } from "react-dropzone";
import { parseString } from "xml2js";
import PropTypes from "prop-types";

import { processSaveFile } from "~/helpers/saveFileProcessingHelper";
import RWContext from "~/context/RWContext";

const SaveFileDropzone = () => {
  const { setSaveData } = useContext(RWContext);
  const [processing, setProcessing] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles) => {
      acceptedFiles.forEach((file) => {
        setProcessing(true);
        const reader = new FileReader();
        reader.onabort = () => console.log("file reading was aborted");
        reader.onerror = () => console.log("file reading has failed");
        reader.onload = () => {
          parseString(reader.result, { explicitArray: false }, (err, result) => {
            console.log(result);
            setSaveData(processSaveFile(result));
          });
          setProcessing(false);
        };
        reader.readAsText(file);
      });
    },
    [setSaveData]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const getDropLabel = () => {
    if (processing) return "Thinking...";
    if (isDragActive) return "Drop here!";
    return "Drop a file here";
  };

  const style = {
    padding: "1rem",
    backgroundColor: "rgb(226 232 240)",
    borderRadius: "5px",
    border: "rgb(203 213 225) 2px solid",
    width: "100%",
  };

  return (
    <div className="my-2 w-36">
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <span>{getDropLabel()}</span>
      </div>
    </div>
  );
};

export default SaveFileDropzone;
