"use client";

import { useState } from "react";
import { VideoUploader } from "@/components/video-uploader";
import { TranslationPanel } from "@/components/translation-panel";
import { VideoPreview } from "@/components/video-preview";
import { Header } from "@/components/header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { VideoData } from "@/types/video";

export default function Home() {
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleVideoUpload = (data: VideoData) => {
    setVideoData(data);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="preview" disabled={!videoData}>
              Preview
            </TabsTrigger>
            <TabsTrigger value="translate" disabled={!videoData}>
              Translate
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <VideoUploader onVideoUpload={handleVideoUpload} />
          </TabsContent>

          {videoData && (
            <>
              <TabsContent value="preview" className="space-y-4">
                <VideoPreview videoData={videoData} />
              </TabsContent>

              <TabsContent value="translate" className="space-y-4">
                <TranslationPanel
                  videoData={videoData}
                  isProcessing={isProcessing}
                  setIsProcessing={setIsProcessing}
                />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </main>
  );
}
