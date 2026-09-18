import type { Meta ,StoryObj } from '@storybook/react-vite';

import { Text } from '@machado-repo/ui';
import {
  OTag ,
  OWrap ,
  OTone ,
  OSize ,
  OAlign ,
  OWeight ,
  ODisplay ,
  OLeading ,
  OTracking ,
  OLineClamp ,
  OTransform ,
  OFontFamily ,
  ODecoration ,
  OWhitespace ,
  OBreak ,
} from '@machado-repo/theme';

const meta = {
  tags: ['autodocs'] ,
  args: {
    children: (
      <div>
        <h1>Text</h1>
      </div>
    ),
  } ,
  title: 'Primitives/Text' ,
  argTypes: {
    as: {
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'p' },
      },
      control: { type: 'select' },
      options: OTag
    },
    wrap: {
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined },
      },
      control: { type: 'select' },
      options: OWrap
    },
    tone: {
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined }
      },
      control: { type: 'select' },
      options: OTone
    },
    size: {
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined }
      },
      control: { type: 'select' },
      options: OSize
    },
    align: {
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined }
      },
      control: { type: 'select' },
      options: OAlign
    },
    color: { control: 'color' },
    srOnly: {
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
      control: { type: 'boolean' },
    },
    italic: {
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
      control: { type: 'boolean' },
    },
    weight: {
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined }
      },
      control: { type: 'select' },
      options: OWeight
    },
    display: {
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined }
      },
      control: { type: 'select' },
      options: ODisplay
    },
    leading: {
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined }
      },
      control: { type: 'select' },
      options: OLeading
    },
    truncate: {
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
      control: { type: 'boolean' },
    },
    tracking: {
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined }
      },
      control: { type: 'select' },
      options: OTracking
    },
    className: {
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined },
      },
    },
    lineClamp: {
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined }
      },
      control: { type: 'select' },
      options: OLineClamp
    },
    transform: {
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined }
      },
      control: { type: 'select' },
      options: OTransform
    },
    fontFamily: {
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined }
      },
      control: { type: 'select' },
      options: OFontFamily
    },
    decoration: {
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined }
      },
      control: { type: 'select' },
      options: ODecoration
    },
    whitespace: {
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined }
      },
      control: { type: 'select' },
      options: OWhitespace
    },
    breakStrategy: {
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined }
      },
      control: { type: 'select' },
      options: OBreak
    },
  } ,
  component: Text ,
  decorators: [
    (Story) => (
      <div style={ { height: '50vh' ,width: '90vh' } }>
        <Story/>
      </div>
    ) ,
  ] ,
  parameters: { layout: 'centered' } ,

} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };