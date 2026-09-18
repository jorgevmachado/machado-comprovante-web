import type { TMenuItem } from '@machado-repo/ui';

export const menu: Array<TMenuItem> = [
  {
    href: '/home',
    icon: 'home',
    label: 'navigation.home' ,
  },
  {
    href: '/category',
    icon: 'category',
    label: 'navigation.category' ,
    children: [
      {
        href: '/category/subcategory',
        icon: 'subcategory',
        label: 'navigation.subcategory' ,
      }
    ]
  },
  {
    href: '/account',
    icon: 'account',
    label: 'navigation.account' ,
  },
];