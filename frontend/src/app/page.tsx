'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Text, Button, Stack, Card, TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { MainBanner } from '../components/common/MainBanner';
import { PopularCitiesSection } from '../components/sections/PopularCitiesSection';
import { ResearchFieldsSection } from '../components/sections/ResearchFieldsSection';

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.append('q', searchQuery.trim());
    }
    if (selectedCity) {
      params.append('city', selectedCity);
    }

    const queryString = params.toString();
    router.push(`/scientists${queryString ? `?${queryString}` : ''}`);
  };

  const handleCitySelect = (city: string | null) => {
    setSelectedCity(city);
    if (city) {
      const params = new URLSearchParams();
      params.append('city', city);
      router.push(`/scientists?${params.toString()}`);
    }
  };

  return (
    <Container size='lg' py='xl'>
      <Stack gap='xl' align='center'>
        {/* Header */}
        <MainBanner />

        {/* Search Interface */}
        <Card
          p='xl'
          shadow='sm'
          radius='md'
          style={{ width: '100%', maxWidth: 600 }}
        >
          <Stack gap='lg'>
            {/* Search Bar */}
            <Stack gap='md'>
              <Text size='lg' fw={500} ta='center'>
                Search for Scientists
              </Text>
              <TextInput
                placeholder='Search by name, specialization, or research interests...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftSection={<IconSearch size={20} />}
                size='lg'
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
              <Button
                onClick={handleSearch}
                size='lg'
                fullWidth
                color='blue'
                leftSection={<IconSearch size={20} />}
              >
                Search Scientists
              </Button>
            </Stack>
          </Stack>
        </Card>

        {/* Cities Grid */}
        <Stack gap='md' w='100%'>
          <PopularCitiesSection onCitySelect={handleCitySelect} />
        </Stack>

        {/* Research Fields Grid */}
        <Stack gap='md' w='100%'>
          <ResearchFieldsSection onFieldSelect={handleCitySelect} />
        </Stack>
      </Stack>
    </Container>
  );
}
