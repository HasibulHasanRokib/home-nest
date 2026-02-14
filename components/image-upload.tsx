"use client";

import Image from "next/image";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useUploadThing } from "@/lib/uploadthing";
import { Progress } from "@/components/ui/progress";
import { removeBackground } from "@imgly/background-removal";
import { X, Loader2, CloudUpload, Eraser } from "lucide-react";

interface ImageUploadProps {
  onUploadSuccess: (urls: string[]) => void;
  defaultFiles?: string[];
  multiple?: boolean;
  removeBg?: boolean;
  maxSize?: number;
}

export function ImageUpload({
  onUploadSuccess,
  defaultFiles = [],
  multiple = false,
  removeBg = false,
  maxSize = 2 * 1024 * 1024,
}: ImageUploadProps) {
  const [files, setFiles] = useState<string[]>(defaultFiles);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const { startUpload, isUploading } = useUploadThing("imageUpload", {
    onUploadProgress: (p) => setProgress(p),
    onClientUploadComplete: (res) => {
      const newUrls = res
        ?.map((item) => item.ufsUrl)
        .filter(Boolean) as string[];
      const updatedFiles = multiple ? [...files, ...newUrls] : [newUrls[0]];
      setFiles(updatedFiles);
      onUploadSuccess?.(updatedFiles);
      toast.success(`${newUrls.length} image(s) uploaded`);
    },
    onUploadError: (err) => {
      toast.error(`Upload failed: ${err.message}`);
    },
  });

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      let filesToUpload = acceptedFiles;

      if (removeBg && !multiple) {
        setIsProcessing(true);
        try {
          const file = acceptedFiles[0];
          const cleanedBlob = await removeBackground(file);
          const processedFile = new File(
            [cleanedBlob],
            `${file.name.split(".")[0]}-no-bg.png`,
            {
              type: "image/png",
            },
          );
          filesToUpload = [processedFile];
        } catch {
          toast.error("Background removal failed, uploading original.");
        } finally {
          setIsProcessing(false);
        }
      }

      await startUpload(filesToUpload);
    },
    [removeBg, multiple, startUpload],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    maxFiles: multiple ? 5 : 1,
    maxSize,
    disabled: isUploading,
    onDropRejected: (fileRejections) => {
      const error = fileRejections[0]?.errors[0];
      if (error?.code === "file-too-large") {
        toast.error("File is too large. Max size is 2MB");
      } else {
        toast.error(error?.message || "Something went wrong");
      }
    },
  });

  const handleDelete = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onUploadSuccess?.(updatedFiles);
  };

  return (
    <div className="w-full space-y-4">
      {(multiple || files.length === 0) && (
        <div
          {...getRootProps()}
          className={`relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50"
          } ${isUploading || isProcessing ? "opacity-60 pointer-events-none" : ""}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-3">
            <div className="rounded-full bg-primary/10 p-3">
              {isProcessing ? (
                <Eraser className="h-6 w-6 animate-pulse text-primary" />
              ) : isUploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              ) : (
                <CloudUpload className="h-6 w-6 text-primary" />
              )}
            </div>

            <div className="text-sm">
              {isProcessing ? (
                <p className="font-medium text-primary">
                  Removing Background...
                </p>
              ) : isUploading ? (
                <div className="w-48 space-y-2">
                  <p>Uploading {progress}%</p>
                  <Progress value={progress} className="h-1" />
                </div>
              ) : (
                <>
                  <p className="font-medium">
                    {multiple ? "Upload Images" : "Upload Image"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Max size: {maxSize / (1024 * 1024)}MB{" "}
                    {removeBg && "(BG will be removed)"}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {files.length > 0 && (
        <div
          className={`grid gap-4 ${multiple ? "grid-cols-2 md:grid-cols-3" : "grid-cols-1"}`}
        >
          {files.map((url, index) => (
            <div
              key={url}
              className="group relative  aspect-video overflow-hidden rounded-lg border bg-white shadow-sm"
            >
              <Image src={url} alt="Uploaded" fill className="object-contain" />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute right-2 top-2 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleDelete(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
