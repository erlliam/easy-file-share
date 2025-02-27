import { FileInfo } from "@/types";
import UploadFile from "./UploadFile";

export default function Header({
  onFileUpload,
}: {
  onFileUpload: (newFile: FileInfo) => void;
}) {
  return (
    <header className="flex items-center justify-center gap-4 p-4">
      <h1 className="text-4xl">easy-file-share</h1>
      <UploadFile onFileUpload={onFileUpload} />
    </header>
  );
}
