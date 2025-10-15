import {
  Card as MantineCard,
  CardProps as MantineCardProps,
} from '@mantine/core';

interface CardProps extends MantineCardProps {
  children: React.ReactNode;
}

export const Card = ({ children, ...props }: CardProps) => {
  return <MantineCard {...props}>{children}</MantineCard>;
};
