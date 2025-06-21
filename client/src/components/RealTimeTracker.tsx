"use client";

import { useState, useEffect } from "react";

interface ClickEvent {
  id: string;
  shortCode: string;
  timestamp: string;
  userAgent: string;
  ipAddress: string;
}

interface RealTimeTrackerProps {
  topUrls: Array<{
    shortCode: string;
    originalUrl: string;
    shortUrl: string;
    clickCount: number;
    createdAt: string;
  }>;
}

export default function RealTimeTracker({ topUrls }: RealTimeTrackerProps) {
  const [recentClicks, setRecentClicks] = useState<ClickEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Simulate real-time click tracking
    // In a real implementation, this would use WebSockets or Server-Sent Events
    const interval = setInterval(() => {
      // Simulate random clicks
      if (topUrls.length > 0 && Math.random() > 0.7) {
        const randomUrl = topUrls[Math.floor(Math.random() * topUrls.length)];
        const newClick: ClickEvent = {
          id: Date.now().toString(),
          shortCode: randomUrl.shortCode,
          timestamp: new Date().toISOString(),
          userAgent:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        };

        setRecentClicks((prev) => [newClick, ...prev.slice(0, 9)]); // Keep last 10
      }
    }, 3000); // Check every 3 seconds

    setIsConnected(true);

    return () => {
      clearInterval(interval);
      setIsConnected(false);
    };
  }, [topUrls]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Real-Time Activity
        </h3>
        <div className="flex items-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          ></div>
          <span className="text-sm text-gray-500">
            {isConnected ? "Live" : "Disconnected"}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {recentClicks.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <p className="text-gray-500">Waiting for clicks...</p>
          </div>
        ) : (
          recentClicks.map((click) => (
            <div
              key={click.id}
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">
                    {click.shortCode}
                  </span>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-500">
                    {new Date(click.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {click.ipAddress} • {click.userAgent.substring(0, 30)}...
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-sm text-gray-500">
          <span>Total clicks today: {recentClicks.length}</span>
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
}
