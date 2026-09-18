import React, { useState } from 'react';
import type { Meta ,StoryObj } from '@storybook/react-vite';

import { Switch } from '@machado-repo/ui';
import {
  OReducedSize ,
  OSwitchLabelPosition ,
  OSwitchVariations ,
  OTone,
} from '@machado-repo/theme';

const meta = {
  tags: ['autodocs'] ,
  args: {
    label: 'Ativar notificações',
    size: 'md',
    tone: 'primary',
    variant: 'solid',
    disabled: false,
    loading: false,
    readOnly: false,
    fullWidth: false,
    labelPosition: 'end',
  },
  title: 'Components/Switch' ,
  argTypes: {
    size: {
      control: 'select',
      options: OReducedSize,
    },
    tone: {
      control: 'select',
      options: OTone,
    },
    variant: {
      control: 'select',
      options: OSwitchVariations,
    },
    labelPosition: {
      control: 'select',
      options: OSwitchLabelPosition,
    },
    checked: {
      control: 'boolean',
    },
    defaultChecked: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    loading: {
      control: 'boolean',
    },
    readOnly: {
      control: 'boolean',
    },
    fullWidth: {
      control: 'boolean',
    },
    label: {
      control: 'text',
    },
    description: {
      control: 'text',
    },
    loadingLabel: {
      control: 'text',
    },
    checkedLabel: {
      control: 'text',
    },
    uncheckedLabel: {
      control: 'text',
    },
    onChange: {
      action: 'onChange',
    },
    onCheckedChange: {
      action: 'onCheckedChange',
    },
  },
  component: Switch ,
  decorators: [
    (Story) => (
      <div style={ { height: '50vh' ,width: '90vh' } }>
        <Story/>
      </div>
    ) ,
  ] ,
  parameters: { layout: 'centered' } ,

} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
};

export const WithDescription: Story = {
  args: {
    label: 'Notificações',
    description: 'Receba notificações quando houver novidades.',
  },
};

export const WithStatusLabels: Story = {
  args: {
    label: 'Status',
    checkedLabel: 'Ativado',
    uncheckedLabel: 'Desativado',
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    loadingLabel: 'Salvando...',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    defaultChecked: true,
  },
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    label: 'Receber atualizações',
    description: 'Ative para receber atualizações por e-mail.',
  },
};

export const LabelOnStart: Story = {
  args: {
    labelPosition: 'start',
    label: 'Notificações',
    description: 'Receba notificações por e-mail.',
    defaultChecked: true,
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    defaultChecked: true,
  },
};

export const Sizes: Story = {
  render: args => (
    <div className="flex flex-col gap-4">
      <Switch {...args} size="sm" label="Small" />
      <Switch {...args} size="md" label="Medium" />
      <Switch {...args} size="lg" label="Large" />
    </div>
  ),
};

export const Tones: Story = {
  render: args => (
    <div className="flex flex-col gap-4">
      <Switch {...args} tone="primary" label="Primary" />
      <Switch {...args} tone="secondary" label="Secondary" />
      <Switch {...args} tone="neutral" label="Neutral" />
    </div>
  ),
};

export const Variants: Story = {
  render: args => (
    <div className="flex flex-col gap-4">
      <Switch
        {...args}
        variant="solid"
        defaultChecked
        label="Solid"
      />

      <Switch
        {...args}
        variant="outline"
        defaultChecked
        label="Outline"
      />
    </div>
  ),
};


export const Controlled: Story = {
  render: args => {
    const [checked, setChecked] = useState(false);

    return (
      <Switch
        {...args}
        checked={checked}
        label={checked ? 'Ativado' : 'Desativado'}
        onCheckedChange={setChecked}
      />
    );
  },
};