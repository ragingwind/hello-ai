'use client'

import styles from './page.module.css';
import { useEffect } from 'react';

export default function Home() {

  useEffect(() => {
    const getMessage = async () => {
      const res = await fetch('/api', {
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
        return
      }
      console.log(await res.text());
    }

    getMessage();
  }, []);

  return (
    <main className={styles.main}>
    </main>
  );
}
