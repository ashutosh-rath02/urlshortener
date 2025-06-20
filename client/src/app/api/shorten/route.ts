import { NextRequest, NextResponse } from "next/server";

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

    // Call the backend API to create the short URL
    const backendUrl = process.env.BACKEND_URL || "http://localhost:3000";
    const response = await fetch(`${backendUrl}/api/urls`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ originalUrl }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error || "Failed to create short URL" },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Transform backend response to match frontend expectations
    const shortUrl = `${request.nextUrl.origin}/s/${data.data.shortCode}`;

    return NextResponse.json({
      id: data.data.id,
      originalUrl: data.data.originalUrl,
      shortUrl,
      createdAt: data.data.createdAt,
      clicks: data.data.clicks || 0,
    });
  } catch (error) {
    console.error("Error shortening URL:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
