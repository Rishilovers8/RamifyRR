export interface VideoMetadata {
  duration: number;
  width: number;
  height: number;
  fps: number;
  codec: string;
  bitrate: number;
  hasAudio: boolean;
  audioCodec?: string;
  audioChannels?: number;
  audioSampleRate?: number;
}

export interface VideoData {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  metadata: VideoMetadata;
  preview: string;
}

export interface TranslationJob {
  id: string;
  videoId: string;
  targetLanguages: string[];
  options: {
    voiceClone: boolean;
    subtitles: boolean;
    lipSync: boolean;
  };
  status: "pending" | "processing" | "completed" | "failed";
  createdAt: Date;
  completedAt?: Date;
  error?: string;
}
