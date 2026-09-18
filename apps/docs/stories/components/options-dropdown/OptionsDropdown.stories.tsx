import type { Meta ,StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { OptionsDropdown } from '@machado-repo/ui';
import { OIcon } from '@machado-repo/icons';

const meta = {
  tags: ['autodocs'] ,
  args: {
    icon: 'dots',
    align: 'right',
    items: [
      {
        label: 'Editar',
        onClick: fn(),
      },
      {
        label: 'Duplicar',
        onClick: fn(),
      },
      {
        label: 'Excluir',
        onClick: fn(),
      },
    ],
  },
  title: 'Components/OptionsDropdown' ,
  argTypes: {
    icon: {
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'dots' }
      },
      control: { type: 'select' },
      options: OIcon
    },
    align: {
      control: 'select',
      options: ['left', 'right'],
      description: 'Define o alinhamento do menu em relação ao botão.',
    },
    items: {
      control: 'object',
      description: 'Itens exibidos no menu dropdown.',
    },
  },
  component: OptionsDropdown ,
  decorators: [
    (Story) => (
      <div style={ { height: '50vh' } }>
        <Story/>
      </div>
    ) ,
  ] ,
  parameters: { layout: 'centered' } ,

} satisfies Meta<typeof OptionsDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };

export const CustomIcon: Story = { args: { icon: 'react' } };

export const AlignLeft: Story = {
  args: {
    align: 'left',
  },
};

export const AlignRight: Story = {
  args: {
    align: 'right',
  },
};

export const WithDisabledItem: Story = {
  args: {
    items: [
      {
        label: 'Editar',
        onClick: fn(),
      },
      {
        label: 'Duplicar',
        onClick: fn(),
        disabled: true,
      },
      {
        label: 'Excluir',
        onClick: fn(),
      },
    ],
  },
};

export const WithIcons: Story = {
  args: {
    items: [
      {
        label: 'Editar',
        icon: 'edit',
        onClick: fn(),
      },
      {
        label: 'Duplicar',
        icon: 'copy',
        onClick: fn(),
      },
      {
        label: 'Excluir',
        icon: 'trash',
        onClick: fn(),
      },
    ],
  },
};

export const IconsOnRight: Story = {
  args: {
    items: [
      {
        label: 'Editar',
        icon: 'edit',
        iconPosition: 'right',
        onClick: fn(),
      },
      {
        label: 'Duplicar',
        icon: 'copy',
        iconPosition: 'right',
        onClick: fn(),
      },
      {
        label: 'Excluir',
        icon: 'trash',
        iconPosition: 'right',
        onClick: fn(),
      },
    ],
  },
};

export const MixedIconPositions: Story = {
  args: {
    items: [
      {
        label: 'Editar',
        icon: 'edit',
        iconPosition: 'left',
        onClick: fn(),
      },
      {
        label: 'Compartilhar',
        icon: 'share',
        iconPosition: 'right',
        onClick: fn(),
      },
      {
        label: 'Excluir',
        icon: 'trash',
        iconPosition: 'left',
        onClick: fn(),
      },
    ],
  },
};

export const SingleItem: Story = {
  args: {
    items: [
      {
        label: 'Editar',
        onClick: fn(),
      },
    ],
  },
};

export const ManyItems: Story = {
  args: {
    items: [
      {
        label: 'Visualizar',
        onClick: fn(),
      },
      {
        label: 'Editar',
        onClick: fn(),
      },
      {
        label: 'Duplicar',
        onClick: fn(),
      },
      {
        label: 'Mover',
        onClick: fn(),
      },
      {
        label: 'Arquivar',
        onClick: fn(),
      },
      {
        label: 'Excluir',
        onClick: fn(),
      },
    ],
  },
};