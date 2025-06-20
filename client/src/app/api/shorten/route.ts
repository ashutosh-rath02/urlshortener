import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { originalUrl } = body;

    if (!originalUrl) {
      return NextResponse.json(
        { error: "Original URL is required" },
        { status: 400 }
      );
    }

    // Validate URL
    try {
      new URL(originalUrl);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    // TODO: Connect to your backend API
    // For now, we'll return a mock response
    // In production, this would call your Node.js backend

    // Use crypto.randomBytes for better randomness and consistency
    const shortCode = randomBytes(3).toString("hex");
    const shortUrl = `${request.nextUrl.origin}/s/${shortCode}`;

    const response = {
      id: Date.now().toString(),
      originalUrl,
      shortUrl,
      createdAt: new Date().toISOString(),
      clicks: 0,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error shortening URL:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
