"use client";

import { useEffect, useState } from "react";
import { getFiles } from "./actions";
import LoadingSpinner from "@/components/LoadingSpinner";
import { FileInfo } from "@/types";
import UploadFile from "@/components/UploadFile";
import UploadedFiles from "@/components/UploadedFiles";

export default function Home() {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [filesLoading, setFilesLoading] = useState(true);

  function handleFileUpload(newFile: FileInfo) {
    setFiles([newFile, ...files]);
  }

  useEffect(() => {
    getFiles()
      .then((files) => setFiles(files))
      .finally(() => setFilesLoading(false));
  }, []);

  return (
    <div>
      <UploadFile onFileUpload={handleFileUpload} />
      {filesLoading ? <LoadingSpinner /> : <UploadedFiles files={files} />}
    </div>
  );
}
