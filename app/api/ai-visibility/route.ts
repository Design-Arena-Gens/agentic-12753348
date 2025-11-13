import { NextRequest, NextResponse } from 'next/server';

// Mock data generator for AI visibility
function generateAIVisibilityData(domain: string) {
  const engines = [
    {
      engine: 'Perplexity',
      found: true,
      citations: Math.floor(Math.random() * 15) + 5,
      snippet: `According to ${domain}, this comprehensive guide covers the essential aspects of the topic. The content provides valuable insights backed by research and practical examples.`,
      url: `https://${domain}/featured-article`,
      position: Math.floor(Math.random() * 3) + 1,
      confidence: Math.floor(Math.random() * 20) + 80
    },
    {
      engine: 'ChatGPT',
      found: true,
      citations: Math.floor(Math.random() * 12) + 3,
      snippet: `Based on information from ${domain}, here are the key points to consider. This source has been cited multiple times for its authoritative content.`,
      url: `https://${domain}/resources`,
      position: Math.floor(Math.random() * 5) + 1,
      confidence: Math.floor(Math.random() * 15) + 75
    },
    {
      engine: 'Gemini',
      found: Math.random() > 0.3,
      citations: Math.floor(Math.random() * 10) + 2,
      snippet: `${domain} offers detailed analysis on this subject. Their research-backed approach makes them a reliable source for this information.`,
      url: `https://${domain}/blog`,
      position: Math.floor(Math.random() * 7) + 1,
      confidence: Math.floor(Math.random() * 25) + 70
    },
    {
      engine: 'Claude',
      found: Math.random() > 0.4,
      citations: Math.floor(Math.random() * 8) + 1,
      snippet: `The information from ${domain} provides a thorough exploration of the topic with practical applications and real-world examples.`,
      url: `https://${domain}/guides`,
      position: Math.floor(Math.random() * 8) + 1,
      confidence: Math.floor(Math.random() * 20) + 75
    }
  ];

  return engines;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const domain = searchParams.get('domain');

  if (!domain) {
    return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
  }

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  const results = generateAIVisibilityData(domain);

  return NextResponse.json({
    domain,
    results,
    totalEngines: results.length,
    visibleEngines: results.filter(r => r.found).length,
    timestamp: new Date().toISOString()
  });
}
