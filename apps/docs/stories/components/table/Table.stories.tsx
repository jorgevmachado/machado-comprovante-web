import React from 'react';

import type { Meta ,StoryObj } from '@storybook/react-vite';

import { Table ,type TableProps } from '@machado-repo/ui';

type TUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  salary: number;
  created_at: string;
};

const users: Array<TUser> = [
  {
    id: 1 ,
    name: 'João Machado' ,
    email: 'joao@example.com' ,
    role: 'Administrator' ,
    status: 'active' ,
    salary: 5000 ,
    created_at: '2026-08-15' ,
  } ,
  {
    id: 2 ,
    name: 'Maria Silva' ,
    email: 'maria@example.com' ,
    role: 'Editor' ,
    status: 'active' ,
    salary: 4500 ,
    created_at: '2026-08-20' ,
  } ,
  {
    id: 3 ,
    name: 'Carlos Souza' ,
    email: 'carlos@example.com' ,
    role: 'Viewer' ,
    status: 'inactive' ,
    salary: 4000 ,
    created_at: '2026-08-22' ,
  } ,
  {
    id: 4 ,
    name: 'Ana Oliveira' ,
    email: 'ana@example.com' ,
    role: 'Editor' ,
    status: 'active' ,
    salary: 4200 ,
    created_at: '2026-08-28' ,
  } ,
  {
    id: 5 ,
    name: 'Pedro Santos' ,
    email: 'pedro@example.com' ,
    role: 'Viewer' ,
    status: 'inactive' ,
    salary: 3800 ,
    created_at: '2026-09-01' ,
  } ];

const headers: TableProps<TUser>['headers'] = [
  {
    value: 'id' ,
    label: 'ID' ,
    align: 'center' ,
    sortable: true ,
  } ,
  { value: 'name' ,label: 'Name' ,sortable: true  } ,
  { value: 'email' ,label: 'E-mail'  } ,
  { value: 'role' ,label: 'Profile' ,sortable: true  } ,
  {
    value: 'status' ,
    label: 'Status' ,
    align: 'center' ,
    format: (value: TUser['status']) => (<span className={ [
      'inline-flex' ,
      'rounded-full' ,
      'px-2.5' ,
      'py-1' ,
      'text-xs' ,
      'font-medium' ,
      value === 'active' ?
        'bg-emerald-100 text-emerald-700' :
        'bg-slate-100 text-slate-500' ].join(' ') }> { value === 'active' ?
      'Active' :
      'Inactive' 
    } </span>) ,
  } ,
  {
    value: 'created_at' ,
    label: 'Created at' ,
    align: 'center' ,
    format: (value: string) => new Date(value).toLocaleDateString('pt-BR') ,
  } ];

const meta = {
  tags: ['autodocs'] ,
  title: 'Components/Table' ,
  argTypes: {} ,
  component: Table ,
  parameters: { layout: 'centered' } ,

} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Table items={users} headers={headers}/>
  )
};

export const Sortable: Story = {
  render: () => (<Table items={ users } headers={ headers }/>) ,
};
export const WithActions: Story = {
  render: () => (<Table items={ users } headers={ headers } actions={ {
    text: 'Actions' ,
    align: 'center' ,
    icons: [
      {
        icon: 'show' ,onClick: (item) => {
          console.log('Visualizar:' ,item);
        } ,
      } ,{
        icon: 'edit' ,onClick: (item) => {
          console.log('Editar:' ,item);
        } ,
      } ,{
        icon: 'delete' ,onClick: (item) => {
          console.log('Excluir:' ,item);
        } ,
      } ] ,
  } }/>) ,
};

export const Alignments: Story = {
  render: () => (<Table items={ users } headers={ [
    {
      value: 'id' ,
      label: 'ID' ,
      align: 'center' ,
    } ,
    {
      value: 'name' ,
      label: 'Nome' ,
      align: 'left' ,
    } ,
    {
      value: 'role' ,
      label: 'Perfil' ,
      align: 'center' ,
    } ,
    {
      value: 'email' ,
      label: 'E-mail' ,
      align: 'right' ,
    } ] }/>) ,
};

export const CustomAppearance: Story = {
  render: () => (<Table items={ users } headers={ headers } appearance={ {
    background: 'bg-slate-50' ,
    border: 'border-slate-300' ,
    header: { background: 'bg-slate-900' ,cell: 'text-white'  } ,
    body: {
      background: 'bg-white' ,
      cell: 'text-slate-800' ,
      border: 'border-b border-slate-300' ,
    } ,
  } }/>) ,
};

export const WithoutRowBorders: Story = {
  render: () => (<Table items={ users } headers={ headers }
                        appearance={ { body: { border: 'border-b-0'  }  } }/>) ,
};

