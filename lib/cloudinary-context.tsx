import { Cloudinary } from "@cloudinary/url-gen/index";
import React from "react";

export const CloudinaryContext = React.createContext<
  | {
      cld: Cloudinary;
    }
  | undefined
>(undefined);

export function CloudinaryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const cld = new Cloudinary({
    cloud: {
      cloudName: process.env.CLOUD_NAME,
      apiKey: process.env.CLOUD_API_KEY,
      apiSecret: process.env.CLOUD_API_SECRET,
    },
  });
  return (
    <CloudinaryContext.Provider value={{ cld }}>
      {children}
    </CloudinaryContext.Provider>
  );
}
