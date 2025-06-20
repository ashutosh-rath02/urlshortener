import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  try {
    const { shortCode } = await params;

    if (!shortCode) {
      return NextResponse.json(
        { error: "Short code is required" },
        { status: 400 }
      );
    }

    // Call the backend API to get the original URL
    const backendUrl = process.env.BACKEND_URL || "http://localhost:3000";
    const response = await fetch(`${backendUrl}/api/urls/${shortCode}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: "Short URL not found" },
          { status: 404 }
        );
      }

      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error || "Failed to redirect" },
        { status: response.status }
      );
    }

    // The backend performs a redirect, so we need to get the Location header
    const originalUrl = response.headers.get("location");

    if (originalUrl) {
      return NextResponse.json({ originalUrl });
    } else {
      // If no redirect header, try to get URL info instead
      const infoResponse = await fetch(
        `${backendUrl}/api/urls/${shortCode}/info`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (infoResponse.ok) {
        const data = await infoResponse.json();
        if (data.success && data.data && data.data.originalUrl) {
          return NextResponse.json({ originalUrl: data.data.originalUrl });
        }
      }

      return NextResponse.json(
        { error: "Could not retrieve original URL" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error redirecting URL:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
