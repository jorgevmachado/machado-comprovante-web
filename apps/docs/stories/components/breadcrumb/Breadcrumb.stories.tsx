import type { Meta ,StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Breadcrumb } from '@machado-repo/ui';

const meta = {
  tags: ['autodocs'] ,
  args: {
    breadcrumbs: [
      {
        href: '/home',
        label: 'Home',
        clickable: true,
        isCurrent: false,
      },
      {
        href: '/category',
        label: 'Category',
        clickable: true,
        isCurrent: true,
      }
    ],
    onItemClick: fn()
  } ,
  title: 'Components/Breadcrumb' ,
  argTypes: {} ,
  component: Breadcrumb ,
  decorators: [
    (Story) => (
      <div style={ { height: '50vh' ,width: '90vh' } }>
        <Story/>
      </div>
    ) ,
  ] ,
  parameters: { layout: 'centered' } ,

} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };

export const WithHomeBreadcrumbLabel: Story = {
  args: {
    homeBreadcrumb: {
      label: 'Home Page'
    }
  }
};

export const WithHomeBreadcrumbCustomIconClick: Story = {
  args: {
    homeBreadcrumb: {
      icon: 'money',
      withIcon: true
    }
  }
};