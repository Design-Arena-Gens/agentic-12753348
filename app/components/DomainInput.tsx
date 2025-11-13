'use client';

import { useState } from 'react';
import { Globe, Loader2 } from 'lucide-react';

interface DomainInputProps {
  onAnalyze: (domain: string) => void;
  isLoading: boolean;
}

export default function DomainInput({ onAnalyze, isLoading }: DomainInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [region, setRegion] = useState('US');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const cleanDomain = inputValue.trim().replace(/^https?:\/\//, '').replace(/\/$/, '');
      onAnalyze(cleanDomain);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-2">
              Target Domain
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="domain"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="example.com"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-2">
              Target Region
            </label>
            <select
              id="region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              disabled={isLoading}
            >
              <option value="US">United States</option>
              <option value="UK">United Kingdom</option>
              <option value="CA">Canada</option>
              <option value="AU">Australia</option>
              <option value="Global">Global</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={!inputValue.trim() || isLoading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin mr-2 w-5 h-5" />
              Analyzing...
            </>
          ) : (
            'Analyze Domain'
          )}
        </button>
      </form>
    </div>
  );
}
