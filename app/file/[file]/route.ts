import path from "path";
import fs from "fs/promises";

// make this reused
const UPLOADED_DIRECTORY = path.resolve("app/uploaded/");

export async function GET(
  request: Request,
  { params }: { params: Promise<{ file: string }> },
) {
  const file = (await params).file;
  const fileContents = await fs.readFile(
    path.resolve(UPLOADED_DIRECTORY, file),
  );
  return new Response(fileContents);
}
