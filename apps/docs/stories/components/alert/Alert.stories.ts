import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Alert } from '@machado-repo/ui';

const meta = {
  tags: ['autodocs'],
  args: {
    title: 'Item moved Successfully',
    description: 'The item has been moved to the new location.',
    variant: 'info',
    onClose: fn()
  },
  title: 'Components/Alert',
  argTypes: {},
  component: Alert,
  parameters: { layout: 'centered' },


} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };