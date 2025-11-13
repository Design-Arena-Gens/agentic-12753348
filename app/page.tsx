'use client';

import { useState } from 'react';
import DomainInput from './components/DomainInput';
import KeywordResults from './components/KeywordResults';
import AIVisibility from './components/AIVisibility';
import { Search } from 'lucide-react';

export default function Home() {
  const [domain, setDomain] = useState('');
  const [activeTab, setActiveTab] = useState<'google' | 'ai'>('google');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = (inputDomain: string) => {
    setDomain(inputDomain);
    setIsAnalyzing(true);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Search className="w-12 h-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">
              Keyword Rank & Visibility Tracker
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Track organic rankings and AI search visibility across Google, Perplexity, ChatGPT, and Gemini
          </p>
        </header>

        <DomainInput onAnalyze={handleAnalyze} isLoading={isAnalyzing} />

        {domain && (
          <>
            <div className="flex justify-center mb-6 space-x-4">
              <button
                onClick={() => setActiveTab('google')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === 'google'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Google SERP Tracking
              </button>
              <button
                onClick={() => setActiveTab('ai')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === 'ai'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                AI Visibility Monitoring
              </button>
            </div>

            {activeTab === 'google' ? (
              <KeywordResults domain={domain} setIsAnalyzing={setIsAnalyzing} />
            ) : (
              <AIVisibility domain={domain} setIsAnalyzing={setIsAnalyzing} />
            )}
          </>
        )}
      </div>
    </main>
  );
}
