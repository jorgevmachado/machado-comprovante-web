import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { AlertProvider, useAlert, Button, type TShowAlert } from '@machado-repo/ui';

const meta = {
  tags: ['autodocs'],
  title: 'Components/Alert/Hook',
  component: AlertProvider,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ height: '100vh' }}>
        <Story/>
      </div>
    ),
  ],
} satisfies Meta<typeof AlertProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

const CustomAlert: React.FC = ({ withoutTitle = false }: {withoutTitle?: boolean}) => {
  const { showAlert, alerts } = useAlert();

  const listVariantAlerts: Array<TShowAlert> = [
    { variant: 'info', title: 'Alert Info', message: 'This is an info alert' },
    { variant: 'error', title: 'Alert Error', message: 'This is an error alert' },
    { variant: 'success', title: 'Alert Success', message: 'This is a success alert' },
    { variant: 'warning', title: 'Alert Warning', message: 'This is a warning alert' },
  ];

  const listVariantAlertsButtons = {
    info: { tone: 'info', label: 'Add Info Alert' },
    error: { tone: 'danger', label: 'Add Error Alert' },
    success: { tone: 'success', label: 'Add Success Alert' },
    warning: { tone: 'warning', label: 'Add Warning Alert' },
  }

  const currentMessage = (message: string) => {
    return `${message} generated in ${new Date().toLocaleTimeString()}`
  }

  return (
    <div>
      <h3>Add Alert</h3>
      <div style={{ display: 'flex', width: '350px', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
        {listVariantAlerts.map((alert, index) => {
          const buttonProps = listVariantAlertsButtons[alert.variant];
          const showAlertProps = {
            ...alert,
            title: withoutTitle ? undefined : alert.title,
            message: currentMessage(alert.message),
          }
          return (
            <Button key={index} tone={buttonProps.tone} onClick={() => showAlert(showAlertProps)}>
              {buttonProps.label}
            </Button>
          )
        })}
      </div>
      <div style={{ marginTop: 24 }}>
        <strong>Active alerts:</strong>
        <ul>
          {alerts.map((a) => (
            <li key={a.id} style={{ color: "#999" }}>
              {a.title ? `${a.title}: ${a.message}` : a.message}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export const Default: Story = {
  render: () => (
    <AlertProvider>
      <CustomAlert />
    </AlertProvider>
  )
};

export const WithoutTitle: Story = {
  render: () => (
    <AlertProvider>
      <CustomAlert withoutTitle />
    </AlertProvider>
  )
};