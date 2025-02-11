"use server";

import path from "path";
import fs from "fs";

const UPLOADED_DIRECTORY = path.resolve("app/uploaded/");

export async function getFiles(): Promise<string[]> {
  // Generate a random delay between 3000 and 6000 milliseconds (3-6 seconds)
  return new Promise((resolve) => {
    const randomDelay = Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000;
    setTimeout(() => {
      try {
        resolve(fs.readdirSync(UPLOADED_DIRECTORY));
      } catch {
        resolve([]);
      }
    }, randomDelay);
  });
}
