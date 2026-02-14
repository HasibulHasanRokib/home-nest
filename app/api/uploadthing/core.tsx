import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  imageUpload: f({
    image: {
      maxFileSize: "2MB",
      maxFileCount: 5,
    },
  }).onUploadComplete(async ({ file }) => {
    return {
      url: file.ufsUrl,
    };
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
