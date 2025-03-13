"use client";

import { useEffect, useState } from "react";
import { getFiles } from "./actions";
import LoadingSpinner from "@/components/LoadingSpinner";
import { FileInfo } from "@/types";
import UploadedFiles from "@/components/UploadedFiles";
import Header from "@/components/Header";

export default function Home() {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [filesLoading, setFilesLoading] = useState(true);

  function handleFileUpload(newFile: FileInfo) {
    setFiles([newFile, ...files]);
  }

  function handleFileDeleted(file: FileInfo) {
    setFiles(files.filter((x) => x.name !== file.name));
  }

  useEffect(() => {
    getFiles()
      .then((files) => setFiles(files))
      .finally(() => setFilesLoading(false));
  }, []);

  return (
    <div>
      <Header onFileUpload={handleFileUpload} />

      {filesLoading ? (
        <LoadingSpinner />
      ) : (
        <UploadedFiles handleFileDeleted={handleFileDeleted} files={files} />
      )}
    </div>
  );
}
