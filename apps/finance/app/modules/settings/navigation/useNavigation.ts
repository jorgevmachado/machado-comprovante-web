'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { useLoading } from '@machado-repo/ui';

export default function useNavigation() {
  const router = useRouter();
  const { startPageRender } = useLoading();

  const push = useCallback(
    (href: string) => {
      console.log('START NAVIGATION');
      console.log({ href });
      startPageRender();
      console.log('PAGE RENDER STARTED');
      router.push(href);
    },
    [router, startPageRender],
  );

  const replace = useCallback(
    (href: string) => {
      startPageRender();
      router.replace(href);
    },
    [router, startPageRender],
  );

  const back = useCallback(() => {
    startPageRender();
    router.back();
  }, [router, startPageRender]);

  const forward = useCallback(() => {
    startPageRender();
    router.forward();
  }, [router, startPageRender]);

  const refresh = useCallback(() => {
    router.refresh();
  }, [router]);

  return {
    push,
    replace,
    back,
    forward,
    refresh,
  };
}