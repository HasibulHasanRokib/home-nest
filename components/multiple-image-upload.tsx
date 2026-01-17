"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { X, Loader2, Upload, CloudUpload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import { useUploadThing } from "@/lib/uploadthing";

interface FileUploadProps {
  maxSize?: number;
  maxImages?: number;
  onUploadSuccess?: (urls: string[]) => void;
  defaultFiles?: string[];
}

export function MultipleImageUpload({
  maxSize = 2 * 1024 * 1024,
  maxImages = 5,
  onUploadSuccess,
  defaultFiles = [],
}: FileUploadProps) {
  const [files, setFiles] = useState<string[]>(defaultFiles);
  const [progress, setProgress] = useState(0);

  const { startUpload, isUploading } = useUploadThing("multipleImageUpload", {
    onUploadProgress: (p) => setProgress(p),
    onClientUploadComplete: (res) => {
      const urls = res?.map((f) => f.ufsUrl).filter(Boolean) as string[];
      if (!urls.length) return;

      const updated = [...files, ...urls].slice(0, maxImages);
      setFiles(updated);
      onUploadSuccess?.(updated);
      toast("✅ Images uploaded successfully");
    },
  });

  useEffect(() => {
    if (defaultFiles.length) setFiles(defaultFiles);
  }, [defaultFiles]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (files.length >= maxImages) {
        toast(`❌ Max ${maxImages} images allowed`);
        return;
      }

      const validFiles = acceptedFiles.filter((file) => file.size <= maxSize);

      if (validFiles.length !== acceptedFiles.length) {
        toast(`❌ Each image must be under ${maxSize / (1024 * 1024)}MB`);
        return;
      }

      const remainingSlots = maxImages - files.length;
      await startUpload(validFiles.slice(0, remainingSlots));
    },
    [files, maxImages, maxSize, startUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    maxFiles: maxImages,
  });

  const handleDelete = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onUploadSuccess?.(updated);
  };

  return (
    <div className="space-y-4">
      {files.length < maxImages && (
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
            <div className="rounded-full bg-primary/10 p-3">
              {isUploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              ) : (
                <CloudUpload className="h-6 w-6 text-primary" />
              )}
            </div>

            <div className="text-sm">
              {isUploading ? (
                <>
                  <p>Uploading {progress}%</p>
                  <Progress value={progress} className="mt-3 h-1" />
                </>
              ) : (
                <>
                  <p>Drag & drop images here, or click</p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG • Max {maxImages} images •{" "}
                    {maxSize / (1024 * 1024)}MB each
                  </p>
                  <Label className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-md bg-primary/10 px-4 py-2 text-primary">
                    <Upload className="h-4 w-4" />
                    Choose Images
                  </Label>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {files.map((file, index) => (
            <div
              key={file}
              className="relative h-40 w-full overflow-hidden rounded-lg border"
            >
              <Image
                src={file}
                alt={`Uploaded ${index + 1}`}
                fill
                className="object-cover"
              />
              <Button
                type="button"
                size="icon"
                variant="destructive"
                className="absolute right-2 top-2 h-6 w-6 rounded-full"
                onClick={() => handleDelete(index)}
                disabled={isUploading}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
