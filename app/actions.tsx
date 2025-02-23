"use server";

import path from "path";
import fs from "fs";

const UPLOADED_DIRECTORY = path.resolve("app/uploaded/");

export async function getFiles(): Promise<string[]> {
  fs.mkdirSync(UPLOADED_DIRECTORY, { recursive: true });
  return fs.readdirSync(UPLOADED_DIRECTORY);
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
