import type { Meta, StoryObj } from '@storybook/react-vite';

import { OTone, OSize } from '@machado-repo/theme';
import { OIcon, OIconGroup } from '@machado-repo/icons';
import { Icon } from '@machado-repo/ui';

const meta = {
  tags: ['autodocs'],
  args: {
    icon: 'react'
  },
  title: 'Primitives/Icon',
  argTypes: {
    icon: {
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'react' }
      },
      control: { type: 'select' },
      options: OIcon
    },
    tone: {
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined }
      },
      control: { type: 'select' },
      options: OTone
    },
    size: {
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'base' }
      },
      control: { type: 'select' },
      options: OSize
    },
    group: {
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'fa' }
      },
      control: { type: 'select' },
      options: OIconGroup
    },
    withDefault: {
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
      control: { type: 'boolean' },
    },
    className: {
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      }
    }
  },
  component: Icon,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { } };