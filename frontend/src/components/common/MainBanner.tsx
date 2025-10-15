import { Stack, Title, Text } from '@mantine/core';

export function MainBanner() {
  return (
    <Stack gap='md' align='center'>
      <Title order={1} size='4rem' c='blue' ta='center'>
        Codex
      </Title>
      <Text size='xl' c='dimmed' ta='center' maw={600}>
        Connect with leading researchers and scientists from around the world.
        Discover expertise, collaborate on projects, and advance your research.
      </Text>
    </Stack>
  );
}
