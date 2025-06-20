"use client";

import { useState, useEffect } from "react";
import UrlShortenerForm from "@/components/UrlShortenerForm";
import UrlList from "@/components/UrlList";
import Header from "@/components/Header";

export default function Home() {
  const [urls, setUrls] = useState<
    Array<{
      id: string;
      originalUrl: string;
      shortUrl: string;
      createdAt: string;
      clicks: number;
    }>
  >([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleUrlCreated = (newUrl: {
    id: string;
    originalUrl: string;
    shortUrl: string;
    createdAt: string;
    clicks: number;
  }) => {
    setUrls((prev) => [newUrl, ...prev]);
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-pulse">
          <div className="h-16 bg-white shadow-sm border-b border-gray-200"></div>
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="h-10 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
              <div className="h-96 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              URL Shortener
            </h1>
            <p className="text-xl text-gray-600">
              Create short, memorable links for your long URLs
            </p>
          </div>

          <UrlShortenerForm onUrlCreated={handleUrlCreated} />

          {urls.length > 0 && (
            <div className="mt-12">
              <UrlList urls={urls} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
