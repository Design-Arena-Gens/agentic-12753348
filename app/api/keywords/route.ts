import { NextRequest, NextResponse } from 'next/server';

// Mock data generator for keyword rankings
function generateKeywordData(domain: string) {
  const keywords = [
    'digital marketing', 'seo services', 'content marketing', 'social media marketing',
    'email marketing', 'ppc advertising', 'marketing automation', 'conversion optimization',
    'web analytics', 'brand strategy', 'influencer marketing', 'video marketing',
    'mobile marketing', 'marketing analytics', 'customer retention', 'lead generation',
    'marketing software', 'growth hacking', 'viral marketing', 'content strategy',
    'marketing tools', 'online advertising', 'search engine marketing', 'display advertising',
    'remarketing', 'marketing campaigns', 'customer acquisition', 'marketing metrics',
    'b2b marketing', 'b2c marketing', 'affiliate marketing', 'referral marketing',
    'marketing funnel', 'customer journey', 'marketing roi', 'brand awareness',
    'marketing budget', 'competitive analysis', 'market research', 'target audience',
    'buyer persona', 'marketing plan', 'promotional strategy', 'product launch',
    'marketing channels', 'omnichannel marketing', 'personalization', 'marketing segmentation',
    'customer engagement', 'marketing trends', 'digital strategy', 'online branding',
    'ecommerce marketing', 'local seo', 'voice search optimization', 'featured snippets',
    'backlink strategy', 'keyword research', 'on-page seo', 'technical seo',
    'content optimization', 'link building', 'domain authority', 'page speed optimization',
    'mobile optimization', 'user experience', 'landing page design', 'call to action',
    'conversion rate', 'bounce rate', 'engagement metrics', 'traffic analysis',
    'organic traffic', 'paid traffic', 'referral traffic', 'social traffic',
    'direct traffic', 'click through rate', 'cost per click', 'cost per acquisition',
    'return on ad spend', 'lifetime value', 'churn rate', 'retention rate',
    'marketing attribution', 'multi-touch attribution', 'first-click attribution', 'last-click attribution',
    'marketing mix modeling', 'predictive analytics', 'machine learning marketing', 'ai marketing',
    'chatbot marketing', 'conversational marketing', 'account based marketing', 'demand generation',
    'inbound marketing', 'outbound marketing', 'content distribution', 'syndication',
    'guest posting', 'public relations', 'press release', 'media outreach',
    'crisis management', 'reputation management', 'online reviews', 'testimonials'
  ];

  const trends: ('up' | 'down' | 'stable')[] = ['up', 'down', 'stable'];

  return keywords.slice(0, 50).map((keyword, index) => ({
    keyword,
    position: index + 1 + Math.floor(Math.random() * 5),
    url: `https://${domain}/${keyword.replace(/\s+/g, '-').toLowerCase()}`,
    searchVolume: Math.floor(Math.random() * 50000) + 1000,
    trend: trends[Math.floor(Math.random() * trends.length)],
    change: Math.floor(Math.random() * 10) + 1
  }));
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const domain = searchParams.get('domain');

  if (!domain) {
    return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
  }

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const keywords = generateKeywordData(domain);

  return NextResponse.json({
    domain,
    keywords,
    totalKeywords: keywords.length,
    timestamp: new Date().toISOString()
  });
}
