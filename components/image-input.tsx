import { getFileData } from "@/lib/file";
import React from "react";
import { BsPlusCircleFill } from "react-icons/bs";

export type ImageState = {
  src: string | null;
  formData?: FormData;
};

interface ImageInputProps {
  coverImage: ImageState;
  setCoverImage: React.Dispatch<React.SetStateAction<ImageState>>;
}
export function ImageInput({ setCoverImage, coverImage }: ImageInputProps) {
  const imageInputRef = React.useRef<HTMLInputElement>(null);

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      const { reader, formData } = getFileData(event.target.files[0]);

      reader.onload = (event) => {
        const { target } = event;
        if (!target) {
          return;
        }

        setCoverImage({ src: target.result!.toString(), formData });
      };

      reader.readAsDataURL(selectedFile);
    }
  }

  return (
    <React.Fragment>
      <div
        className="w-full border min-h-[64px] rounded-xl cursor-pointer bg-white hover:bg-rose-50"
        onClick={() => {
          imageInputRef.current?.click();
        }}
      >
        {typeof coverImage !== "undefined" && coverImage.src !== null ? (
          <img src={coverImage.src} className="rounded-xl hover:opacity-50" />
        ) : (
          <p className="flex justify-center items-center  gap-2 text-slate-600 font-semibold h-[64px]">
            <BsPlusCircleFill /> Add image
          </p>
        )}
      </div>

      <input
        ref={imageInputRef}
        className="hidden"
        type="file"
        onChange={onFileChange}
      />
    </React.Fragment>
  );
}