export const FullyCustomized: Story = {
  render: () => (
    <Table
      items={ users }
      headers={ headers }
      footer={{}}
      actions={ {  text: 'Actions' , align: 'center' , icons: [
      {
        icon: 'show' ,onClick: (item) => {
          console.log('Visualizar:' ,item);
        } ,
      } ,{
        icon: 'edit' ,onClick: (item) => {
          console.log('Editar:' ,item);
        } ,
      } ,{
        icon: 'delete' ,onClick: (item) => {
          console.log('Excluir:' ,item);
        } ,
      } ] ,} }
      appearance={ {
        background: 'bg-slate-100' ,
        border: 'border-slate-300' ,
        header: { background: 'bg-slate-700' ,cell: 'text-white'  } ,
        body: {
          background: 'bg-white' ,
          cell: 'text-slate-700' ,
          border: 'border-b border-slate-200' ,
        } ,
        footer: { background: 'bg-slate-700' ,cell: 'text-white'  } ,
      } }
    />) ,
};

export const SwitchLanguage: Story = {
  render: () => (
    <Table 
      items={ users }
      headers={ [
        {
          value: 'id' ,
          label: 'ID' ,
          align: 'center' ,
          sortable: true ,
        } ,
        { value: 'name' ,label: 'form.label.name' ,sortable: true  } ,
        { value: 'email' ,label: 'form.label.email'  } ,
        { value: 'role' ,label: 'form.label.profile' ,sortable: true  } ,
        {
          value: 'status' ,
          label: 'form.label.status' ,
          align: 'center' ,
          format: (value: TUser['status']) => (<span className={ [
            'inline-flex' ,
            'rounded-full' ,
            'px-2.5' ,
            'py-1' ,
            'text-xs' ,
            'font-medium' ,
            value === 'active' ?
              'bg-emerald-100 text-emerald-700' :
              'bg-slate-100 text-slate-500' ].join(' ') }> { value === 'active' ?
            'form.label.active' :
            'form.label.inactive'
          } </span>) ,
        } ,
        {
          value: 'created_at' ,
          label: 'form.label.created_at' ,
          align: 'center' ,
          format: (value: string) => new Date(value).toLocaleDateString() ,
        }
        ]}
      actions={ {
        text: 'form.action.actions' ,
        align: 'center' ,
        icons: [
          {
            icon: 'show' ,onClick: (item) => {
              console.log('Visualizar:' ,item);
            } ,
          } ,{
            icon: 'edit' ,onClick: (item) => {
              console.log('Editar:' ,item);
            } ,
          } ,{
            icon: 'delete' ,onClick: (item) => {
              console.log('Excluir:' ,item);
            } ,
          } ] ,
      } }
      appearance={ {
        background: 'bg-slate-100' ,
        border: 'border-slate-300' ,
        header: { background: 'bg-slate-700' ,cell: 'text-white'  } ,
        body: {
          background: 'bg-white' ,
          cell: 'text-slate-700' ,
          border: 'border-b border-slate-200' ,
        } ,
      } }
    />
  ) ,
};

export const WithFooter: Story = {
  render: () => (
    <Table
      items={ users }
      footer={{
        id: {
          text: 'Total Salary',
        },
        salary: {
          render: (items) => items.reduce((total, item) => total + item.salary, 0),
        }
      }}
      headers={ [
        {
          value: 'id' ,
          label: 'ID' ,
          sortable: true ,
        } ,
        { value: 'name' ,label: 'form.label.name' ,sortable: true  } ,
        { value: 'email' ,label: 'form.label.email'  } ,
        { value: 'role' ,label: 'form.label.profile' ,sortable: true  } ,
        {
          value: 'status' ,
          label: 'form.label.status' ,
          format: (value: TUser['status']) => (<span className={ [
            'inline-flex' ,
            'rounded-full' ,
            'px-2.5' ,
            'py-1' ,
            'text-xs' ,
            'font-medium' ,
            value === 'active' ?
              'bg-emerald-100 text-emerald-700' :
              'bg-slate-100 text-slate-500' ].join(' ') }> { value === 'active' ?
            'form.label.active' :
            'form.label.inactive'
          } </span>) ,
        } ,
        { value: 'salary' ,label: 'salary' ,sortable: true  } ,
        {
          value: 'created_at' ,
          label: 'form.label.created_at' ,
          format: (value: string) => new Date(value).toLocaleDateString() ,
        }
        ]}
      actions={ {
        text: 'form.action.actions' ,
        icons: [
          {
            icon: 'show' ,onClick: (item) => {
              console.log('Visualizar:' ,item);
            } ,
          } ,{
            icon: 'edit' ,onClick: (item) => {
              console.log('Editar:' ,item);
            } ,
          } ,{
            icon: 'delete' ,onClick: (item) => {
              console.log('Excluir:' ,item);
            } ,
          } ] ,
      } }
      appearance={ {
        background: 'bg-slate-100' ,
        border: 'border-slate-300' ,
        footer: { background: 'bg-slate-700' ,cell: 'text-white'  } ,
        header: { background: 'bg-slate-700' ,cell: 'text-white'  } ,
        body: {
          background: 'bg-white' ,
          cell: 'text-slate-700' ,
          border: 'border-b border-slate-200' ,
        } ,
      } }
    />
  ) ,
};