"use server";

import path from "path";
import fs from "fs";
import { fileTypeFromFile } from "file-type";
import { FileInfo } from "@/types";
import { UPLOADED_DIRECTORY } from "@/config";

export async function getFiles(): Promise<FileInfo[]> {
  fs.mkdirSync(UPLOADED_DIRECTORY, { recursive: true });
  const filesInDirectory = fs.readdirSync(UPLOADED_DIRECTORY);
  const filesInDirectoryWithInformation = filesInDirectory.map((x) =>
    getFile(x),
  );
  await Promise.all(filesInDirectoryWithInformation);
  return (await Promise.all(filesInDirectoryWithInformation)).sort(
    (a, b) => b.uploadDate - a.uploadDate,
  );
}

export async function getFile(file: string): Promise<FileInfo> {
  const filePath = path.join(UPLOADED_DIRECTORY, file);
  const stat = fs.statSync(filePath);
  const type = await fileTypeFromFile(filePath);

  // In Linux we do not have access to birthTime
  const uploadDate = stat.ctimeMs;
  const size = stat.size;

  let isVideo;
  let isImage;
  if (type) {
    isVideo = type.mime.startsWith("video/");
    isImage = type.mime.startsWith("image/");
  }

  return {
    name: file,
    url: `/file/${encodeURIComponent(file)}`,
    uploadDate,
    size,
    isVideo,
    isImage,
  };
}

export async function saveFile({
  file,
  name,
}: {
  file: string | NodeJS.ArrayBufferView;
  name: string;
}) {
  try {
    if (!name) {
      return;
    }

    let filePath = path.join(UPLOADED_DIRECTORY, name);

    // Ensure there is no directory traversal
    const resolvedFilePath = path.resolve(filePath);
    if (!resolvedFilePath.startsWith(UPLOADED_DIRECTORY)) {
      return;
    }

    // Handle duplicates
    if (fs.existsSync(filePath)) {
      let counter = 1;
      const fileExtension = path.extname(filePath);
      const fileNameWithoutExtension = path.basename(filePath, fileExtension);
      while (fs.existsSync(filePath)) {
        filePath = path.join(
          UPLOADED_DIRECTORY,
          `${fileNameWithoutExtension}(${counter})${fileExtension}`,
        );
        counter++;
      }
    }

    fs.writeFileSync(filePath, file);

    return path.basename(filePath);
  } catch (error) {
    console.log(error);
    console.error("saveFile error");
  }
}

export async function deleteFile(file: string) {
  const filePath = path.join(UPLOADED_DIRECTORY, file);
  fs.unlinkSync(filePath);
}
