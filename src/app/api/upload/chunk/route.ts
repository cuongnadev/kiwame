import path from "path";
import { existsSync } from "fs";
import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";

const TEMP_DIR = path.join(process.cwd(), 'public/temp-chunks');

export async function POST(req: Request) {
  try {
    if (!existsSync(TEMP_DIR)) {
      await mkdir(TEMP_DIR, { recursive: true });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const uploadId = formData.get('upload_id') as string;
    const chunkIndex = formData.get('chunk_index') as string;
    const totalChunks = formData.get('total_chunks') as string;

    if (!file || !uploadId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const uploadDir = path.join(TEMP_DIR, uploadId);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const chunkPath = path.join(uploadDir, `chunk-${chunkIndex}`);
    const bytes = await file.arrayBuffer();
    await writeFile(chunkPath, Buffer.from(bytes));

    return NextResponse.json(
      {
        message: 'Chunk uploaded successfully',
        chunkIndex: parseInt(chunkIndex),
        totalChunks: parseInt(totalChunks),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload chunk error: " + error)
    return NextResponse.json(
      { error: "Upload chunk failed", details: String(error) },
      { status: 500 }
    );
  }
}

