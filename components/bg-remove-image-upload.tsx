"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { X, Loader2, Upload, CloudUpload, Eraser } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import { useUploadThing } from "@/lib/uploadthing";
import { removeBackground } from "@imgly/background-removal";

interface FileUploadProps {
  maxSize?: number;
  onUploadSuccess?: (fileUrl: string) => void;
  defaultFile?: string;
}

export function BgRemoveImageUpload({
  maxSize = 2 * 1024 * 1024,
  onUploadSuccess,
  defaultFile,
}: FileUploadProps) {
  const [file, setFile] = useState<string | undefined>(defaultFile);

  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [progress, setProgress] = useState(0);

  const { startUpload, isUploading } = useUploadThing("imageUpload", {
    onUploadProgress: (p) => setProgress(p),
    onClientUploadComplete: (res) => {
      const url = res?.[0]?.ufsUrl;
      if (!url) return;
      setFile(url);
      onUploadSuccess?.(url);
      toast.success("Image uploaded successfully");
    },
    onUploadError: (err) => {
      toast.error(err.message);
    },
  });

  useEffect(() => {
    if (defaultFile) setFile(defaultFile);
  }, [defaultFile]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      let file = acceptedFiles[0];
      if (!file) return;

      if (file.size > maxSize) {
        toast(`❌ File too large. Max ${maxSize / (1024 * 1024)}MB`);
        return;
      }

      setIsRemovingBg(true);

      try {
        const cleanedBlob = await removeBackground(file);

        file = new File([cleanedBlob], `${file.name}-clean.png`, {
          type: "image/png",
        });

        await startUpload([file]);
      } catch (error) {
        console.error(error);
        toast("❌ Failed to process image");
      } finally {
        setIsRemovingBg(false);
      }
    },

    [maxSize, startUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    maxFiles: 1,
  });

  const handleDelete = () => {
    setFile(undefined);
    setProgress(0);
    onUploadSuccess?.("");
  };

  return (
    <>
      {!file ? (
        <div
          {...getRootProps()}
          className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2">
            <div className="bg-primary/10 rounded-full p-3">
              {isRemovingBg ? (
                <Eraser className="text-primary h-6 w-6 animate-pulse" />
              ) : isUploading ? (
                <Loader2 className="text-primary h-6 w-6 animate-spin" />
              ) : (
                <CloudUpload className="text-primary h-6 w-6" />
              )}
            </div>

            <div className="text-sm">
              {isDragActive ? (
                "Drop your image..."
              ) : isRemovingBg ? (
                <p className="text-primary animate-pulse text-sm">
                  Removing background…
                </p>
              ) : isUploading ? (
                <div>
                  <p>Uploading {progress}%</p>
                  <Progress value={progress} className="mt-3 h-1" />
                </div>
              ) : (
                <div className="space-y-2">
                  <p>Drag & drop image here, or click to select</p>
                  <p className="text-muted-foreground text-xs">
                    JPG, JPEG, PNG — up to {maxSize / (1024 * 1024)}MB
                  </p>
                  <Label
                    htmlFor="bgremove-upload"
                    className="text-primary bg-primary/10 inline-flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 transition-colors"
                  >
                    <Upload className="h-4 w-4" />
                    Choose Image
                  </Label>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="relative mx-auto h-52 w-full overflow-hidden rounded-lg border bg-white">
          <Image src={file} alt="Preview" className="object-contain" fill />

          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6 rounded-full"
            onClick={handleDelete}
            disabled={isUploading}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
    </>
  );
}
