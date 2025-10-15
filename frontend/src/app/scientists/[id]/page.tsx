'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Text,
  Stack,
  Grid,
  GridCol,
  Card,
  Avatar,
  Badge,
  Group,
  Button,
  Divider,
  List,
  ThemeIcon,
  Flex,
  Box,
} from '@mantine/core';
import {
  IconMapPin,
  IconMail,
  IconStar,
  IconUsers,
  IconBook,
  IconCalendar,
  IconCheck,
  IconArrowLeft,
} from '@tabler/icons-react';
import Link from 'next/link';
import { Scientist } from '@shared/types/scientist.types';

// Mock data - in real app this would come from API
const mockScientist: Scientist = {
  id: '1',
  name: 'Dr. Sarah Chen',
  email: 'sarah.chen@university.edu',
  title: 'Professor of Computer Science',
  specialization: ['Machine Learning', 'AI', 'Data Science', 'Deep Learning'],
  institution: 'Massachusetts Institute of Technology',
  city: 'Cambridge',
  country: 'USA',
  bio: 'Dr. Sarah Chen is a leading researcher in machine learning with over 15 years of experience. She has published extensively in top-tier conferences and journals, with a focus on deep learning applications in computer vision and natural language processing. Her work has been cited over 10,000 times and she has received numerous awards for her contributions to the field.',
  researchInterests: [
    'Deep Learning',
    'Neural Networks',
    'Computer Vision',
    'Natural Language Processing',
    'Reinforcement Learning',
    'Transfer Learning',
  ],
  experience: 15,
  publications: 89,
  rating: 4.8,
  isAvailable: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export default function ScientistDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [scientist, setScientist] = useState<Scientist | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setScientist(mockScientist);
      setLoading(false);
    }, 500);
  }, [params.id]);

  if (loading) {
    return (
      <Container size='md' py='xl'>
        <Text>Loading...</Text>
      </Container>
    );
  }

  if (!scientist) {
    return (
      <Container size='md' py='xl'>
        <Text>Scientist not found</Text>
      </Container>
    );
  }

  return (
    <Container size='lg' py='xl'>
      <Stack gap='xl'>
        {/* Back Button */}
        <Button
          component={Link}
          href='/scientists'
          variant='subtle'
          leftSection={<IconArrowLeft size={16} />}
          size='sm'
        >
          Back to Scientists
        </Button>

        {/* Header */}
        <Card p='xl' shadow='sm' radius='md'>
          <Grid>
            <GridCol span={{ base: 12, md: 3 }}>
              <Stack align='center' gap='md'>
                <Avatar size={120} color='blue' radius='md'>
                  {scientist.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </Avatar>
                <Badge
                  color={scientist.isAvailable ? 'green' : 'gray'}
                  variant='light'
                  size='lg'
                >
                  {scientist.isAvailable ? 'Available' : 'Currently Busy'}
                </Badge>
              </Stack>
            </GridCol>
            <GridCol span={{ base: 12, md: 9 }}>
              <Stack gap='md'>
                <Title order={1} size='2.5rem' c='blue'>
                  {scientist.name}
                </Title>
                <Text size='xl' c='dimmed'>
                  {scientist.title}
                </Text>
                <Text size='lg' fw={500}>
                  {scientist.institution}
                </Text>

                <Group gap='md'>
                  <Group gap='xs'>
                    <IconMapPin size={16} />
                    <Text>
                      {scientist.city}, {scientist.country}
                    </Text>
                  </Group>
                  <Group gap='xs'>
                    <IconMail size={16} />
                    <Text>{scientist.email}</Text>
                  </Group>
                </Group>

                <Group gap='md'>
                  <Group gap='xs'>
                    <IconStar size={16} fill='currentColor' />
                    <Text fw={500}>{scientist.rating}</Text>
                  </Group>
                  <Group gap='xs'>
                    <IconBook size={16} />
                    <Text>{scientist.publications} publications</Text>
                  </Group>
                  <Group gap='xs'>
                    <IconCalendar size={16} />
                    <Text>{scientist.experience} years experience</Text>
                  </Group>
                </Group>
              </Stack>
            </GridCol>
          </Grid>
        </Card>

        {/* Bio */}
        <Card p='xl' shadow='sm' radius='md'>
          <Stack gap='md'>
            <Title order={2}>About</Title>
            <Text>{scientist.bio}</Text>
          </Stack>
        </Card>

        {/* Specializations */}
        <Card p='xl' shadow='sm' radius='md'>
          <Stack gap='md'>
            <Title order={2}>Specializations</Title>
            <Group gap='sm'>
              {scientist.specialization.map((spec) => (
                <Badge key={spec} variant='light' size='lg' color='blue'>
                  {spec}
                </Badge>
              ))}
            </Group>
          </Stack>
        </Card>

        {/* Research Interests */}
        <Card p='xl' shadow='sm' radius='md'>
          <Stack gap='md'>
            <Title order={2}>Research Interests</Title>
            <List
              spacing='sm'
              size='md'
              center
              icon={
                <ThemeIcon color='blue' size={20} radius='xl'>
                  <IconCheck size={12} />
                </ThemeIcon>
              }
            >
              {scientist.researchInterests.map((interest) => (
                <List.Item key={interest}>{interest}</List.Item>
              ))}
            </List>
          </Stack>
        </Card>

        {/* Stats */}
        <Card p='xl' shadow='sm' radius='md'>
          <Stack gap='md'>
            <Title order={2}>Research Statistics</Title>
            <Grid>
              <GridCol span={{ base: 12, sm: 4 }}>
                <Stack align='center' gap='sm'>
                  <Text size='3rem' fw={700} c='blue'>
                    {scientist.publications}
                  </Text>
                  <Text size='lg' fw={500}>
                    Publications
                  </Text>
                  <Text size='sm' c='dimmed' ta='center'>
                    Peer-reviewed articles in top journals
                  </Text>
                </Stack>
              </GridCol>
              <GridCol span={{ base: 12, sm: 4 }}>
                <Stack align='center' gap='sm'>
                  <Text size='3rem' fw={700} c='blue'>
                    {scientist.experience}
                  </Text>
                  <Text size='lg' fw={500}>
                    Years Experience
                  </Text>
                  <Text size='sm' c='dimmed' ta='center'>
                    Research and teaching experience
                  </Text>
                </Stack>
              </GridCol>
              <GridCol span={{ base: 12, sm: 4 }}>
                <Stack align='center' gap='sm'>
                  <Group gap='xs'>
                    <IconStar size={24} fill='currentColor' />
                    <Text size='3rem' fw={700} c='blue'>
                      {scientist.rating}
                    </Text>
                  </Group>
                  <Text size='lg' fw={500}>
                    Rating
                  </Text>
                  <Text size='sm' c='dimmed' ta='center'>
                    Based on peer reviews
                  </Text>
                </Stack>
              </GridCol>
            </Grid>
          </Stack>
        </Card>

        {/* Contact Actions */}
        <Card
          p='xl'
          shadow='sm'
          radius='md'
          style={{ backgroundColor: '#f8f9fa' }}
        >
          <Stack gap='md' align='center'>
            <Title order={2} ta='center'>
              Interested in Collaboration?
            </Title>
            <Text c='dimmed' ta='center' maw={500}>
              Connect with {scientist.name} to discuss potential research
              collaborations, joint projects, or academic partnerships.
            </Text>
            <Group gap='md'>
              <Button
                size='lg'
                color='blue'
                leftSection={<IconMail size={20} />}
                disabled={!scientist.isAvailable}
              >
                {scientist.isAvailable
                  ? 'Send Message'
                  : 'Currently Unavailable'}
              </Button>
              <Button
                size='lg'
                variant='outline'
                color='blue'
                leftSection={<IconUsers size={20} />}
              >
                View Collaborators
              </Button>
            </Group>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
