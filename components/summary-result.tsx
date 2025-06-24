"use client"

import { Copy, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface SummaryResultProps {
  summary: string
  url: string
}

export function SummaryResult({ summary, url }: SummaryResultProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(summary)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Summary</CardTitle>
        <CardDescription>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm hover:underline"
          >
            {url} <ExternalLink className="h-3 w-3" />
          </a>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap">{summary}</p>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button variant="outline" size="sm" onClick={handleCopy}>
          <Copy className="mr-2 h-4 w-4" />
          Copy
        </Button>
      </CardFooter>
    </Card>
  )
}
