import { FileInfo } from "@/types";
import Image from "next/image";
import { createPortal } from "react-dom";
import Button from "./Button";
import { useEffect, useState } from "react";

function formatBytes(bytes: number, decimals = 2) {
  // ChatGPT

  if (bytes === 0) return "0 Bytes";

  const k = 1024; // Size of 1 KB
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export default function UploadedFiles({
  files,
  handleFileDeleted,
}: {
  files: FileInfo[];
  handleFileDeleted: (file: FileInfo) => void;
}) {
  // todo: Change columns count based on screen size
  // Good masonry article at: https://blog.andri.co/021-building-a-stylish-masonry-layout-using-just-css-and-javascript/
  // We ignore the height based stuff, I think it's probably better to just go by the order the server returns (uploaded date)
  const columns: FileInfo[][] = [...Array(3)].map(() => []);

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const columnIndex = i % 3;

    columns[columnIndex].push(file);
  }

  return (
    <>
      {files.length === 0 ? (
        <p>No uploaded files found. Upload to get started</p>
      ) : (
        <div className="m-4 grid grid-cols-3 gap-4">
          {columns.map((files, index) => (
            <div key={index} className="flex flex-col gap-4">
              {files.map((file) => (
                <UploadedFile
                  onFileDeleted={() => handleFileDeleted(file)}
                  file={file}
                  key={file.name}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function UploadedFile({
  file,
  onFileDeleted,
}: {
  file: FileInfo;
  onFileDeleted: () => void;
}) {
  return (
    <div className="overflow-hidden rounded border border-gray-600 bg-gray-800 p-4">
      <div className="pb-4">
        <div className="whitespace-nowrap text-xs">
          <p>{file.name}</p>
          <p>{new Date(file.uploadDate).toLocaleString()}</p>
          <p>{formatBytes(file.size)}</p>
        </div>
      </div>

      {file.isImage && (
        <Image
          className="pb-4"
          width={500}
          height={500}
          src={file.url}
          alt={file.name}
        />
      )}

      {file.isVideo && (
        <video className="pb-4" controls width={500} height={500}>
          <source src={file.url} />
        </video>
      )}

      <div className="flex gap-4">
        <button>Copy</button>
        <a href={file.url} download>
          Download
        </a>

        {/* todo: ADD LOADING TO THIS DELETE UI,  */}
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
                <Button onClick={onFileDeleted}>Delete</Button>
              </div>
            </>
          )}
        />
      </div>
    </div>
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

  useEffect(() => {
    if (open) {
      window.document.documentElement.setAttribute("style", "overflow: hidden");
    } else {
      window.document.documentElement.removeAttribute("style");
    }

    return () => {
      window.document.documentElement.removeAttribute("style");
    };
  }, [open]);

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
