import React from "react";
import { FileImage } from "./file";

interface CommunityFormProps {
  defaultSelected?: Record<string, string>;
  defaultProfileImage?: FileImage;
}

export function useCreateCommunityForm({
  defaultSelected,
  defaultProfileImage,
}: CommunityFormProps) {
  const [selected, setSelected] = React.useState<Record<string, string>>(
    defaultSelected || {}
  );
  const [profileImage, setProfileImage] = React.useState<FileImage | undefined>(
    defaultProfileImage
  );

  return { selected, setSelected, profileImage, setProfileImage };
}
