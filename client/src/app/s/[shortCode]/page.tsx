"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function RedirectPage() {
  const params = useParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const shortCode = params.shortCode as string;

    if (!shortCode) {
      setError("Invalid short code");
      return;
    }

    // TODO: Call your backend API to get the original URL
    // For now, we'll simulate a redirect
    const redirectToOriginal = async () => {
      try {
        // In production, this would call your backend API
        // const response = await fetch(`/api/redirect/${shortCode}`);
        // const data = await response.json();

        // For demo purposes, redirect to a sample URL
        setTimeout(() => {
          window.location.href = "https://example.com";
        }, 2000);
      } catch {
        setError("Failed to redirect");
      }
    };

    redirectToOriginal();
  }, [params.shortCode]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Redirect Error
          </h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Redirecting...
        </h1>
        <p className="text-gray-600">
          You are being redirected to the original URL
        </p>
      </div>
    </div>
  );
}
