"use client";

import { useEffect, useState } from "react";
import { getFiles, saveFile } from "./actions";
import Button from "@/components/Button";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Home() {
  const [files, setFiles] = useState<string[]>([]);
  const [filesLoading, setFilesLoading] = useState(true);

  useEffect(() => {
    getFiles()
      .then((files) => setFiles(files))
      .finally(() => setFilesLoading(false));
  }, []);

  return (
    <div>
      <h1>easy-file-share</h1>
      <UploadFile />
      {filesLoading ? <LoadingSpinner /> : <UploadedFiles files={files} />}
    </div>
  );
}

function UploadedFiles({ files }: { files: string[] }) {
  return (
    <>
      {files.length === 0 ? (
        <p>No uploaded files found. Upload to get started</p>
      ) : (
        <ul>
          {files.map((file, index) => (
            <li key={index}>{file}</li>
          ))}
        </ul>
      )}
    </>
  );
}

function UploadFile() {
  async function uploadFile(formData: FormData) {
    const fileUpload = formData.get("fileUpload") as File;

    if (!fileUpload.name) {
      return;
    }

    const fileBytes = await fileUpload.bytes();
    // todo: Show the newly uploaded file
    saveFile({ file: fileBytes, name: fileUpload.name });
  }

  return (
    <form action={uploadFile}>
      <input type="file" name="fileUpload" />
      <Button>Upload</Button>
    </form>
  );
}
