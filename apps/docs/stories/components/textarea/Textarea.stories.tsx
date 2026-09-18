import type { Meta ,StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import React, { useState } from 'react';

import { Textarea } from '@machado-repo/ui';

const meta = {
  tags: ['autodocs'] ,
  args: {
    label: 'Description',
    placeholder: 'Type something...',
    fullWidth: true,
  } ,
  title: 'Components/Textarea' ,
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: 'select',
      options: ['outline'],
    },
    isInvalid: {
      control: 'boolean',
    },
    isLoading: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    readOnly: {
      control: 'boolean',
    },
    showCharacterCount: {
      control: 'boolean',
    },
    minLength: {
      control: 'number',
    },
    maxLength: {
      control: 'number',
    },
    rows: {
      control: 'number',
    },
  } ,
  component: Textarea ,
  decorators: [
    (Story) => (
      <div style={ { height: '50vh' ,width: '90vh' } }>
        <Story/>
      </div>
    ) ,
  ] ,
  parameters: { layout: 'centered' } ,

} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Description',
    placeholder: 'Type your description...',
  },
};

export const WithCharacterLimit: Story = {
  args: {
    label: 'Description',
    placeholder: 'Type your description...',
    minLength: 10,
    maxLength: 500,
    showCharacterCount: true,
  },
};

export const WithMinimumLength: Story = {
  args: {
    label: 'Description',
    placeholder: 'Enter at least 10 characters...',
    minLength: 10,
    showCharacterCount: true,
  },
};

export const WithMaximumLength: Story = {
  args: {
    label: 'Description',
    placeholder: 'You can enter up to 100 characters...',
    maxLength: 100,
    showCharacterCount: true,
  },
};

export const WithError: Story = {
  args: {
    label: 'Description',
    placeholder: 'Type something...',
    isInvalid: true,
    errorMessage: 'Description must contain at least 10 characters.',
    minLength: 10,
    maxLength: 500,
    showCharacterCount: true,
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Description',
    placeholder: 'Type something...',
    helperText: 'Tell us a little more about yourself.',
    maxLength: 500,
    showCharacterCount: true,
  },
};

export const Loading: Story = {
  args: {
    label: 'Description',
    placeholder: 'Loading...',
    isLoading: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Description',
    value: 'This textarea is disabled.',
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    label: 'Description',
    value: 'This textarea is read only.',
    readOnly: true,
  },
};

export const Small: Story = {
  args: {
    label: 'Description',
    placeholder: 'Small textarea...',
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    label: 'Description',
    placeholder: 'Medium textarea...',
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    label: 'Description',
    placeholder: 'Large textarea...',
    size: 'lg',
  },
};

export const CustomRows: Story = {
  args: {
    label: 'Description',
    placeholder: 'Type something...',
    rows: 8,
    maxLength: 1000,
    showCharacterCount: true,
  },
};

export const WithClearButton: Story = {
  render: () => {
    const [value, setValue] = useState('Clear me');

    return (
      <Textarea
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