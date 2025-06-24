'use client';

import { Card } from '@/components/card';
import { examples } from './examples/manifest.json';

console.log('Loaded examples:', examples);

export default function Home() {
  return (
    <main className="container px-4 py-8 mx-auto">
      <h1 className="mb-8 text-3xl font-bold text-center">Hello AI</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {examples.map((example) => (
          <Card
            key={example.id}
            title={example.name}
            description={example.description}
            icon={example.icon}
            path={example.path}
          />
        ))}
      </div>
    </main>
  );
}
