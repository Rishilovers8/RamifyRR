"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatFileSize, formatDuration } from "@/lib/utils";
import type { VideoData } from "@/types/video";

interface VideoPreviewProps {
  videoData: VideoData;
}

export function VideoPreview({ videoData }: VideoPreviewProps) {
  const { metadata, file, preview } = videoData;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Video Preview</CardTitle>
          <CardDescription>{file.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <video
            src={preview}
            controls
            className="w-full rounded-lg bg-black"
            style={{ maxHeight: "400px" }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Video Details</CardTitle>
          <CardDescription>File information and metadata</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Filename
              </p>
              <p className="text-sm font-semibold break-all">{file.name}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                File Size
              </p>
              <p className="text-sm font-semibold">
                {formatFileSize(file.size)}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Duration
              </p>
              <p className="text-sm font-semibold">
                {formatDuration(metadata.duration)}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Resolution
              </p>
              <p className="text-sm font-semibold">
                {metadata.width} × {metadata.height}px
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Frame Rate
              </p>
              <p className="text-sm font-semibold">{metadata.fps} fps</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Video Codec
              </p>
              <p className="text-sm font-semibold">{metadata.codec}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Bitrate
              </p>
              <p className="text-sm font-semibold">
                {(metadata.bitrate / 1000).toFixed(2)} Mbps
              </p>
            </div>

            {metadata.hasAudio && (
              <>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Audio Codec
                  </p>
                  <p className="text-sm font-semibold">
                    {metadata.audioCodec || "AAC"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Audio Channels
                  </p>
                  <Badge variant="secondary">
                    {metadata.audioChannels || 2}-channel
                  </Badge>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Sample Rate
                  </p>
                  <p className="text-sm font-semibold">
                    {metadata.audioSampleRate || 48000} Hz
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
