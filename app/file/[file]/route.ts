import path from "path";
import fs from "fs/promises";
import { UPLOADED_DIRECTORY } from "@/config";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ file: string }> },
) {
  const file = (await params).file;
  const fileContents = await fs.readFile(path.join(UPLOADED_DIRECTORY, file));
  return new Response(fileContents);
}
