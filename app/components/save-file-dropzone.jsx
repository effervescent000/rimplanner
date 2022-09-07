import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { parseString } from "xml2js";
import PropTypes from "prop-types";

import { processSaveFile } from "~/helpers/saveFileProcessingHelper";

const SaveFileDropzone = ({ setSaveData }) => {
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

  return (
    <div className="my-2">
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <span className="px-2 py-4 bg-slate-200 rounded-sm border-slate-300 border-2">
          {getDropLabel()}
        </span>
      </div>
    </div>
  );
};

SaveFileDropzone.propTypes = {
  setSaveData: PropTypes.func.isRequired,
};

export default SaveFileDropzone;
