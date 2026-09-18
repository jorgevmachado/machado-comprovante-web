import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { Pagination } from '@machado-repo/ui';

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  args: {
    totalPages: 10,
    currentPage: 1,
    ariaLabel: 'Pagination',
  },
  argTypes: {
    totalPages: {
      control: {
        type: 'number',
      },
    },
    currentPage: {
      control: {
        type: 'number',
      },
    },
    isLoading: {
      control: {
        type: 'boolean',
      },
    },
    ariaLabel: {
      control: {
        type: 'text',
      },
    },
  },
} satisfies Meta<typeof Pagination>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [page, setPage] = useState(args.currentPage);

    return (
      <Pagination
        {...args}
        currentPage={page}
        onPageChange={setPage}
      />
    );
  },
};

export const MiddlePage: Story = {
  args: {
    totalPages: 20,
    currentPage: 10,
  },
  render: (args) => {
    const [page, setPage] = useState(args.currentPage);

    return (
      <Pagination
        {...args}
        currentPage={page}
        onPageChange={setPage}
      />
    );
  },
};

export const FirstPage: Story = {
  args: {
    totalPages: 5,
    currentPage: 1,
  },
  render: (args) => {
    const [page, setPage] = useState(args.currentPage);

    return (
      <Pagination
        {...args}
        currentPage={page}
        onPageChange={setPage}
      />
    );
  },
};

export const LastPage: Story = {
  args: {
    totalPages: 5,
    currentPage: 5,
  },
  render: (args) => {
    const [page, setPage] = useState(args.currentPage);

    return (
      <Pagination
        {...args}
        currentPage={page}
        onPageChange={setPage}
      />
    );
  },
};

export const Loading: Story = {
  args: {
    totalPages: 10,
    currentPage: 4,
    isLoading: true,
  },
};

export const SinglePage: Story = {
  args: {
    totalPages: 1,
    currentPage: 1,
  },
};