import type { Meta ,StoryObj } from '@storybook/react-vite';

import { Lang } from '@machado-repo/ui';

const meta = {
  tags: ['autodocs'] ,
  title: 'Lang' ,
  component: Lang ,
  parameters: { layout: 'centered' } ,

} satisfies Meta<typeof Lang>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: 'Name', } };

export const SimpleTranslation: Story = {
  args: {
    langKey: 'form.label.name',
  },
};

export const TranslationWithValues: Story = {
  args: {
    langKey: 'form.validation.name.invalid.min_length',
    values: {
      min: 20,
    },
  },
};

export const TranslationWithDefaultValue: Story = {
  args: {
    langKey: 'form.label.not_exist_key',
    children: 'Translation With Default Value',
  },
};

export const ChildrenTranslationKey: Story = {
  args: {
    children: 'form.label.name',
  },
};

export const ElementWithText: Story = {
  render: () => (
    <Lang>
      <span>form.label.email</span>
    </Lang>
  ),
};

export const ElementWithPlainText: Story = {
  render: () => (
    <Lang>
      <span>Element With Plain Text</span>
    </Lang>
  ),
};

export const ElementWithMultipleChildren: Story = {
  render: () => (
    <Lang depth={1}>
      <span>
        form.label.name
        {' '}
        form.label.email
      </span>
    </Lang>
  ),
};

export const ElementWithMixedChildren: Story = {
  render: () => (
    <Lang depth={1}>
      <span>
        form.label.name
        {' '}
        <strong>Not Translate</strong>
        {' '}
        form.label.email
      </span>
    </Lang>
  ),
};

export const NestedElement: Story = {
  render: () => (
    <Lang>
      <div>
        <span>form.label.name</span>
      </div>
    </Lang>
  ),
};

export const NestedElementWithDepth: Story = {
  render: () => (
    <Lang depth={2}>
      <div>
        <span>form.label.name</span>
      </div>
    </Lang>
  ),
};

export const ReactFragment: Story = {
  render: () => (
    <Lang>
      <>
        <span>form.label.name</span>
      </>
    </Lang>
  ),
};

export const ReactFragmentWithDepth: Story = {
  render: () => (
    <Lang depth={2}>
      <>
        <span>form.label.name</span>
      </>
    </Lang>
  ),
};