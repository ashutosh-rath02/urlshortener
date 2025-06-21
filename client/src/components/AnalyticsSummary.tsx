"use client";

import { useState, useEffect } from "react";

interface AnalyticsSummaryProps {
  summary: {
    totalUrls: number;
    totalClicks: number;
    activeUrlCount: number;
    expiredUrlCount: number;
    averageClicksPerUrl: number;
  };
}

export default function AnalyticsSummary({ summary }: AnalyticsSummaryProps) {
  const [timeRange, setTimeRange] = useState("7d");

  // Use data from summary prop
  const { totalClicks, totalUrls, activeUrlCount, averageClicksPerUrl } =
    summary;

  // Calculate growth (simulated)
  const [growthRate, setGrowthRate] = useState(0);

  useEffect(() => {
    // Simulate growth rate calculation
    const rate = Math.random() * 100 - 50; // -50% to +50%
    setGrowthRate(rate);
  }, [summary]);

  const metrics = [
    {
      label: "Total Clicks",
      value: totalClicks.toLocaleString(),
      change: growthRate,
      color: "blue",
      icon: (
        <svg
          className="w-6 h-6"
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
      ),
    },
    {
      label: "Total URLs",
      value: totalUrls,
      change: 0,
      color: "green",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          />
        </svg>
      ),
    },
    {
      label: "Active URLs",
      value: activeUrlCount,
      change: 0,
      color: "purple",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      label: "Avg Clicks/URL",
      value: averageClicksPerUrl.toFixed(1),
      change: 0,
      color: "orange",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "from-blue-500 to-blue-600",
      green: "from-green-500 to-green-600",
      purple: "from-purple-500 to-purple-600",
      orange: "from-orange-500 to-orange-600",
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Analytics Summary
        </h3>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div
                className={`w-10 h-10 bg-gradient-to-r ${getColorClasses(
                  metric.color
                )} rounded-lg flex items-center justify-center text-white`}
              >
                {metric.icon}
              </div>
              {metric.change !== 0 && (
                <span
                  className={`text-xs font-medium ${
                    metric.change > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {metric.change > 0 ? "+" : ""}
                  {metric.change.toFixed(1)}%
                </span>
              )}
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {metric.value}
            </div>
            <div className="text-sm text-gray-500">{metric.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Last updated: {new Date().toLocaleString()}</span>
          <span>Data from: {timeRange}</span>
        </div>
      </div>
    </div>
  );
}
