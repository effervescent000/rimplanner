/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useOutletContext } from "@remix-run/react";
import { parseString } from "xml2js";

import { processSaveFile } from "~/helpers/saveFileProcessingHelper";

const SaveFileDropzone = () => {
  const [processing, setProcessing] = useState(false);
  const { setSaveData } = useOutletContext();

  const onDrop = useCallback((acceptedFiles) => {
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
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const getDropLabel = () => {
    if (processing) return "Thinking...";
    if (isDragActive) return "Drop here!";
    return "Drop a file here";
  };

  return (
    <div className="absolute -left-40">
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <span>{getDropLabel()}</span>
      </div>
    </div>
  );
};

export default SaveFileDropzone;
