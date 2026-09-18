'use client';
import React, { useState } from 'react';

import { Icon ,type TLanguageSwitcherVariant } from '../../primitives';

import { MenuItem, type TMenuItem } from './menu-item';

type SidebarThemeTone = 'primary' | 'secondary' | 'neutral';

import type { SidebarVariantsTheme } from './types';

type SidebarThemeVariant = Record<TLanguageSwitcherVariant, SidebarVariantsTheme>;

const sidebarThemes: Record<SidebarThemeTone, SidebarThemeVariant> = {
  primary: {
    dark: {

      sidebar: `
        bg-gradient-to-b
        from-[#111d38]
        to-[#14213d]
      `,
      border: `
        border-white/15
      `,

      item: `
        text-slate-50/95
      `,

      itemActive: `
       border-blue-300/50
                        bg-gradient-to-br
                        from-blue-500/30
                        to-blue-900/30
                        font-bold
                        shadow-[0_8px_18px_rgba(37,99,235,0.22)]
      `,

      itemHover: `
        hover:border-blue-300/25
        hover:bg-blue-500/20
      `,

      text: `
        text-white
      `,

      toggle: `
        bg-slate-900/30
        text-slate-50
        hover:border-blue-300/25
        hover:bg-blue-500/20
        focus-visible:outline-yellow-400
      `,

      child: `
        text-slate-100/95
        hover:bg-blue-500/15
        hover:text-white
        focus-visible:outline-yellow-400
      `,

      childActive: `
       bg-blue-800/70 
       text-white
      `,

      logout: `
        border-red-300/50
        bg-red-700/80
        text-white
        hover:bg-red-600/25
        hover:border-red-200/80
        hover:bg-red-600/25
        focus-visible:outline-red-300
      `,
    },
    light: {

      sidebar: `
        bg-white
      `,

      border: `
        border-slate-200
      `,

      item: `
        text-slate-700
      `,

      itemActive: `
        bg-blue-100
        text-blue-900
        border-blue-300
      `,

      itemHover: `
        hover:bg-slate-100
      `,

      text: `
        text-slate-900
      `,

      toggle: `
        bg-slate-100
        text-slate-700
      `,

      child: `
        text-slate-600
      `,

      childActive: `
        bg-blue-100
        text-blue-900
      `,

      logout: `
        border-red-300
        bg-red-600
        text-white
      `,
    },
  },
  secondary: {
    dark: {

      sidebar: `
        bg-gradient-to-b
        from-[#2e1065]
        via-[#6d28d9]
        to-[#8b5cf6]
      `,

      border: `
        border-violet-300/20
      `,

      item: `
        text-white
      `,

      itemActive: `
        bg-violet-500/30
        border-violet-300/40
      `,

      itemHover: `
        hover:bg-violet-400/20
      `,

      text: `
        text-white
      `,

      toggle: `
        bg-violet-950/30
        text-white
      `,

      child: `
        text-violet-100
      `,

      childActive: `
        bg-violet-900/70
      `,

      logout: `
        border-red-300/50
        bg-red-700/80
      `,
    },
    light: {

      sidebar: `
        bg-gradient-to-b
        from-[#faf5ff]
        to-[#ddd6fe]
      `,

      border: `
        border-violet-200
      `,

      item: `
        text-slate-800
      `,

      itemActive: `
        bg-violet-100
        border-violet-300
      `,

      itemHover: `
        hover:bg-violet-50
      `,

      text: `
        text-slate-900
      `,

      toggle: `
        bg-violet-50
      `,

      child: `
        text-slate-600
      `,

      childActive: `
        bg-violet-100
      `,

      logout: `
        bg-red-600
      `,
    },
  },
  neutral: {
    dark: {

      sidebar: `
        bg-gradient-to-b
        from-[#111827]
        via-[#1f2937]
        to-[#374151]
      `,

      border: `
        border-slate-700
      `,

      item: `
        text-slate-100
      `,

      itemActive: `
        bg-slate-700/70
      `,

      itemHover: `
        hover:bg-slate-700/50
      `,

      text: `
        text-slate-100
      `,

      toggle: `
        bg-slate-900/40
      `,

      child: `
        text-slate-400
      `,

      childActive: `
        bg-slate-700
      `,

      logout: `
        bg-red-700
      `,
    },
    light: {

      sidebar: `
        bg-white
      `,

      border: `
        border-slate-200
      `,

      item: `
        text-slate-700
      `,

      itemActive: `
        bg-slate-100
      `,

      itemHover: `
        hover:bg-slate-100
      `,

      text: `
        text-slate-900
      `,

      toggle: `
        bg-slate-100
      `,

      child: `
        text-slate-500
      `,

      childActive: `
        bg-slate-100
      `,

      logout: `
        bg-red-600
      `,
    },
  },
}

type SidebarProps = {
  tone?: SidebarThemeTone;
  items: Array<TMenuItem>;
  logout: {
    label: string;
    onClick: () => void;
  };
  variant: TLanguageSwitcherVariant;
  pathname: string;
  onItemClick: (item: TMenuItem) => void;
  isCollapsed: boolean;
}

export default function Sidebar({ tone = 'primary', items, logout, variant, pathname, onItemClick, isCollapsed }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const styles = sidebarThemes[tone][variant];

  const toggleExpanded = (href: string) => {
    setExpandedItems((previousState) => ({
      ...previousState,
      [href]: !previousState[href],
    }));
  };

  return (
    <aside
      className={`
        z-[100] flex shrink-0 flex-col overflow-hidden
        border-r                
        p-4 px-3
        shadow-[8px_0_26px_rgba(2,6,23,0.16)]
        transition-[width] duration-300 ease-in-out
        ${isCollapsed ? 'w-[74px]' : 'w-[244px]'}
        max-[900px]:fixed
        max-[900px]:left-0
        max-[900px]:top-[72px]
        max-[900px]:h-[calc(100vh-72px)]
        max-[900px]:w-[min(82vw,260px)]
        max-[900px]:-translate-x-[102%]
        ${styles.sidebar}
        ${styles.border}
      `}
      aria-label="Sidebar"
    >
      <nav
        className="flex flex-1 flex-col gap-2"
        aria-label="Navigation Authentication"
      >
        {items.map((item, index) => (
            <MenuItem
              key={`${item.href}-${index}`}
              {...item}
              styles={styles}
              pathname={pathname}
              onItemClick={onItemClick}
              isCollapsed={isCollapsed}
              expandedItems={expandedItems}
              toggleExpanded={toggleExpanded}
            />
          ))}
      </nav>

      <button
        type="button"
        className={`
        mt-3 flex w-full
          items-center gap-3
          overflow-hidden
          whitespace-nowrap
          rounded-xl
          border           
          px-3 py-[11px]
          text-sm
          font-bold         
          cursor-pointer
          transition-all duration-200
          hover:-translate-y-px          
          focus-visible:outline-2          
          ${styles.logout}
        `}
        onClick={logout.onClick}
        aria-label={logout.label}
        title={isCollapsed ? logout.label : undefined}
      >
        <span className="flex shrink-0 items-center" aria-hidden="true">
          <Icon icon="logout" />
        </span>

        {!isCollapsed && (
          <span className="overflow-hidden text-ellipsis">
            { logout.label }
          </span>
        )}

      </button>
    </aside>
  );
};