import type { Meta ,StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { OTone, OButtonAppearance, OButtonSize } from '@machado-repo/theme';

import { Button } from '@machado-repo/ui';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'Button',
    onClick: fn(),
  },
  argTypes: {
    tone: {
      control: 'select',
      options: OTone,
    },
    appearance: {
      control: 'select',
      options: OButtonAppearance,
    },
    size: {
      control: 'select',
      options: OButtonSize,
    },
    disabled: {
      control: 'boolean',
    },
    fullWidth: {
      control: 'boolean',
    },
    isLoading: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };

export const Secondary: Story = {
  args: {
    tone: 'secondary',
  },
};

export const Outline: Story = {
  args: {
    appearance: 'outline',
  },
};

export const OutlineBorderless: Story = {
  args: {
    appearance: 'outlineBorderless',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
    loadingText: 'Saving...',
  },
};

export const WithLeftIcon: Story = {
  args: {
    iconLeft: 'check',
    children: 'Confirmar',
  },
};

export const WithRightIcon: Story = {
  args: {
    iconRight: 'arrowRight',
    children: 'Continuar',
  },
};

export const IconOnly: Story = {
  args: {
    appearance: 'icon',
    iconLeft: 'plus',
    children: undefined,
  },
};

export const IconNoBorder: Story = {
  args: {
    appearance: 'iconNoBorder',
    iconLeft: 'trash',
    children: undefined,
  },
};