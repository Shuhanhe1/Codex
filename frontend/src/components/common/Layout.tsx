'use client';

import { AppShell, Text, Group, Button, Container } from '@mantine/core';
import { IconHome, IconCode, IconMicroscope } from '@tabler/icons-react';
import Link from 'next/link';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: true } }}
      padding='md'
    >
      <AppShell.Main>
        <Container size='lg'>{children}</Container>
      </AppShell.Main>
    </AppShell>
  );
};
