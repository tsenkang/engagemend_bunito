import { useEffect, useLayoutEffect } from 'react';

/**
 * `useLayoutEffect` avisa no console quando roda na renderização do
 * servidor. No servidor não há layout para medir, então cai para
 * `useEffect` e o aviso some.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;
