'use client';

import { createContext, useContext, useEffect, useRef, ReactNode } from 'react';
import { useAuth } from '@/lib/context/AuthContext';

// Lazy import so the module isn't loaded on the server
let echoInstance: import('laravel-echo').default | null = null;

async function createEcho() {
  if (echoInstance) return echoInstance;

  const [{ default: Echo }, Pusher] = await Promise.all([
    import('laravel-echo'),
    import('pusher-js'),
  ]);

  // Laravel Echo expects Pusher on window when using the pusher connector
  (window as any).Pusher = Pusher.default ?? Pusher;

  echoInstance = new Echo({
    broadcaster: 'reverb',
    key: process.env.NEXT_PUBLIC_REVERB_APP_KEY!,
    wsHost: process.env.NEXT_PUBLIC_REVERB_HOST ?? 'localhost',
    wsPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT ?? 8080),
    wssPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT ?? 8080),
    forceTLS: (process.env.NEXT_PUBLIC_REVERB_SCHEME ?? 'http') === 'https',
    enabledTransports: ['ws', 'wss'],
    disableStats: true,
  });

  return echoInstance;
}

interface EchoContextValue {
  getEcho: () => Promise<import('laravel-echo').default | null>;
}

const EchoContext = createContext<EchoContextValue>({
  getEcho: async () => null,
});

export function useEcho() {
  return useContext(EchoContext);
}

export function EchoProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const initialized = useRef(false);

  useEffect(() => {
    if (!user) {
      // Disconnect and clear when user logs out
      if (echoInstance) {
        echoInstance.disconnect();
        echoInstance = null;
        initialized.current = false;
      }
      return;
    }

    if (initialized.current) return;
    initialized.current = true;

    createEcho().catch(console.error);

    return () => {
      // Keep connection alive across re-renders; disconnect only on logout
    };
  }, [user]);

  const getEcho = async () => {
    if (!user) return null;
    return createEcho();
  };

  return (
    <EchoContext.Provider value={{ getEcho }}>
      {children}
    </EchoContext.Provider>
  );
}
