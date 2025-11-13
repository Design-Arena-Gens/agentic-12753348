'use client';

import { useEffect, useState } from 'react';
import { ArrowUp, ArrowDown, Minus, ExternalLink, TrendingUp, Download } from 'lucide-react';
import useSWR from 'swr';

interface KeywordData {
  keyword: string;
  position: number;
  url: string;
  searchVolume: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

interface KeywordResultsProps {
  domain: string;
  setIsAnalyzing: (val: boolean) => void;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function KeywordResults({ domain, setIsAnalyzing }: KeywordResultsProps) {
  const [sortBy, setSortBy] = useState<'position' | 'volume'>('position');
  const [filterPosition, setFilterPosition] = useState<number>(100);

  const { data, error, isLoading } = useSWR(
    domain ? `/api/keywords?domain=${encodeURIComponent(domain)}` : null,
    fetcher
  );

  useEffect(() => {
    setIsAnalyzing(isLoading);
  }, [isLoading, setIsAnalyzing]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-12 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
        <p className="text-red-800 font-semibold">Error loading keyword data</p>
        <p className="text-red-600 text-sm mt-2">Please try again later</p>
      </div>
    );
  }

  const keywords: KeywordData[] = data?.keywords || [];

  const filteredKeywords = keywords
    .filter(k => k.position <= filterPosition)
    .sort((a, b) => {
      if (sortBy === 'position') return a.position - b.position;
      return b.searchVolume - a.searchVolume;
    });

  const exportToCSV = () => {
    const headers = ['Keyword', 'Position', 'URL', 'Search Volume', 'Trend', 'Change'];
    const rows = filteredKeywords.map(k => [
      k.keyword,
      k.position,
      k.url,
      k.searchVolume,
      k.trend,
      k.change
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${domain}-keywords.csv`;
    a.click();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Keyword Rankings</h2>
          <p className="text-gray-600 mt-1">
            Tracking {filteredKeywords.length} keywords for {domain}
          </p>
        </div>

        <div className="flex gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'position' | 'volume')}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500"
          >
            <option value="position">Sort by Position</option>
            <option value="volume">Sort by Volume</option>
          </select>

          <select
            value={filterPosition}
            onChange={(e) => setFilterPosition(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500"
          >
            <option value={10}>Top 10</option>
            <option value={20}>Top 20</option>
            <option value={50}>Top 50</option>
            <option value={100}>Top 100</option>
          </select>

          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">Avg Position</span>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-900 mt-2">
            {filteredKeywords.length > 0
              ? Math.round(filteredKeywords.reduce((sum, k) => sum + k.position, 0) / filteredKeywords.length)
              : 0}
          </p>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-green-900">Top 10 Rankings</span>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-900 mt-2">
            {filteredKeywords.filter(k => k.position <= 10).length}
          </p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-purple-900">Total Volume</span>
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-900 mt-2">
            {filteredKeywords.reduce((sum, k) => sum + k.searchVolume, 0).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Keyword
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Position
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Trend
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Volume
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                URL
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredKeywords.map((keyword, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4 text-sm font-medium text-gray-900">
                  {keyword.keyword}
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    keyword.position <= 3
                      ? 'bg-green-100 text-green-800'
                      : keyword.position <= 10
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    #{keyword.position}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1">
                    {keyword.trend === 'up' && (
                      <>
                        <ArrowUp className="w-4 h-4 text-green-600" />
                        <span className="text-xs text-green-600">+{keyword.change}</span>
                      </>
                    )}
                    {keyword.trend === 'down' && (
                      <>
                        <ArrowDown className="w-4 h-4 text-red-600" />
                        <span className="text-xs text-red-600">-{keyword.change}</span>
                      </>
                    )}
                    {keyword.trend === 'stable' && (
                      <Minus className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-600">
                  {keyword.searchVolume.toLocaleString()}
                </td>
                <td className="px-4 py-4 text-sm">
                  <a
                    href={keyword.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1 truncate max-w-xs"
                  >
                    {keyword.url.replace(/^https?:\/\//, '').substring(0, 50)}
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
