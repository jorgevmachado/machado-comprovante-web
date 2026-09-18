import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Filters ,useFilter } from '@machado-repo/ui';


const filtersConfig = [
  {
    name: 'name',
    type: 'text',
    value: '',
  },
  {
    name: 'email',
    type: 'text',
    value: '',
  },
  {
    name: 'type',
    type: 'autocomplete',
    value: '',
    options: [
      {
        key: 'electric',
        value: 'electric',
        label: 'Electric',
      },
      {
        key: 'fire',
        value: 'fire',
        label: 'Fire',
      },
      {
        key: 'water',
        value: 'water',
        label: 'Water',
      },
    ],
  },
]

const meta = {
  title: 'Components/Filters',
  component: Filters,
  tags: ['autodocs'],
  args: {
    ariaLabel: 'Filters',
    onApply: fn(),
    onClear: fn(),
    filters: filtersConfig,
  },
} satisfies Meta<typeof Filters>;

export default meta;

type Story = StoryObj<typeof meta>;

const FilterWithHook = () => {

  const {
    inputFilters,
    applyInputFilters,
    clearInputFilters,
  } = useFilter({
    initialFilters: {
      name: '',
      type: '',
    },

    initialInputFilters: filtersConfig,

    fetchRequest: (filters) => {
      console.log('Request filters:', filters);
    },

    normalizeFilters: (filters) => ({
      ...filters,
      name: filters.name.trim(),
    }),
  });


  return (
    <Filters
      filters={inputFilters}
      onApply={applyInputFilters}
      onClear={clearInputFilters}
    />
  );
};

export const Default: Story = {};

export const WithInitialValues: Story = {
  args: {
    filters: [
      {
        name: 'name',
        label: 'Name',
        type: 'text',
        value: 'Pikachu',
        placeholder: 'filters.namePlaceholder',
      },
      {
        name: 'type',
        label: 'Type',
        type: 'autocomplete',
        value: 'electric',
        placeholder: 'filters.typePlaceholder',
        options: [
          {
            key: 'electric',
            value: 'electric',
            label: 'Electric',
          },
          {
            key: 'fire',
            value: 'fire',
            label: 'Fire',
          },
        ],
      },
    ],
  },
};

export const OnlyInputs: Story = {
  args: {
    filters: [
      {
        name: 'name',
        label: 'Name',
        type: 'text',
        value: '',
        placeholder: 'Search name',
      },
      {
        name: 'code',
        label: 'Code',
        type: 'text',
        value: '',
        placeholder: 'Search code',
      },
    ],
  },
};

export const WithAutocompleteLoading: Story = {
  args: {
    filters: [
      {
        name: 'type',
        label: 'Type',
        type: 'autocomplete',
        value: '',
        isLoading: true,
        placeholder: 'Search type',
        options: [
          {
            key: 'fire',
            value: 'fire',
            label: 'Fire',
          },
          {
            key: 'water',
            value: 'water',
            label: 'Water',
          },
        ],
      },
    ],
  },
};

export const WithoutActiveFilters: Story = {
  args: {
    filters: [
      {
        name: 'name',
        label: 'Name',
        type: 'text',
        value: '',
      },
    ],
  },
};

export const CustomLabels: Story = {
  args: {
    filterApplyLabel: 'Apply',
    filterCleanLabel: 'Clear',
  },
};

export const WithUseFilterHook: Story = {
  render: () => <FilterWithHook />,
};