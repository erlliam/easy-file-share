"use server";

import path from "path";
import fs from "fs";
import { fileTypeFromFile } from "file-type";
import { FileInfo } from "@/types";

// todo: Change this, don't put uploaded inside app
const UPLOADED_DIRECTORY = path.resolve("app/uploaded/");

export async function getFiles(): Promise<FileInfo[]> {
  fs.mkdirSync(UPLOADED_DIRECTORY, { recursive: true });
  const filesInDirectory = fs.readdirSync(UPLOADED_DIRECTORY);
  const result: FileInfo[] = filesInDirectory.map((x) => ({
    name: x,
    url: `/file/${x}`,
    uploadDate: 0,
    size: 0,
  }));

  // todo: Make asynchronus? Add a Promise.all thingy use async stat?
  for (const item of result) {
    if (!item.name) {
      continue;
    }

    const filePath = path.join(UPLOADED_DIRECTORY, item.name);
    const stat = fs.statSync(filePath);
    const type = await fileTypeFromFile(filePath);

    // In Linux we do not have access to birthTime
    item.uploadDate = stat.ctimeMs;
    item.size = stat.size;
    item.isVideo = type.mime.startsWith("video/");
    item.isImage = type.mime.startsWith("image/");
  }

  return result;
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
  } catch (error) {
    console.log(error);
    console.error("saveFile error");
  }
}
