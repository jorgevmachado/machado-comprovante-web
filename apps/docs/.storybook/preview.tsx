import type { Preview } from '@storybook/react-vite'
import '@machado-repo/ui/styles.css';
import { UIProvider } from '@machado-repo/ui'

const preview: Preview = {
  decorators: [
    (Story) => (
      <UIProvider>
        <Story />
      </UIProvider>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
};

export default preview;