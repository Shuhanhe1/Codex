'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Container,
  Title,
  Text,
  Stack,
  Grid,
  GridCol,
  TextInput,
  Select,
  Button,
  Group,
  Badge,
  Card,
  Avatar,
  Rating,
  Divider,
} from '@mantine/core';
import {
  IconSearch,
  IconMapPin,
  IconStar,
  IconUsers,
  IconFilter,
  IconSortAscending,
} from '@tabler/icons-react';
import { Scientist, City } from '@shared/types/scientist.types';
import Link from 'next/link';
import { MainBanner } from '../../components/common/MainBanner';

// Mock data for demonstration
const mockCities: City[] = [
  {
    id: '1',
    name: 'New York',
    country: 'USA',
    region: 'Northeast',
    scientistCount: 156,
  },
  {
    id: '2',
    name: 'San Francisco',
    country: 'USA',
    region: 'West Coast',
    scientistCount: 89,
  },
  {
    id: '3',
    name: 'London',
    country: 'UK',
    region: 'England',
    scientistCount: 134,
  },
  {
    id: '4',
    name: 'Berlin',
    country: 'Germany',
    region: 'Europe',
    scientistCount: 78,
  },
  {
    id: '5',
    name: 'Tokyo',
    country: 'Japan',
    region: 'Asia',
    scientistCount: 92,
  },
  {
    id: '6',
    name: 'Toronto',
    country: 'Canada',
    region: 'North America',
    scientistCount: 67,
  },
];

