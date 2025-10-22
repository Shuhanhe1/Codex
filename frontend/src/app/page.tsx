'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Text, Stack, Card } from '@mantine/core';
import { MainBanner } from '../components/common/MainBanner';
import { ScientistSearchFilters } from '../components/common/SearchFilters';
import { PopularCitiesSection } from '../components/sections/PopularCitiesSection';
import { ResearchFieldsSection } from '../components/sections/ResearchFieldsSection';

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.append('keywords', searchQuery.trim());
    }
    if (selectedCity) {
      params.append('affiliation', selectedCity);
    }

    const queryString = params.toString();
    router.push(`/scientists${queryString ? `?${queryString}` : ''}`);
  };

  const handleCitySelect = (city: string | null) => {
    setSelectedCity(city);
    if (city) {
      const params = new URLSearchParams();
      params.append('affiliation', city);
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
          style={{ width: '100%', maxWidth: 800 }}
        >
          <Stack gap='lg'>
            <Text size='lg' fw={500} ta='center'>
              Search for Scientists
            </Text>
            <ScientistSearchFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSearch={handleSearch}
              selectedCity={selectedCity}
              onCityChange={setSelectedCity}
            />
          </Stack>
        </Card>

        {/* Cities Grid */}
        <Stack gap='md' w='100%'>
          <PopularCitiesSection onCitySelect={handleCitySelect} />
        </Stack>

        {/* Research Fields Grid */}
        <Stack gap='md' w='100%'>
          <ResearchFieldsSection
            onFieldSelect={(field) => {
              if (field) {
                setSearchQuery(field);
                handleSearch();
              }
            }}
          />
        </Stack>
      </Stack>
    </Container>
  );
}
