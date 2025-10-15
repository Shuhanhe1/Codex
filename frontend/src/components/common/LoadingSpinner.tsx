import { Loader, Center } from '@mantine/core';

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullHeight?: boolean;
}

export const LoadingSpinner = ({
  size = 'md',
  fullHeight = true,
}: LoadingSpinnerProps) => {
  return (
    <Center style={fullHeight ? { minHeight: '200px' } : undefined}>
      <Loader size={size} />
    </Center>
  );
};
