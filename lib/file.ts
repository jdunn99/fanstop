export function getFileData(file: File) {
  const reader = new FileReader();
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", "fanstop");

  return { reader, formData };
}

export async function uploadImage(formData: FormData) {
  const result = await fetch(
    "https://api.cloudinary.com/v1_1/dw7064r1g/upload",
    {
      method: "POST",
      body: formData,
    }
  );
  const json = await result.json();

  return json["secure_url"];
}
