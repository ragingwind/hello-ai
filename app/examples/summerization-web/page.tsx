'use client'

import styles from '../../page.module.css';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function Home() {
  const params = useSearchParams();

  useEffect(() => {
    const getMessage = async () => {
      const url = params.get('url') || 'https://example.com';

      const res = await fetch(`/api?url=${encodeURIComponent(url as string)}`, {
        method: 'GET',
        
        // headers: {
        //   'Content-Type': 'application/json'
        // },
        // body: JSON.stringify({
        //   messages: [
        //     {
        //       role: 'user',
        //       content: [
        //         { type: 'text', text: 'Hello, describe your self' },
        //       ],
        //     },
        //   ]
        // })
      });

      if (!res.ok) {
        console.error('Failed to fetch message');
        return;
      }
      console.log(await res.text());
    }

    getMessage();
  }, [params]);

  return (
    <div className={styles.container}>
      {/* Your component JSX */}
    </div>
  );
}
