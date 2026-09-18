import type { Meta ,StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import React, { useState } from 'react';

import { OInputVariant, OInputSize } from '@machado-repo/theme';

import { Input } from '@machado-repo/ui';


const meta = {
  tags: ['autodocs'] ,
  args: {
    label: 'Input label',
    placeholder: 'Type something...',
    onChange: fn(),
    onValueChange: fn(),
    onClear: fn(),
  },
  title: 'Components/Input' ,
  argTypes: {
    size: {
      control: 'select',
      options: OInputSize,
    },
    variant: {
      control: 'select',
      options: OInputVariant,
    },
    type: {
      control: 'select',
      options: [
        'text',
        'password',
        'email',
        'number',
        'money',
      ],
    },
    disabled: {
      control: 'boolean',
    },
    readOnly: {
      control: 'boolean',
    },
    isInvalid: {
      control: 'boolean',
    },
    isLoading: {
      control: 'boolean',
    },
    fullWidth: {
      control: 'boolean',
    },
    showClearButton: {
      control: 'boolean',
    },
  },
  component: Input ,
  decorators: [
    (Story) => (
      <div style={ { height: '50vh' ,width: '90vh' } }>
        <Story/>
      </div>
    ) ,
  ] ,
  parameters: { layout: 'centered' } ,

} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };

export const TypePassword: Story = {
  args: {
    type: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
  },
}

export const WithHelperText: Story = {
  args: {
    label: 'Email',
    placeholder: 'email@example.com',
    helperText: 'We will never share your email.',
  },
};


export const Error: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
    errorMessage: 'Password is required',
    isInvalid: true,
  },
};


export const Disabled: Story = {
  args: {
    label: 'Disabled',
    value: 'Disabled value',
    disabled: true,
  },
};


export const ReadOnly: Story = {
  args: {
    label: 'Read only',
    value: 'Read only value',
    readOnly: true,
  },
};


export const Loading: Story = {
  args: {
    label: 'Loading',
    placeholder: 'Loading...',
    isLoading: true,
    loadingText: 'Loading data...',
  },
};


export const WithClearButton: Story = {
  render: () => {
    const [value, setValue] = useState('Clear me');

    return (
      <Input
        label="Clear button"
        value={value}
        showClearButton
        onChange={(event) => setValue(event.target.value)}
        onClear={() => setValue('')}
      />
    );
  },
};


export const WithLeadingIcon: Story = {
  args: {
    label: 'Search',
    placeholder: 'Search...',
    leadingIcon: (
      <span>
        🔍
      </span>
    ),
  },
};


export const WithTrailingIcon: Story = {
  args: {
    label: 'Action',
    placeholder: 'Click icon',
    trailingIcon: (
      <span>
        ⚙️
      </span>
    ),
  },
};


export const CPFMask: Story = {
  render: () => {
    const [value, setValue] = useState('');

    return (
      <Input
        label="CPF"
        mask="###.###.###-##"
        placeholder="000.000.000-00"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    );
  },
};


export const PhoneMask: Story = {
  render: () => {
    const [value, setValue] = useState('');

    return (
      <Input
        label="Phone"
        mask="(##) #####-####"
        placeholder="(00) 00000-0000"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    );
  },
};


export const MoneyBRL: Story = {
  render: () => {
    const [value, setValue] = useState('');

    return (
      <Input
        label="Money"
        type="money"
        switchLanguage="pt-BR"
        placeholder="R$ 0,00"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    );
  },
};


export const MoneyUSD: Story = {
  render: () => {
    const [value, setValue] = useState('');

    return (
      <Input
        label="Money"
        type="money"
        switchLanguage="en-US"
        placeholder="$0.00"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    );
  },
};


export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Input
        label="Small"
        size="sm"
        placeholder="Small input"
      />

      <Input
        label="Medium"
        size="md"
        placeholder="Medium input"
      />

      <Input
        label="Large"
        size="lg"
        placeholder="Large input"
      />
    </div>
  ),
};


export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Input
        label="Outline"
        variant="outline"
        placeholder="Outline"
      />

      <Input
        label="Filled"
        variant="filled"
        placeholder="Filled"
      />

      <Input
        label="Ghost"
        variant="ghost"
        placeholder="Ghost"
      />
    </div>
  ),
};