import { useLayoutEffect, useEffect } from 'react';

// Create a safe version of useLayoutEffect that falls back to useEffect during SSR
export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect; 