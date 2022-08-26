/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useOutletContext } from "@remix-run/react";

import { parseString } from "xml2js";

const SaveFileDropzone = () => {
  const [rawSave, setRawSave] = useState({});
  const [processing, setProcessing] = useState(false);
  const { setSaveData } = useOutletContext();

  useEffect(() => {
    parseString(rawSave, (err, result) => setSaveData(result));
    setProcessing(false);
  }, [rawSave]);

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      setProcessing(true);
      const reader = new FileReader();
      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        setRawSave(reader.result);
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
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <span>{getDropLabel()}</span>
    </div>
  );
};

export default SaveFileDropzone;
