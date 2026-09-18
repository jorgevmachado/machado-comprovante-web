import React, { useActionState } from 'react';
import type { Meta ,StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Form, type FormProps } from '@machado-repo/ui';

const fields: FormProps['fields'] = [
  { type: 'name' },
  { type: 'email' },
  { type: 'phone' },
  { type: 'fullname' },
  { type: 'password' },
  { type: 'password_confirmation' },
];

const fieldsWithTextArea: FormProps['fields'] = [
  ...fields,
  {
    type: 'description',
    label: 'Descrição',
    name: 'description',
    placeholder: 'Digite uma descrição',
    presentation: {
      rows: 5,
      showCharacterCount: true,
    },
  },
];

const meta = {
  tags: ['autodocs'] ,
  args: {
    fields,
  } ,
  title: 'Components/Form' ,
  component: Form ,
  decorators: [
    (Story) => (
      <div style={ { height: '80vh' ,width: '90vh' } }>
        <Story/>
      </div>
    ) ,
  ] ,
  parameters: { layout: 'centered' } ,

} satisfies Meta<typeof Form>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const WithInitialValues: Story = {
  args: {
    initialValues: {
      name: 'John Doe',
      email: 'john.doe@mail.com',
      password: '#Senha123',
    }
  }
}

export const WithTextarea: Story = {
  args: {
    fields: fieldsWithTextArea,
  }
}

export const WithCustomLayout: Story = {
  args: {
    fields: fieldsWithTextArea,
    layout: {
      cols: 2,
      fields: [
        { name: 'name' },
        { name: 'fullname' },
        { name: 'email' },
        { name: 'phone' },
        { name: 'password' },
        { name: 'password_confirmation' },
        { name: 'description', span: 2 },
      ]
    },
  }
}

export const ValidationOnBlur: Story = {
  args: {
    fields: [
      {
        type: 'name',
        name: 'name',
        label: 'Nome',
        placeholder: 'Digite seu nome',
        required: true,
      },
      {
        type: 'email',
        name: 'email',
        label: 'E-mail',
        placeholder: 'Digite seu e-mail',
        required: true,
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Deixe os campos vazios e retire o foco para verificar a validação individual no blur.',
      },
    },
  },
};

export const ValidationOnSubmit: Story = {
  args: {
    fields,
    onError: (validation) => {
      console.log('Form validation error:', validation);
    },
    actions: {
      submit: {
        tone: 'success',
        children: 'Enviar',
        fullWidth: true,
        onClick: (values) => {
          console.log('Form submitted with values:', values);
        },
      },
      cancel: {
        children: 'Cancelar',
        fullWidth: true,
        onClick: () => {
          console.log('Form cancelled');
        },
      },
    }
  },
  parameters: {
    docs: {
      description: {
        story:
          'Envie o formulário vazio para verificar a validação de todos os campos.',
      },
    },
  },
};

export const WithLayoutAndUnconfiguredFields: Story = {
  args: {
    fields: [
      {
        type: 'name',
      },
      {
        type: 'email',
      },
      {
        type: 'phone',
      },
      {
        type: 'password',
      },
      {
        type: 'password_confirmation',
      },
    ],
    initialValues: {},
    layout: {
      cols: 2,
      fields: [
        {
          name: 'password',
        },
        {
          name: 'password_confirmation',
        },
      ],
    },
  },
};

