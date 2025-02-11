"use client";

import { useEffect, useState } from "react";
import { getFiles } from "./actions";

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
      {filesLoading ? (
        <p>Loading...</p>
      ) : files.length === 0 ? (
        <p>No uploaded files found. Upload to get started</p>
      ) : (
        <ul>
          {files.map((file, index) => (
            <li key={index}>{file}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
