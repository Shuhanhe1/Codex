'use client';

import {
  Alert,
  Button,
  Container,
  Stack,
  Title,
  Text,
  Center,
} from '@mantine/core';
import { IconAlertCircle, IconRefresh } from '@tabler/icons-react';

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export const ErrorBoundary = ({ error, reset }: ErrorBoundaryProps) => {
  return (
    <Container size='sm' py='xl'>
      <Center>
        <Stack align='center' gap='md' maw={400}>
          <IconAlertCircle size={48} color='red' />
          <Title order={2} c='red' ta='center'>
            Something went wrong!
          </Title>
          <Text c='dimmed' ta='center' size='sm'>
            {error.message || 'An unexpected error occurred'}
          </Text>
          <Button
            onClick={reset}
            leftSection={<IconRefresh size={16} />}
            variant='outline'
            size='sm'
          >
            Try again
          </Button>
        </Stack>
      </Center>
    </Container>
  );
};
