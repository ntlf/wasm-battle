import { ComponentStory, ComponentMeta } from "@storybook/react";
import { within, userEvent } from "@storybook/testing-library";

import { expect, jest } from "@storybook/jest";

import { Button } from "ui-components";

export default {
  title: "UI Components/Button",
  component: Button,
  argTypes: {
    size: { control: "select" },
    variant: { control: "select" },
  },
  args: {
    children: "Button",
  },
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  variant: "primary",
  size: "md",
};

export const Secondary = Template.bind({});
Secondary.args = {
  variant: "secondary",
};

export const White = Template.bind({});
White.args = {
  variant: "white",
};

const handleClick = jest.fn();

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
  onClick: handleClick,
};

Disabled.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const btn = await canvas.getByRole("button");

  await userEvent.click(btn);

  await expect(handleClick).not.toHaveBeenCalled();
};