const mockScientists: Scientist[] = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    email: 'sarah.chen@university.edu',
    title: 'Professor of Computer Science',
    specialization: ['Machine Learning', 'AI', 'Data Science'],
    institution: 'MIT',
    city: 'New York',
    country: 'USA',
    bio: 'Leading researcher in machine learning with 15+ years of experience.',
    researchInterests: ['Deep Learning', 'Neural Networks', 'Computer Vision'],
    experience: 15,
    publications: 89,
    rating: 4.8,
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Dr. Michael Rodriguez',
    email: 'm.rodriguez@tech.edu',
    title: 'Associate Professor',
    specialization: ['Quantum Computing', 'Physics'],
    institution: 'Stanford University',
    city: 'San Francisco',
    country: 'USA',
    bio: 'Expert in quantum computing and theoretical physics.',
    researchInterests: ['Quantum Algorithms', 'Quantum Mechanics'],
    experience: 12,
    publications: 67,
    rating: 4.6,
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Dr. Emma Thompson',
    email: 'e.thompson@imperial.ac.uk',
    title: 'Senior Research Fellow',
    specialization: ['Biotechnology', 'Genetics'],
    institution: 'Imperial College London',
    city: 'London',
    country: 'UK',
    bio: 'Biotechnology researcher focusing on genetic engineering.',
    researchInterests: ['CRISPR', 'Gene Therapy', 'Molecular Biology'],
    experience: 10,
    publications: 45,
    rating: 4.7,
    isAvailable: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    name: 'Dr. Hans Mueller',
    email: 'h.mueller@mpg.de',
    title: 'Research Director',
    specialization: ['Physics', 'Materials Science'],
    institution: 'Max Planck Institute',
    city: 'Berlin',
    country: 'Germany',
    bio: 'Materials science expert with focus on renewable energy.',
    researchInterests: ['Solar Cells', 'Nanomaterials', 'Energy Storage'],
    experience: 18,
    publications: 112,
    rating: 4.9,
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function ScientistsPage() {
  const searchParams = useSearchParams();
  const [scientists] = useState<Scientist[]>(mockScientists);
  const [filteredScientists, setFilteredScientists] =
    useState<Scientist[]>(mockScientists);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string | null>(null);

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      let filtered = scientists;

      if (query) {
        filtered = filtered.filter(
          (scientist) =>
            scientist.name.toLowerCase().includes(query.toLowerCase()) ||
            scientist.specialization.some((spec) =>
              spec.toLowerCase().includes(query.toLowerCase())
            ) ||
            scientist.researchInterests.some((interest) =>
              interest.toLowerCase().includes(query.toLowerCase())
            )
        );
      }

      if (selectedCity) {
        filtered = filtered.filter(
          (scientist) => scientist.city === selectedCity
        );
      }

      if (sortBy === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating);
      } else if (sortBy === 'experience') {
        filtered.sort((a, b) => b.experience - a.experience);
      } else if (sortBy === 'publications') {
        filtered.sort((a, b) => b.publications - a.publications);
      }

      setFilteredScientists(filtered);
    },
    [scientists, selectedCity, sortBy]
  );

  const handleCityChange = (city: string | null) => {
    setSelectedCity(city);
    handleSearch(searchQuery);
  };

  // Initialize from URL parameters
  useEffect(() => {
    const urlQuery = searchParams.get('q');
    const urlCity = searchParams.get('city');

    if (urlQuery) {
      setSearchQuery(urlQuery);
    }
    if (urlCity) {
      setSelectedCity(urlCity);
    }

    // Apply initial filters
    let filtered = scientists;

    if (urlQuery) {
      filtered = filtered.filter(
        (scientist) =>
          scientist.name.toLowerCase().includes(urlQuery.toLowerCase()) ||
          scientist.specialization.some((spec) =>
            spec.toLowerCase().includes(urlQuery.toLowerCase())
          ) ||
          scientist.researchInterests.some((interest) =>
            interest.toLowerCase().includes(urlQuery.toLowerCase())
          )
      );
    }

    if (urlCity) {
      filtered = filtered.filter((scientist) => scientist.city === urlCity);
    }

    setFilteredScientists(filtered);
  }, [searchParams, scientists]);

  useEffect(() => {
    handleSearch(searchQuery);
  }, [handleSearch, searchQuery]);

  return (
    <Container size='xl' py='xl'>
      <Stack gap='xl'>
        {/* Header */}
        <MainBanner />

        {/* Search and Filters */}
        <Card
          p='xl'
          shadow='sm'
          radius='md'
          style={{ backgroundColor: '#f8f9fa' }}
        >
          <Stack gap='md'>
            <Group justify='space-between' align='flex-end'>
              <TextInput
                placeholder='Search scientists by name, specialization, or research interests...'
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                leftSection={<IconSearch size={16} />}
                size='md'
                style={{ flex: 1 }}
              />
              <Button
                leftSection={<IconFilter size={16} />}
                variant='outline'
                size='md'
              >
                Filters
              </Button>
            </Group>

            <Group gap='md'>
              <Select
                placeholder='Select a city'
                data={mockCities.map((city) => ({
                  value: city.name,
                  label: `${city.name}, ${city.country} (${city.scientistCount} scientists)`,
                }))}
                value={selectedCity}
                onChange={handleCityChange}
                leftSection={<IconMapPin size={16} />}
                style={{ minWidth: 250 }}
                clearable
              />
              <Select
                placeholder='Sort by'
                data={[
                  { value: 'rating', label: 'Rating' },
                  { value: 'experience', label: 'Experience' },
                  { value: 'publications', label: 'Publications' },
                ]}
                value={sortBy}
                onChange={setSortBy}
                leftSection={<IconSortAscending size={16} />}
                style={{ minWidth: 150 }}
                clearable
              />
            </Group>
          </Stack>
        </Card>

        {/* Results Header */}
        <Group justify='space-between'>
          <Text size='lg' fw={500}>
            {filteredScientists.length} scientists found
            {selectedCity && ` in ${selectedCity}`}
          </Text>
          <Group gap='xs'>
            <IconUsers size={16} />
            <Text size='sm' c='dimmed'>
              {filteredScientists.filter((s) => s.isAvailable).length} available
            </Text>
          </Group>
        </Group>

        {/* Scientists Grid */}
        <Grid>
          {filteredScientists.map((scientist) => (
            <GridCol key={scientist.id} span={{ base: 12, sm: 6, lg: 4 }}>
              <Card
                p='md'
                shadow='sm'
                radius='md'
                style={{
                  height: '100%',
                  border: scientist.isAvailable
                    ? '2px solid #228be6'
                    : '1px solid #e9ecef',
                }}
              >
                <Stack gap='md'>
                  {/* Header */}
                  <Group justify='space-between' align='flex-start'>
                    <Avatar size='lg' color='blue' radius='md'>
                      {scientist.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </Avatar>
                    <Stack gap='xs' align='flex-end'>
                      <Badge
                        color={scientist.isAvailable ? 'green' : 'gray'}
                        variant='light'
                        size='sm'
                      >
                        {scientist.isAvailable ? 'Available' : 'Busy'}
                      </Badge>
                      <Rating value={scientist.rating} readOnly size='sm' />
                    </Stack>
                  </Group>

                  {/* Basic Info */}
                  <Stack gap='xs'>
                    <Title order={4} size='md'>
                      {scientist.name}
                    </Title>
                    <Text size='sm' c='dimmed'>
                      {scientist.title}
                    </Text>
                    <Text size='sm' fw={500}>
                      {scientist.institution}
                    </Text>
                    <Group gap='xs'>
                      <IconMapPin size={14} />
                      <Text size='sm' c='dimmed'>
                        {scientist.city}, {scientist.country}
                      </Text>
                    </Group>
                  </Stack>

                  {/* Specializations */}
                  <Stack gap='xs'>
                    <Text size='sm' fw={500}>
                      Specializations:
                    </Text>
                    <Group gap='xs'>
                      {scientist.specialization.slice(0, 2).map((spec) => (
                        <Badge key={spec} variant='light' size='sm'>
                          {spec}
                        </Badge>
                      ))}
                      {scientist.specialization.length > 2 && (
                        <Badge variant='light' size='sm'>
                          +{scientist.specialization.length - 2} more
                        </Badge>
                      )}
                    </Group>
                  </Stack>

                  {/* Stats */}
                  <Divider />
                  <Group justify='space-between'>
                    <Stack gap='xs' align='center'>
                      <Text size='lg' fw={700} c='blue'>
                        {scientist.experience}
                      </Text>
                      <Text size='xs' c='dimmed'>
                        Years Exp
                      </Text>
                    </Stack>
                    <Stack gap='xs' align='center'>
                      <Text size='lg' fw={700} c='blue'>
                        {scientist.publications}
                      </Text>
                      <Text size='xs' c='dimmed'>
                        Publications
                      </Text>
                    </Stack>
                    <Stack gap='xs' align='center'>
                      <Group gap='xs'>
                        <IconStar size={14} fill='currentColor' />
                        <Text size='lg' fw={700} c='blue'>
                          {scientist.rating}
                        </Text>
                      </Group>
                      <Text size='xs' c='dimmed'>
                        Rating
                      </Text>
                    </Stack>
                  </Group>

                  {/* Action Buttons */}
                  <Stack gap='sm'>
                    <Button
                      component={Link}
                      href={`/scientists/${scientist.id}`}
                      fullWidth
                      variant='outline'
                      color='blue'
                    >
                      View Profile
                    </Button>
                    <Button
                      fullWidth
                      variant={scientist.isAvailable ? 'filled' : 'outline'}
                      color='blue'
                      disabled={!scientist.isAvailable}
                    >
                      {scientist.isAvailable
                        ? 'Contact Scientist'
                        : 'Currently Busy'}
                    </Button>
                  </Stack>
                </Stack>
              </Card>
            </GridCol>
          ))}
        </Grid>

        {/* No Results */}
        {filteredScientists.length === 0 && (
          <Card p='xl' shadow='sm' radius='md' style={{ textAlign: 'center' }}>
            <Stack gap='md' align='center'>
              <IconUsers size={48} color='#868e96' />
              <Title order={3} c='dimmed'>
                No scientists found
              </Title>
              <Text c='dimmed'>
                Try adjusting your search criteria or selecting a different
                city.
              </Text>
              <Button
                variant='outline'
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCity(null);
                  setSortBy(null);
                  setFilteredScientists(scientists);
                }}
              >
                Clear Filters
              </Button>
            </Stack>
          </Card>
        )}
      </Stack>
    </Container>
  );
}
