import type { Meta, StoryObj } from '@storybook/react-vite';

import { LanguageSwitcher } from '@machado-repo/ui';

const meta = {
  tags: ['autodocs'],
  args: {
    variant: 'dark'
  },
  title: 'Primitives/LanguageSwitcher',
  argTypes: {},
  component: LanguageSwitcher,
  decorators: [
    (Story) => (
      <div style={{ height: '50vh', width: '100%' }}>
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'centered' },


} satisfies Meta<typeof LanguageSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };