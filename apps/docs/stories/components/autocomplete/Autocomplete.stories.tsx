import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Autocomplete } from '@machado-repo/ui';

const options = [
  {
    key: '1',
    value: 'react',
    label: 'React',
    description: 'JavaScript library for building interfaces',
  },
  {
    key: '2',
    value: 'typescript',
    label: 'TypeScript',
    description: 'Typed superset of JavaScript',
  },
  {
    key: '3',
    value: 'nextjs',
    label: 'Next.js',
    description: 'React framework for production',
  },
  {
    key: '4',
    value: 'tailwind',
    label: 'Tailwind CSS',
    description: 'Utility-first CSS framework',
  },
];

const meta = {
  title: 'Components/Autocomplete',
  component: Autocomplete,
  tags: ['autodocs'],
  args: {
    name: 'technology',
    label: 'Technology',
    value: '',
    options,
    placeholder: 'Search technology...',
    onValueChange: fn(),
    onSelectOption: fn(),
  },
  argTypes: {
    isLoading: {
      control: 'boolean',
    },
    maxOptions: {
      control: 'number',
    },
    placeholder: {
      control: 'text',
    },
    noResultsText: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Autocomplete>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
  args: {
    value: 'react',
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
    loadingPlaceholder: 'Loading technologies...',
  },
};

export const LimitedOptions: Story = {
  args: {
    maxOptions: 2,
  },
};

export const WithoutResults: Story = {
  args: {
    options: [],
    noResultsText: 'No technologies found.',
  },
};

export const CustomFiltering: Story = {
  args: {
    filterOptions: (option, query) => {
      return option.value.startsWith(query);
    },
  },
};

export const CustomStyles: Story = {
  args: {
    optionClassName: 'font-medium',
    listboxClassName: 'border-blue-400',
  },
};

export const DisabledLikeInput: Story = {
  args: {
    disabled: true,
  },
};