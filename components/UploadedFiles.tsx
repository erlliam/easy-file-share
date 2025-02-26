import { FileInfo } from "@/types";
import Image from "next/image";
import { createPortal } from "react-dom";
import Button from "./Button";
import { useState } from "react";

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

                <Modal
                  title="Delete file"
                  button={<button>Delete</button>}
                  body={(close) => (
                    <>
                      <div className="pb-2">
                        Are you sure you want to permanently delete this file?
                      </div>
                      <div className="flex justify-between gap-2">
                        <Button onClick={close}>Cancel</Button>
                        <Button
                        // onClick={/* todo: Fire delete request and update list */}
                        >
                          Delete
                        </Button>
                      </div>
                    </>
                  )}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function Modal({
  button,
  body,
  title,
}: Readonly<{
  // readonly does nothing????
  button: React.ReactNode;
  body: (close: () => void) => React.ReactNode;
  title: string;
}>) {
  const [open, setOpen] = useState(false);

  function handleOnClick() {
    setOpen((x) => !x);
  }

  return (
    <>
      <div onClick={handleOnClick}>{button && button}</div>

      {open &&
        createPortal(
          <div
            tabIndex={-1}
            className="fixed inset-0 flex items-center justify-center overscroll-contain bg-black/80"
          >
            <div className="max-w-md rounded border border-gray-600 bg-gray-800 p-4">
              <header className="pb-2 text-2xl">{title}</header>
              <div>{body(() => setOpen(false))}</div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
