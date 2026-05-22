"use client";

import { useState, useRef } from "react";
import { Upload, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { validateVideoFile } from "@/lib/video-extractor";
import type { VideoData } from "@/types/video";

interface VideoUploaderProps {
  onVideoUpload: (data: VideoData) => void;
}

export function VideoUploader({ onVideoUpload }: VideoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setError(null);
    setSuccess(false);
    setIsLoading(true);

    try {
      // Validate file
      const validation = validateVideoFile(file);
      if (!validation.valid) {
        setError(validation.error || "Invalid video file");
        setIsLoading(false);
        return;
      }

      // Create FormData and upload
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/extract", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.details || errorData.error || "Failed to process video"
        );
      }

      const result = await response.json();

      if (result.success && result.metadata) {
        // Create video data object
        const videoData: VideoData = {
          id: Date.now().toString(),
          file: file,
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date(),
          metadata: result.metadata,
          preview: URL.createObjectURL(file),
        };

        onVideoUpload(videoData);
        setSuccess(true);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      setError(errorMsg);
      console.error("Video upload error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Video</CardTitle>
        <CardDescription>
          Upload a video file to start the translation process
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
          className={`relative rounded-lg border-2 border-dashed p-12 text-center transition-colors cursor-pointer ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isLoading}
          />

          <div className="flex flex-col items-center gap-2">
            {isLoading ? (
              <>
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <p className="text-sm font-medium">Processing video...</p>
                <p className="text-xs text-muted-foreground">
                  Extracting metadata...
                </p>
              </>
            ) : (
              <>
                <Upload className="h-12 w-12 text-muted-foreground" />
                <p className="text-sm font-medium">
                  Drag and drop your video here
                </p>
                <p className="text-xs text-muted-foreground">
                  or click to select a file
                </p>
              </>
            )}
          </div>

          <div className="mt-4 text-xs text-muted-foreground">
            <p>Supported formats: MP4, MOV, AVI, MKV, WebM</p>
            <p>Maximum file size: 500MB</p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>Video uploaded successfully!</AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handleClick}
          disabled={isLoading}
          className="w-full"
          variant="outline"
        >
          {isLoading ? "Processing..." : "Select Video File"}
        </Button>
      </CardContent>
    </Card>
  );
}
