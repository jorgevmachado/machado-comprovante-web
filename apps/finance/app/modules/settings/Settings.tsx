'use client';
import React, { useCallback } from 'react';
import { usePathname } from 'next/navigation';

import { Navigation ,Breadcrumb ,useBreadcrumb } from '@machado-repo/ui';

import { logoutAction } from '@/app/modules/auth/actions';

import SettingsNavigation ,{ useNavigation } from './navigation';

import { menu } from './menu';

type SettingsProps = {
  children: React.ReactNode;
  isAuthenticated?: boolean;
}
export default function Settings({ children, isAuthenticated = false }: SettingsProps) {
  const pathname = usePathname();
  const router = useNavigation();

  const { breadcrumbs } = useBreadcrumb({ pathname });

  const handleLogout = useCallback(async () => {
    await logoutAction();
    router.push('/join');
    router.refresh();
  }, [router]);

  return (
    <Navigation
      menu={menu}
      logout={{
        label: 'navigation.signOut',
        onClick: handleLogout
      }}
      title="navigation.title"
      variant="dark"
      subtitle="navigation.subtitle"
      iconLogo="money"
      pathname={pathname}
      onItemClick={(item) => router.push(item.href)}
      isAuthenticated={isAuthenticated}
      withLanguageSwitch={true}
    >
      <>
        <SettingsNavigation/>
        {isAuthenticated && (<Breadcrumb breadcrumbs={breadcrumbs} onItemClick={(href) => router.push(href)}/>)}
        {children}
      </>
    </Navigation>
  )
}