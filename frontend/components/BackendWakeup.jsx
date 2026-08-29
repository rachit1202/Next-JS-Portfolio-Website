'use client';
import { useEffect } from 'react';

// Silently pre-warms the Render backend as soon as any page loads.
// Uses exponential back-off retries until the backend responds.
// This ensures Render's cold-start completes in the background
// so subsequent API calls (navigation, form submit) are instant.
export default function BackendWakeup() {
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const healthUrl = `${apiUrl}/health`;

    let attempt = 0;
    const maxAttempts = 6;
    const delays = [0, 3000, 6000, 10000, 15000, 20000]; // ms between retries

    const ping = () => {
      if (attempt >= maxAttempts) return;

      const delay = delays[attempt] || 20000;
      attempt++;

      setTimeout(() => {
        const controller = new AbortController();
        const t = setTimeout(() => controller.abort(), 8000);

        fetch(healthUrl, { method: 'GET', cache: 'no-store', signal: controller.signal })
          .then(() => {
            clearTimeout(t);
            console.log(`[BackendWakeup] Backend warm ✓ (attempt ${attempt})`);
          })
          .catch(() => {
            clearTimeout(t);
            // Backend still cold — retry
            ping();
          });
      }, delay);
    };

    ping();
  }, []);

  return null;
}
