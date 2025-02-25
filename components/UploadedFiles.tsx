import { FileInfo } from "@/types";
import Image from "next/image";

export default function UploadedFiles({ files }: { files: FileInfo[] }) {
  // ChatGPT
  function formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024; // Size of 1 KB
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  return (
    <>
      {files.length === 0 ? (
        <p>No uploaded files found. Upload to get started</p>
      ) : (
        <ul className="flex flex-wrap gap-4">
          {files.map((file, index) => (
            <li key={index} className="border border-red-100 p-4">
              <div>
                <p>{file.name}</p>
                <p>{new Date(file.uploadDate).toLocaleString()}</p>
                <p>{formatBytes(file.size)}</p>
              </div>

              {file.isImage && (
                <Image
                  width={500}
                  height={500}
                  src={file.url}
                  alt={file.name}
                />
              )}

              {file.isVideo && (
                <video controls width={500} height={500}>
                  <source src={file.url} />
                </video>
              )}

              <div className="flex gap-4">
                <button>Copy</button>
                <a href={file.url} download>
                  Download
                </a>
                <button>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
