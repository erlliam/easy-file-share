import { getFile, saveFile } from "@/app/actions";
import Button from "@/components/Button";
import { FileInfo } from "@/types";

export default function UploadFile({
  onFileUpload,
}: {
  onFileUpload: (newFile: FileInfo) => void;
}) {
  async function uploadFile(formData: FormData) {
    const fileUpload = formData.get("fileUpload") as File;

    if (!fileUpload.name) {
      return;
    }

    // todo: Add loading
    const fileContents = await fileUpload.bytes();
    const fileName = await saveFile({
      file: fileContents,
      name: fileUpload.name,
    });
    if (fileName) {
      onFileUpload(await getFile(fileName));
    }
  }

  return (
    <form action={uploadFile}>
      <input type="file" name="fileUpload" />
      <Button>Upload</Button>
    </form>
  );
}
