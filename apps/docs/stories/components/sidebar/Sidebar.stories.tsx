import type { Meta ,StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Sidebar } from '@machado-repo/ui';

const meta = {
  tags: ['autodocs'] ,
  args: {
    items: [
      {
        href: '/home',
        icon: 'home',
        label: 'Home' ,
      },
      {
        href: '/category',
        icon: 'category',
        label: 'Category' ,
        children: [
          {
            href: '/category/subcategory',
            icon: 'subcategory',
            label: 'Subcategory' ,
          }
        ]
      },
      {
        href: '/account',
        icon: 'account',
        label: 'Account' ,
      },
    ],
    variant: 'dark',
    isCollapsed: false,
    logout: {
      label: 'Logout',
      onClick: fn()
    },
    pathname: '/home',
    onItemClick: fn()
  } ,
  title: 'Components/Sidebar' ,
  argTypes: {} ,
  component: Sidebar ,
  decorators: [
    (Story) => (
      <div style={ { height: '50vh' ,width: '90vh' } }>
        <Story/>
      </div>
    ) ,
  ] ,
  parameters: { layout: 'centered' } ,

} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };

export const Collapsed: Story = { args: { isCollapsed: true } };