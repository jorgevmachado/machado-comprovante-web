import React from 'react';
import type { TIcon } from '@machado-repo/icons';

import { Icon } from '../../../primitives';

import type { SidebarVariantsTheme } from '../types';

type TMenuItemChildren = {
  href: string;
  icon: React.ReactNode | TIcon;
  label: string;
}

export type TMenuItem = TMenuItemChildren & {
  children?: Array<TMenuItemChildren>;
}

type MenuItemProps = TMenuItem & {
  styles: SidebarVariantsTheme;
  pathname: string;
  onItemClick: (item: TMenuItem) => void;
  isCollapsed: boolean;
  expandedItems: Record<string ,boolean>;
  toggleExpanded: (href: string) => void;
}

export default function MenuItem({
  href ,
  icon ,
  label ,
  styles,
  children ,
  pathname ,
  onItemClick ,
  isCollapsed,
  expandedItems ,
  toggleExpanded,
}: MenuItemProps) {

  const hasChildren = Boolean(children?.length);

  const hasActiveChild = children?.some((child) => pathname === child.href ||
    pathname.startsWith(`${ child.href }/`)) ?? false;

  const isActive = pathname === href || hasActiveChild;

  const isExpanded = hasActiveChild || Boolean(expandedItems[href]);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex w-full items-stretch gap-1.5">
        <button
          type="button"
          onClick={() => onItemClick({ href, icon, label })}
          className={ `                    
                    appearance-none
                    cursor-pointer
                    flex min-w-0 flex-1 items-center gap-3
                    overflow-hidden whitespace-nowrap
                    rounded-xl border border-transparent
                    px-3 py-[11px]
                    text-[0.92rem]                    
                    transition-all duration-200
                    hover:translate-x-px                    
                    focus-visible:outline-2
                    focus-visible:outline-yellow-400
                    ${styles.item}
                    ${styles.itemHover}
                    ${ isActive ? styles.itemActive : '' }
                  ` }
          aria-current={pathname === href ? 'page' : undefined}
          title={isCollapsed ? label : undefined}
        >
          <span className="flex shrink-0 items-center" aria-hidden="true">
            <Icon icon={icon} />
          </span>
          {!isCollapsed && (
            <span className="overflow-hidden text-ellipsis">{label}</span>
          )}
        </button>
        {hasChildren && !isCollapsed && (
          <button
            type="button"
            onClick={() => toggleExpanded(href)}
            className={`
            appearance-none
                      cursor-pointer
                      inline-flex 
                      w-[38px]
                      items-center 
                      justify-center
                      rounded-xl
                      border 
                      border-transparent                      
                      transition-colors                      
                      focus-visible:outline-2
                      ${styles.toggle}`
            }
            aria-label={
              isExpanded
                ? `Navigation Collapse Section ${ label }`
                : `Navigation Expand Section ${ label }`
            }
          >
            <Icon icon="chevron-down" className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}/>
          </button>
        )}
      </div>
      {hasChildren && children && !isCollapsed && isExpanded && (
        <div
          className="
                    ml-[18px]
                    flex flex-col gap-1
                    border-l border-slate-400/30
                    pl-3
                  "
        >
          {children.map(
            ({
              href: childHref,
              label: childLabel,
              icon: childIcon,
            }) => {
              const isChildActive =
                pathname === childHref ||
                pathname.startsWith(`${childHref}/`);

              return (
                <button
                  type="button"
                  key={childHref}
                  onClick={() => onItemClick({ href: childHref, icon: childIcon, label: childLabel })}
                  className={`
                            appearance-none
                            cursor-pointer
                            flex min-h-[34px]
                            items-center gap-2
                            rounded-lg
                            px-2.5 py-2
                            text-sm
                            font-semibold                            
                            transition-colors                            
                            focus-visible:outline-2
                            ${styles.child}                            
                            ${ isChildActive ? styles.childActive : '' }
                          `}
                  aria-current={
                    isChildActive ? 'page' : undefined
                  }
                >
                          <span
                            className="flex shrink-0 items-center"
                            aria-hidden="true"
                          >
                            <Icon icon={childIcon}/>
                          </span>

                  <span className="overflow-hidden text-ellipsis">
                            {childLabel}
                          </span>
                </button>
              );
            },
          )}
        </div>
      )}
    </div>
  );
}