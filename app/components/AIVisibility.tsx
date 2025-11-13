'use client';

import { useEffect, useState } from 'react';
import { Bot, CheckCircle, XCircle, AlertCircle, ExternalLink } from 'lucide-react';
import useSWR from 'swr';

interface AIEngineResult {
  engine: string;
  found: boolean;
  citations: number;
  snippet: string;
  url: string;
  position: number;
  confidence: number;
}

interface AIVisibilityProps {
  domain: string;
  setIsAnalyzing: (val: boolean) => void;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AIVisibility({ domain, setIsAnalyzing }: AIVisibilityProps) {
  const [selectedEngine, setSelectedEngine] = useState<string | null>(null);

  const { data, error, isLoading } = useSWR(
    domain ? `/api/ai-visibility?domain=${encodeURIComponent(domain)}` : null,
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
        <p className="text-red-800 font-semibold">Error loading AI visibility data</p>
        <p className="text-red-600 text-sm mt-2">Please try again later</p>
      </div>
    );
  }

  const results: AIEngineResult[] = data?.results || [];

  const getEngineIcon = (engine: string) => {
    const icons: Record<string, string> = {
      'Perplexity': '🔮',
      'ChatGPT': '💬',
      'Gemini': '✨',
      'Claude': '🤖'
    };
    return icons[engine] || '🤖';
  };

  const getStatusColor = (found: boolean) => {
    return found ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200';
  };

  const totalCitations = results.reduce((sum, r) => sum + r.citations, 0);
  const visibleEngines = results.filter(r => r.found).length;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">AI Search Visibility</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-purple-900">Engines Visible</span>
              <Bot className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-purple-900 mt-2">
              {visibleEngines} / {results.length}
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900">Total Citations</span>
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-900 mt-2">
              {totalCitations}
            </p>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-900">Avg Confidence</span>
              <AlertCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-900 mt-2">
              {results.length > 0
                ? Math.round(results.reduce((sum, r) => sum + r.confidence, 0) / results.length)
                : 0}%
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map((result, index) => (
            <div
              key={index}
              className={`border-2 rounded-lg p-6 transition-all cursor-pointer hover:shadow-md ${
                getStatusColor(result.found)
              } ${selectedEngine === result.engine ? 'ring-2 ring-purple-500' : ''}`}
              onClick={() => setSelectedEngine(selectedEngine === result.engine ? null : result.engine)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{getEngineIcon(result.engine)}</span>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{result.engine}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {result.found ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-700 font-medium">Visible</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600 font-medium">Not Found</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {result.found && (
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600">{result.citations}</div>
                    <div className="text-xs text-gray-600">Citations</div>
                  </div>
                )}
              </div>

              {result.found && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Position</span>
                    <span className="font-semibold text-gray-900">#{result.position}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Confidence</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-600 transition-all"
                          style={{ width: `${result.confidence}%` }}
                        />
                      </div>
                      <span className="font-semibold text-gray-900">{result.confidence}%</span>
                    </div>
                  </div>

                  {selectedEngine === result.engine && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-700 mb-3">
                        {result.snippet}
                      </p>
                      <a
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View source
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Visibility Timeline</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          <p>Timeline visualization coming soon</p>
        </div>
      </div>
    </div>
  );
}
