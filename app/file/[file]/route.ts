import path from "path";
import fs from "fs/promises";
import { UPLOADED_DIRECTORY } from "@/config";

export async function GET(request: Request) {
  try {
    const file = new URL(request.url).href.split("/").at(-1);
    if (!file) {
      throw new Error("File does not exist");
    }
    const fileContents = await fs.readFile(
      path.join(UPLOADED_DIRECTORY, decodeURIComponent(file)),
    );
    return new Response(fileContents);
  } catch {
    return new Response("File not found", { status: 404 });
  }
}
