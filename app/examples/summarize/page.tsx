'use client';

import { Search } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { type LLMConfig, LLMStorage } from '../../lib/llm-storage';
import { ModelSelector } from './model-selector';
import { SummaryResult } from './summary-result';

export default function Home() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsLoading(true);
    setSummary('');

    try {
      const scrapeRes = await fetch(`/api/scrape?url=${encodeURIComponent(url)}`);
      if (!scrapeRes.ok) {
        throw new Error('Failed to scrape webpage');
      }

      const content = await scrapeRes.text();

      const summaryRes = await fetch(`/api/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          config: LLMStorage.getLLMConfig(),
          text: content,
        }),
      });

      if (!summaryRes.ok) {
        throw new Error('Failed to generate summary');
      }

      const summaryText = await summaryRes.text();

      setSummary(summaryText);
      setIsLoading(false);
    } catch (error) {
      console.error('Error summarizing URL:', error);
      setIsLoading(false);
      setSummary(generateErrorSummary(error, LLMStorage.getLLMConfig() ?? undefined));
    }
  };

  return (
    <main className="flex flex-col items-center min-h-screen px-4 py-12 md:py-24">
      <div className="w-full max-w-3xl space-y-8">
        <div className="absolute top-4 right-4">
          <ModelSelector />
        </div>

        <div className="flex flex-col items-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Summarization Web Content</h1>
          <h3>
            Powered by <b>Puppeteer</b>
          </h3>
          <p className="text-center text-muted-foreground">
            Enter a URL to get an AI-generated summary of its content
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex items-center w-full space-x-2">
          <div className="relative flex-1">
            <Input
              type="url"
              placeholder="https://example.com"
              className="h-12 pr-10"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          <Button type="submit" size="lg" disabled={isLoading} className="h-12">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current rounded-full animate-spin border-t-transparent" />
                Summarizing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                Summarize
              </span>
            )}
          </Button>
        </form>

        {summary && <SummaryResult summary={summary} url={url} />}
      </div>
    </main>
  );
}

function generateErrorSummary(error: unknown, llmConfig?: LLMConfig): string {
  return `**Error**: ${error instanceof Error ? error.message : 'Unknown error occurred'}

**Configuration**:

⋅ Provider: ${llmConfig?.provider || 'Not configured'}
⋅ Model ID: ${llmConfig?.modelId || 'Not configured'}
⋅ API Key Status: ${llmConfig?.apiKey ? 'Configured' : 'Not configured'}
⋅ Base URL: ${llmConfig?.baseURL || 'Not configured'}
`;
}
