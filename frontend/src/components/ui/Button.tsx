import {
  Button as MantineButton,
  ButtonProps as MantineButtonProps,
} from '@mantine/core';

interface ButtonProps extends MantineButtonProps {
  children: React.ReactNode;
}

export const Button = ({ children, ...props }: ButtonProps) => {
  return <MantineButton {...props}>{children}</MantineButton>;
};
