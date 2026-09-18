'use client';
import React, { useState, useCallback } from 'react';

import type { TIcon } from '@machado-repo/icons';

import { Icon, LanguageSwitcher, type TLanguageSwitcherVariant } from '../../primitives';

export type NavbarThemeTone = 'primary' | 'secondary' | 'neutral';

export type NavbarVariantsTheme = {
  icon: string;
  title: string;
  header: string;
  button: string;
  subtitle: string;
}

export type NavbarThemeVariant = Record<TLanguageSwitcherVariant, NavbarVariantsTheme>;

type NavbarProps = {
  tone?: NavbarThemeTone;
  icon?: React.ReactNode | TIcon;
  title?: string;
  variant: TLanguageSwitcherVariant;
  subtitle?: string;
  onToggleSidebar: () => void;
  isAuthenticated: boolean;
  isSidebarCollapsed: boolean;
  withLanguageSwitch?: boolean;
};

const navbarThemes: Record<NavbarThemeTone, NavbarThemeVariant> = {
  primary: {
    dark: {
      icon: `
      border-white/30
      bg-white/10 
      shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]
     `,
      title: 'text-white',
      header: `
    text-white 
    border-white/15 
    shadow-[0_10px_28px_rgba(15,23,42,0.3)] 
    border-b 
    bg-gradient-to-br 
    from-[#14213d] 
    via-[#1e3a8a] 
    to-[#233876]
    `,
      button: `
    border-white/20
     bg-slate-900/30
      text-white 
      hover:bg-white/15 
      hover:border-white/30
      `,
      subtitle: `text-white/90`,
    },

    light: {
      icon: `
    border-slate-200
    bg-slate-100
    shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]
  `,
      title: 'text-slate-900',
      header: `
    text-slate-900
    shadow-[0_8px_24px_rgba(15,23,42,0.08)]
    bg-white
  `,
      button: `
    border-slate-300
    bg-white
    text-slate-700
    hover:bg-slate-100
    hover:border-slate-400
  `,
      subtitle: `
    text-slate-500
  `,
    },
  },


  secondary: {
    dark: {
      icon: `
        border-violet-300/30
        bg-violet-500/10
        shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]
      `,
      title: `
        text-white
      `,
      header: `
        text-white
        border-violet-300/20
        shadow-[0_10px_28px_rgba(76,29,149,0.35)]
        border-b
        bg-gradient-to-br
        from-[#2e1065]
        via-[#6d28d9]
        to-[#8b5cf6]
      `,
      button: `
        border-violet-300/30
        bg-violet-950/30
        text-white
        hover:bg-violet-400/20
        hover:border-violet-300/40
      `,
      subtitle: `
        text-violet-100/90
      `,
    },

    light: {
      icon: `
        border-violet-200
        bg-violet-50
        shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]
      `,
      title: `
        text-slate-900
      `,
      header: `
        text-slate-900
        border-violet-100
        shadow-[0_8px_24px_rgba(124,58,237,0.12)]
        border-b
        bg-gradient-to-br
        from-[#faf5ff]
        via-[#ede9fe]
        to-[#ddd6fe]
      `,
      button: `
        border-violet-200
        bg-white
        text-violet-700
        hover:bg-violet-50
        hover:border-violet-300
      `,
      subtitle: `
        text-slate-500
      `,
    },
  },


  neutral: {
    dark: {
      icon: `
        border-slate-300/30
        bg-slate-800/30
        shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]
      `,
      title: `
        text-slate-100
      `,
      header: `
        text-slate-100
        border-slate-700
        shadow-[0_8px_24px_rgba(15,23,42,0.25)]
        border-b
        bg-gradient-to-br
        from-[#111827]
        via-[#1f2937]
        to-[#374151]
      `,
      button: `
        border-slate-600
        bg-slate-900/40
        text-slate-100
        hover:bg-slate-700/50
        hover:border-slate-500
      `,
      subtitle: `
        text-slate-400
      `,
    },

    light: {
      icon: `
        border-slate-200
        bg-slate-100
        shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]
      `,
      title: `
        text-slate-900
      `,
      header: `
        text-slate-900
        border-slate-200
        shadow-[0_8px_24px_rgba(15,23,42,0.08)]
        border-b
        bg-gradient-to-br
        from-[#ffffff]
        via-[#f8fafc]
        to-[#e2e8f0]
      `,
      button: `
        border-slate-300
        bg-white
        text-slate-700
        hover:bg-slate-100
        hover:border-slate-400
      `,
      subtitle: `
        text-slate-500
      `,
    },
  },
};

export default function Navbar({
  tone = 'primary',
  icon,
  title,
  variant,
  subtitle,
  isAuthenticated,
  onToggleSidebar,
  withLanguageSwitch,
  isSidebarCollapsed,
}: NavbarProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(isSidebarCollapsed);

  const handleToggleSidebar = useCallback(() => {
    onToggleSidebar();
    setSidebarCollapsed(!sidebarCollapsed);
  }, [onToggleSidebar, sidebarCollapsed]);

  const styles = navbarThemes[tone][variant];

  return (
    <header className={`
      sticky
        top-0
        z-[120]
        flex
        min-h-[72px]
        items-center
        justify-between
        px-6                
        ${styles.header}
        ` }
    >


      <div className="flex items-center gap-3.5">

        {isAuthenticated && (
          <button
            type="button"
            className={ `
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              cursor-pointer
              flex-shrink-0
              border
              transition-all
              duration-200
              hover:-translate-y-px
              focus-visible:outline-2
              focus-visible:outline-yellow-400
              focus-visible:outline-offset-2
              ${styles.button}
            `
            }
            onClick={handleToggleSidebar}
            aria-label={
              sidebarCollapsed
                ? 'navbar-expand-sidebar'
                : 'navbar-collapse-sidebar'
            }
          >
            {
              sidebarCollapsed
                ? <Icon icon="menu" size="2xl" />
                : <Icon icon="menu-open" size="2xl" />
            }
          </button>
        )}

        { icon && (
          <div
            className={`
              flex
              h-[42px]
              w-[42px]
              items-center
              justify-center
              rounded-full
              border              
              transition-transform
              duration-200
              hover:scale-105
              ${styles.icon}
            `}
            aria-label="Navbar Logo"
          >
            <Icon icon={icon} />
          </div>
        )}

        <div className="flex flex-col gap-0.5">
          <h1 className={`
              m-0 
              text-[1.05rem]
              font-extrabold
              leading-tight
              tracking-[0.3px]
              ${styles.title}
            `}>
            {title}
          </h1>

          <p
            className={`
              m-0
              text-[0.74rem]
              uppercase
              tracking-[0.5px]              
              max-[900px]:hidden
              ${styles.subtitle}
            `}
          >
            {subtitle}
          </p>

        </div>

      </div>

      {
        withLanguageSwitch && (
          <LanguageSwitcher variant={variant} />
        )
      }

    </header>
  );
};