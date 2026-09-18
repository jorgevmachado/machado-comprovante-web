import type { Meta ,StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Navigation } from '@machado-repo/ui';

const meta = {
  tags: ['autodocs'] ,
  args: {
    title: 'Finance System',
    menu: [
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
    iconLogo: 'money',
    subtitle: 'Finance Portal',
    variant: 'dark',
    pathname: '/home',
    children: (
      <div>
        <h1>Navigation</h1>
      </div>
    ),
    onItemClick: fn(),
    logout: {
      label: 'Logout',
      onClick: fn()
    },
    isAuthenticated: true ,
    withLanguageSwitch: true,
  } ,
  title: 'Components/Navigation' ,
  argTypes: {} ,
  component: Navigation ,
  decorators: [
    (Story) => (
      <div style={ { height: '50vh' ,width: '90vh' } }>
        <Story/>
      </div>
    ) ,
  ] ,
  parameters: { layout: 'centered' } ,

} satisfies Meta<typeof Navigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };