"use client"

import { Card } from "@/components/card"
import cards from "./examples/manifest.json"

export default function Home() {
  return (
    <main className="container px-4 py-8 mx-auto">
      <h1 className="mb-8 text-3xl font-bold text-center">Hello AI</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, key) => (
          <Card key={key} title={card.title} description={card.description} icon={card.icon} />
        ))}
      </div>
    </main>
  )
}
