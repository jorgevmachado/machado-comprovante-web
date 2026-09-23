'use client';

import { useEffect, useRef } from 'react';
import {
  usePathname,
  useSearchParams,
} from 'next/navigation';

import { useLoading } from '@machado-repo/ui';

export default function Navigation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { stopPageRender, stopAll } = useLoading();

  const previousUrl = useRef<string | null>(null);

  const currentUrl = `${pathname}?${searchParams.toString()}`;

  useEffect(() => {
    if (previousUrl.current === null) {
      previousUrl.current = currentUrl;

      return;
    }

    if (currentUrl === previousUrl.current) {
      return;
    }

    previousUrl.current = currentUrl;

    stopAll();
    stopPageRender();
  }, [
    stopAll,
    currentUrl,
    stopPageRender,
  ]);

  return null;
}