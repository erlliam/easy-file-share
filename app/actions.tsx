"use server";

import path from "path";
import fs from "fs";

const UPLOADED_DIRECTORY = path.resolve("app/uploaded/");

export async function getFiles(): Promise<string[]> {
  try {
    return fs.readdirSync(UPLOADED_DIRECTORY);
  } catch {
    return [];
  }
}
