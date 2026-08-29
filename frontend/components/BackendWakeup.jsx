'use client';
import { useEffect } from 'react';

// Silently pre-warms the Render backend as soon as any page loads.
// This triggers Render's cold-start spin-up process early so the user
// doesn't wait when they actually click something that needs the API.
export default function BackendWakeup() {
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const healthUrl = `${apiUrl}/health`;

    fetch(healthUrl, { method: 'GET', cache: 'no-store' })
      .then(() => console.log('[BackendWakeup] Backend is warm ✓'))
      .catch(() => {
        // Server was cold — retry after 3 seconds
        setTimeout(() => {
          fetch(healthUrl, { method: 'GET', cache: 'no-store' }).catch(() => {});
        }, 3000);
      });
  }, []);

  return null;
}
