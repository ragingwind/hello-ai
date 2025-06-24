'use client';

import { Copy, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface SummaryResultProps {
  summary: string;
  url: string;
}

export function SummaryResult({ summary, url }: SummaryResultProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
  };

  return (
    <Card className="w-full overflow-scroll max-h-[400px]">
      <CardHeader>
        <CardTitle className="text-xl">Summary</CardTitle>
        <CardDescription>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm hover:underline"
          >
            {url} <ExternalLink className="w-3 h-3" />
          </a>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ReactMarkdown>{summary}</ReactMarkdown>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button variant="outline" size="sm" onClick={handleCopy}>
          <Copy className="w-4 h-4 mr-2" />
          Copy
        </Button>
      </CardFooter>
    </Card>
  );
}
