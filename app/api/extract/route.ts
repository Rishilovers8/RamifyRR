import { NextRequest, NextResponse } from "next/server";
import { extractVideoMetadata } from "@/lib/video-extractor";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "100mb",
    },
  },
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const validVideoMimes = [
      "video/mp4",
      "video/mpeg",
      "video/quicktime",
      "video/x-msvideo",
      "video/x-matroska",
      "video/webm",
    ];

    if (!validVideoMimes.includes(file.type)) {
      return NextResponse.json(
        {
          error: `Invalid file type. Supported formats: MP4, MOV, AVI, MKV, WebM`,
        },
        { status: 400 }
      );
    }

    // Validate file size (max 500MB)
    const MAX_FILE_SIZE = 500 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 500MB limit" },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const buffer = await file.arrayBuffer();
    const videoBuffer = Buffer.from(buffer);

    // Extract metadata
    const metadata = await extractVideoMetadata(videoBuffer, file.name);

    return NextResponse.json(
      {
        success: true,
        metadata,
        file: {
          name: file.name,
          size: file.size,
          type: file.type,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Video extraction error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error during extraction";

    return NextResponse.json(
      {
        error: "Failed to extract video metadata",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
