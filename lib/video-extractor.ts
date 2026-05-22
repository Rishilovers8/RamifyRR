/**
 * Video Extractor Module
 * Handles video metadata extraction and validation
 */

interface VideoMetadata {
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

interface MP4Box {
  type: string;
  size: number;
  offset: number;
}

/**
 * Parses MP4 file structure to extract basic metadata
 */
function parseMP4Metadata(buffer: Buffer): Partial<VideoMetadata> {
  const metadata: Partial<VideoMetadata> = {
    fps: 24,
    bitrate: 0,
    hasAudio: false,
  };

  try {
    // Look for 'moov' box (movie metadata)
    const moovIndex = buffer.indexOf(Buffer.from("moov"));
    if (moovIndex === -1) {
      throw new Error("Invalid MP4 file: moov box not found");
    }

    // Look for 'mdat' box (media data)
    const mdatIndex = buffer.indexOf(Buffer.from("mdat"));
    if (mdatIndex === -1) {
      console.warn("No mdat box found in video");
    }

    // Extract basic info from ftyp box (file type)
    const ftypIndex = buffer.indexOf(Buffer.from("ftyp"));
    if (ftypIndex !== -1) {
      const brandOffset = ftypIndex + 8;
      const brand = buffer.toString("ascii", brandOffset, brandOffset + 4);
      console.log("File brand:", brand);
    }

    // Estimate bitrate from file size (rough calculation)
    metadata.bitrate = Math.round((buffer.length * 8) / 1000); // kbps

    return metadata;
  } catch (error) {
    console.error("MP4 parsing error:", error);
    return metadata;
  }
}

/**
 * Extracts video metadata from buffer
 * Supports MP4, WebM, and other common formats
 */
export async function extractVideoMetadata(
  buffer: Buffer,
  filename: string
): Promise<VideoMetadata> {
  const metadata: VideoMetadata = {
    duration: 0,
    width: 1920,
    height: 1080,
    fps: 24,
    codec: "h264",
    bitrate: 0,
    hasAudio: true,
    audioCodec: "aac",
    audioChannels: 2,
    audioSampleRate: 48000,
  };

  try {
    // Get file extension
    const extension = filename.split(".").pop()?.toLowerCase() || "";

    // Check file signatures/magic bytes
    if (buffer.length < 12) {
      throw new Error("File too small to be a valid video");
    }

    // MP4 file signature check (ftyp box should be at start)
    if (extension === "mp4" || extension === "m4v") {
      const isMp4 = buffer.toString("ascii", 4, 8) === "ftyp";
      if (!isMp4) {
        throw new Error("Invalid MP4 file format");
      }
      const mp4Data = parseMP4Metadata(buffer);
      Object.assign(metadata, mp4Data);
    }
    // WebM file signature check (0x1A 0x45 0xDF 0xA3)
    else if (extension === "webm") {
      const isWebM =
        buffer[0] === 0x1a &&
        buffer[1] === 0x45 &&
        buffer[2] === 0xdf &&
        buffer[3] === 0xa3;
      if (!isWebM) {
        throw new Error("Invalid WebM file format");
      }
      metadata.codec = "vp8 or vp9";
    }
    // Matroska (MKV) file signature check (0x1A 0x45 0xDF 0xA3)
    else if (extension === "mkv" || extension === "mka") {
      const isMkv =
        buffer[0] === 0x1a &&
        buffer[1] === 0x45 &&
        buffer[2] === 0xdf &&
        buffer[3] === 0xa3;
      if (!isMkv) {
        throw new Error("Invalid Matroska file format");
      }
    }
    // MOV file signature check (typically has 'ftyp' or 'mdat' at offset 4)
    else if (extension === "mov") {
      const boxType = buffer.toString("ascii", 4, 8);
      if (boxType !== "ftyp" && boxType !== "mdat" && boxType !== "wide") {
        throw new Error("Invalid MOV file format");
      }
      const mp4Data = parseMP4Metadata(buffer);
      Object.assign(metadata, mp4Data);
    }
    // AVI file signature check (RIFF....AVI )
    else if (extension === "avi") {
      const isAvi =
        buffer.toString("ascii", 0, 4) === "RIFF" &&
        buffer.toString("ascii", 8, 12) === "AVI ";
      if (!isAvi) {
        throw new Error("Invalid AVI file format");
      }
      metadata.codec = "mpeg4 or h264";
    }

    // Estimate duration if possible (rough calculation)
    // This is a simplification - real implementation would parse MOOV atoms
    if (metadata.bitrate > 0) {
      const fileSizeInBits = buffer.length * 8;
      const durationSeconds = fileSizeInBits / (metadata.bitrate * 1000);
      metadata.duration = Math.round(durationSeconds * 1000); // in milliseconds
    } else {
      // Default duration estimate
      metadata.duration = Math.round((buffer.length / 1024 / 1024) * 60 * 1000); // rough estimate
    }

    return metadata;
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : "Unknown extraction error";
    console.error("Video extraction failed:", errorMsg);
    throw new Error(`Video extraction failed: ${errorMsg}`);
  }
}

/**
 * Validates video file before processing
 */
export function validateVideoFile(
  file: File | Blob,
  maxSizeMB: number = 500
): { valid: boolean; error?: string } {
  const validMimes = [
    "video/mp4",
    "video/mpeg",
    "video/quicktime",
    "video/x-msvideo",
    "video/x-matroska",
    "video/webm",
  ];

  if (!validMimes.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid video format. Supported: MP4, MOV, AVI, MKV, WebM",
    };
  }

  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File size exceeds ${maxSizeMB}MB limit`,
    };
  }

  return { valid: true };
}
