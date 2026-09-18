import type { Meta ,StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Navbar } from '@machado-repo/ui';

const meta = {
  tags: ['autodocs'] ,
  args: {
    variant: 'dark' ,
    isAuthenticated: true ,
    isSidebarCollapsed: false ,
    onToggleSidebar: fn(),
    title: 'Navbar Title', subtitle: 'Navbar Subtitle', icon: 'money', withLanguageSwitch: true
  } ,
  title: 'Components/Navbar' ,
  argTypes: {} ,
  component: Navbar ,
  decorators: [
    (Story) => (
      <div style={ { height: '50vh' ,width: '90vh' } }>
        <Story/>
      </div>
    ) ,
  ] ,
  parameters: { layout: 'centered' } ,

} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };

export const WithTitle: Story = { args: { title: 'Navbar Title' } };

export const WithSubTitle: Story = { args: { subtitle: 'Navbar Subtitle' } };

export const WithTitleAndSubtitle: Story = { args: { title: 'Navbar Title', subtitle: 'Navbar Subtitle' } };

export const WithIconLogo: Story = { args: { icon: 'money' } };

export const WithLanguageSwitch: Story = { args: { withLanguageSwitch: true } };

export const NavbarFull: Story = { args: { variant: 'light', title: 'Navbar Title', subtitle: 'Navbar Subtitle', icon: 'money', withLanguageSwitch: true } };