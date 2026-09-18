import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { DatePicker } from '@machado-repo/ui';

const meta = {
  title: "Components/DatePicker",
  component: DatePicker,
  parameters: {
    layout: "centered",
  },
  args: {
    disabled: false,
    placeholder: "Selecione uma data",
  },
} satisfies Meta<typeof DatePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
  args: {
    value: new Date(2026, 8, 18),
  },
};

export const WithMinDate: Story = {
  args: {
    minDate: new Date(2026, 8, 10),
  },
};

export const WithMaxDate: Story = {
  args: {
    maxDate: new Date(2026, 8, 25),
  },
};

export const WithDateRange: Story = {
  args: {
    minDate: new Date(2026, 8, 10),
    maxDate: new Date(2026, 8, 25),
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState<Date | null>(
      new Date(2026, 8, 18),
    );

    return (
      <div className="w-[296px] space-y-3">
        <DatePicker value={value} onChange={setValue} />

        <p className="text-sm text-muted-foreground">
          Valor selecionado:{" "}
          {value
            ? value.toLocaleDateString("pt-BR")
            : "Nenhuma data selecionada"}
        </p>
      </div>
    );
  },
};