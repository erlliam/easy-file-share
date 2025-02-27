import { getFile, saveFile } from "@/app/actions";
import Button from "@/components/Button";
import { FileInfo } from "@/types";
import { ChangeEvent, useEffect, useRef } from "react";

async function uploadFile(
  file: File,
  onFileUpload: (newFile: FileInfo) => void,
) {
  if (!file) {
    return;
  }

  // todo: Add loading
  const fileContents = await file.bytes();
  const fileName = await saveFile({
    file: fileContents,
    name: file.name ?? "untitled",
  });
  if (fileName) {
    onFileUpload(await getFile(fileName));
  }
}

export default function UploadFile({
  onFileUpload,
}: {
  onFileUpload: (newFile: FileInfo) => void;
}) {
  return (
    <>
      <UploadFilePaste onFileUpload={onFileUpload} />
      <UploadFileSelector onFileUpload={onFileUpload} />
    </>
  );
}

function UploadFileSelector({
  onFileUpload,
}: {
  onFileUpload: (newFile: FileInfo) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleUploadButtonClicked() {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target?.files?.[0];

    if (file) {
      uploadFile(file, onFileUpload);
    }
  }

  return (
    <>
      <Button onClick={handleUploadButtonClicked}>Upload</Button>
      <input
        className="hidden"
        ref={fileInputRef}
        type="file"
        name="fileUpload"
        onChange={handleChange}
      />
    </>
  );
}

function UploadFilePaste({
  onFileUpload,
}: {
  onFileUpload: (newFile: FileInfo) => void;
}) {
  function handlePaste(event: ClipboardEvent) {
    const data = event.clipboardData;
    const file = data?.files?.[0];
    if (file) {
      uploadFile(file, onFileUpload);
    }
  }

  useEffect(() => {
    window.addEventListener("paste", handlePaste);

    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  });

  return <></>;
}
