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
  onUploadSuccess?: (fileUrl: string) => void;
  defaultFile?: string;
}

export function ImageUpload({
  maxSize = 2 * 1024 * 1024,
  onUploadSuccess,
  defaultFile,
}: FileUploadProps) {
  const [file, setFile] = useState<string | undefined>(defaultFile);
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
      const file = acceptedFiles[0];
      if (!file) return;

      if (file.size > maxSize) {
        toast.error(`Max file size ${maxSize / (1024 * 1024)}MB`);
        return;
      }

      await startUpload([file]);
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
                  <p>Drag & drop image here, or click to select</p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG up to {maxSize / (1024 * 1024)}MB
                  </p>
                  <Label className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-md bg-primary/10 px-4 py-2 text-primary">
                    <Upload className="h-4 w-4" />
                    Choose Image
                  </Label>
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="relative mx-auto h-52 w-full overflow-hidden rounded-lg border">
          <Image
            src={file}
            alt="Uploaded image"
            fill
            className="object-contain"
          />
          <Button
            type="button"
            size="icon"
            variant="destructive"
            className="absolute right-2 top-2 h-6 w-6 rounded-full"
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
