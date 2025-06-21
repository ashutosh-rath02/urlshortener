"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface AnalyticsDashboardProps {
  summary: {
    totalUrls: number;
    totalClicks: number;
    activeUrlCount: number;
    expiredUrlCount: number;
    averageClicksPerUrl: number;
  };
  topUrls: Array<{
    shortCode: string;
    originalUrl: string;
    shortUrl: string;
    clickCount: number;
    createdAt: string;
  }>;
  clicksByDateRange: Array<{
    date: string;
    clicks: number;
  }>;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function AnalyticsDashboard({
  summary,
  topUrls,
  clicksByDateRange,
}: AnalyticsDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("7d");

  // Use data from props
  const { totalClicks, totalUrls, activeUrlCount, averageClicksPerUrl } =
    summary;

  // Click distribution data for pie chart
  const clickDistribution = [
    {
      name: "Top 20% URLs",
      value: topUrls
        .slice(0, Math.ceil(topUrls.length * 0.2))
        .reduce((sum, url) => sum + url.clickCount, 0),
    },
    {
      name: "Other URLs",
      value:
        totalClicks -
        topUrls
          .slice(0, Math.ceil(topUrls.length * 0.2))
          .reduce((sum, url) => sum + url.clickCount, 0),
    },
  ];

  // Performance by URL (bar chart)
  const performanceData = topUrls.slice(0, 5).map((url) => ({
    name: url.shortCode,
    clicks: url.clickCount,
    url: url.originalUrl.substring(0, 30) + "...",
  }));

  // Use actual clicks by date range data
  const recentActivity =
    clicksByDateRange.length > 0
      ? clicksByDateRange.slice(-7).map((item) => ({
          date: new Date(item.date).toLocaleDateString("en-US", {
            weekday: "short",
          }),
          clicks: item.clicks,
        }))
      : [
          { date: "Mon", clicks: 12 },
          { date: "Tue", clicks: 19 },
          { date: "Wed", clicks: 15 },
          { date: "Thu", clicks: 25 },
          { date: "Fri", clicks: 22 },
          { date: "Sat", clicks: 18 },
          { date: "Sun", clicks: 14 },
        ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Analytics Dashboard
        </h2>
        <div className="flex space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 border-b border-gray-200">
        {[
          { id: "overview", label: "Overview" },
          { id: "performance", label: "Performance" },
          { id: "urls", label: "URL Details" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === tab.id
                ? "bg-blue-500 text-white"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
              <div className="text-2xl font-bold">{totalClicks}</div>
              <div className="text-blue-100">Total Clicks</div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
              <div className="text-2xl font-bold">{totalUrls}</div>
              <div className="text-green-100">Total URLs</div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
              <div className="text-2xl font-bold">{activeUrlCount}</div>
              <div className="text-purple-100">Active URLs</div>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
              <div className="text-2xl font-bold">{averageClicksPerUrl}</div>
              <div className="text-orange-100">Avg Clicks/URL</div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Click Distribution */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Click Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={clickDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({
                      name,
                      percent,
                    }: {
                      name: string;
                      percent: number;
                    }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {clickDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={recentActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="clicks"
                    stroke="#8884d8"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === "performance" && (
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Top Performing URLs</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="clicks" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* URLs Tab */}
      {activeTab === "urls" && (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Short Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Original URL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clicks
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topUrls.map((url) => (
                  <tr key={url.shortCode} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {url.shortCode}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">
                      {url.originalUrl}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {url.clickCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(url.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
