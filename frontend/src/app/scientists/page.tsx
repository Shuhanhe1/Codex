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
  Button,
  Group,
  Badge,
  Card,
  Avatar,
  Loader,
  Alert,
} from '@mantine/core';
import { IconUsers, IconAlertCircle } from '@tabler/icons-react';
import { ScientistSearchResult } from 'shared';
import { MainBanner } from '../../components/common/MainBanner';
import { ScientistSearchFilters } from '../../components/common/ScientistSearchFilters';
import { scientistApiClient } from '../../lib/api/scientist.api';
import Link from 'next/link';

export default function ScientistsPage() {
  const searchParams = useSearchParams();
  const [scientists, setScientists] = useState<ScientistSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchScientists = useCallback(
    async (query: string, city: string | null = null) => {
      setLoading(true);
      setError(null);

      try {
        const searchParams: { keywords?: string[]; affiliations?: string[] } =
          {};

        if (query.trim()) {
          searchParams.keywords = [query.trim()];
        }

        if (city) {
          searchParams.affiliations = [city];
        }

        const { data } = await scientistApiClient.searchScientists(
          searchParams,
          1,
          20
        );

        console.log('data', data);

        setScientists(data);
      } catch (err) {
        setError('Failed to search scientists. Please try again.');
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleSearch = useCallback(
    (filters: { searchQuery: string; selectedCity?: string | null }) => {
      searchScientists(filters.searchQuery, filters.selectedCity || null);
    },
    [searchScientists]
  );

  // Initialize from URL parameters
  useEffect(() => {
    const urlKeywords = searchParams.get('keywords');
    const urlCity = searchParams.get('affiliation');

    // Perform initial search if parameters exist
    if (urlKeywords || urlCity) {
      searchScientists(urlKeywords || '', urlCity);
    }
  }, [searchParams, searchScientists]);

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
            <ScientistSearchFilters onSubmit={handleSearch} loading={loading} />
          </Stack>
        </Card>

        {/* Results Header */}
        <Group justify='space-between'>
          <Text size='lg' fw={500}>
            {loading ? 'Searching...' : `${scientists.length} scientists found`}
          </Text>
          {!loading && (
            <Group gap='xs'>
              <IconUsers size={16} />
              <Text size='sm' c='dimmed'>
                {scientists.length} results
              </Text>
            </Group>
          )}
        </Group>

        {/* Error State */}
        {error && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            color='red'
            variant='light'
          >
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <Card p='xl' style={{ textAlign: 'center' }}>
            <Stack gap='md' align='center'>
              <Loader size='lg' />
              <Text>Searching for scientists...</Text>
            </Stack>
          </Card>
        )}

        {/* Scientists Grid */}
        {!loading && (
          <Grid>
            {scientists.map((scientist, index) => (
              <GridCol
                key={`${scientist.name}-${index}`}
                span={{ base: 12, sm: 6, lg: 4 }}
              >
                <Card
                  p='md'
                  shadow='sm'
                  radius='md'
                  style={{
                    height: '100%',
                    border: '1px solid #e9ecef',
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
                    </Group>

                    {/* Basic Info */}
                    <Stack gap='xs'>
                      <Title order={4} size='md'>
                        {scientist.name}
                      </Title>
                      <Text size='sm' fw={500}>
                        {scientist.affiliation}
                      </Text>
                      {scientist.orcid && (
                        <Group gap='xs'>
                          <Link
                            href={`https://orcid.org/${scientist.orcid}`}
                            target='_blank'
                          >
                            <Badge
                              color='green'
                              variant='light'
                              size='lg'
                              style={{ cursor: 'pointer' }}
                            >
                              ORCID Profile: {scientist.orcid}
                            </Badge>
                          </Link>
                        </Group>
                      )}
                    </Stack>

                    {/* Action Buttons */}
                    {/*                     <Stack gap='sm'>
                      <Button fullWidth variant='outline' color='blue' disabled>
                        View Profile
                      </Button>
                      <Button fullWidth variant='filled' color='blue'>
                        Contact Scientist
                      </Button>
                    </Stack> */}
                  </Stack>
                </Card>
              </GridCol>
            ))}
          </Grid>
        )}

        {/* No Results */}
        {!loading && scientists.length === 0 && !error && (
          <Card p='xl' shadow='sm' radius='md' style={{ textAlign: 'center' }}>
            <Stack gap='md' align='center'>
              <IconUsers size={48} color='#868e96' />
              <Title order={3} c='dimmed'>
                No scientists found
              </Title>
              <Text c='dimmed'>
                Try adjusting your search criteria or selecting a different
                affiliation.
              </Text>
              <Button
                variant='outline'
                onClick={() => {
                  setScientists([]);
                }}
              >
                Clear Results
              </Button>
            </Stack>
          </Card>
        )}
      </Stack>
    </Container>
  );
}
