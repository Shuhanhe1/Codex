'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
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
import { PaginatedResponse, ScientistSearchResult } from 'shared';
import { MainBanner } from '../../components/common/MainBanner';
import { ScientistSearchFilters } from '../../components/common/ScientistSearchFilters';
import { PaginationControls } from '../../components/common/PaginationControls';
import { scientistApiClient } from '../../lib/api/scientist.api';
import Link from 'next/link';

const defaultLimit = 18;

export default function ScientistsPage() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [scientists, setScientists] =
    useState<PaginatedResponse<ScientistSearchResult> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSearchQuery, setCurrentSearchQuery] = useState('');
  const [currentCity, setCurrentCity] = useState<string | null>(null);

  // Function to update URL parameters
  const updateUrlParams = (params: {
    keywords?: string;
    affiliation?: string | null;
    page?: number;
  }) => {
    const urlParams = new URLSearchParams(searchParams.toString());

    if (params.keywords !== undefined) {
      if (params.keywords.trim()) {
        urlParams.set('keywords', params.keywords);
      } else {
        urlParams.delete('keywords');
      }
    }

    if (params.affiliation !== undefined) {
      if (params.affiliation) {
        urlParams.set('affiliation', params.affiliation);
      } else {
        urlParams.delete('affiliation');
      }
    }

    if (params.page !== undefined) {
      urlParams.set('page', params.page.toString());
    }

    const newUrl = `${pathname}?${urlParams.toString()}`;
    window.history.replaceState({}, '', newUrl);
  };

  // Function to parse comma-separated keywords
  const parseKeywords = useCallback((keywordsString: string): string[] => {
    if (!keywordsString.trim()) return [];
    return keywordsString.split(/[,\s]+/).filter((keyword) => keyword.trim());
  }, []);

  const searchScientists = async (params: {
    query: string;
    city?: string | null;
    page?: number;
    limit?: number;
    updateUrl?: boolean;
  }) => {
    const {
      query,
      city = null,
      page = currentPage,
      limit = defaultLimit,
      updateUrl = true,
    } = params;

    setLoading(true);
    setError(null);

    try {
      const searchParams: { keywords?: string[]; affiliations?: string[] } = {};

      // Parse comma-separated keywords
      const keywords = parseKeywords(query);
      if (keywords.length > 0) {
        searchParams.keywords = keywords;
      }

      if (city) {
        searchParams.affiliations = [city];
      }

      const data = await scientistApiClient.searchScientists(
        searchParams,
        page,
        limit
      );

      setScientists(data);

      // Update URL parameters if requested
      if (updateUrl) {
        updateUrlParams({ keywords: query, affiliation: city, page });
      }
    } catch (err) {
      setError('Failed to search scientists. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (filters: {
    searchQuery: string;
    selectedCity?: string | null;
  }) => {
    setCurrentPage(1); // Reset to first page when searching
    setCurrentSearchQuery(filters.searchQuery);
    setCurrentCity(filters.selectedCity || null);
    searchScientists({
      query: filters.searchQuery,
      city: filters.selectedCity || null,
      page: 1,
      limit: defaultLimit,
      updateUrl: true,
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    searchScientists({
      query: currentSearchQuery,
      city: currentCity,
      page,
      limit: defaultLimit,
      updateUrl: true,
    });
  };

  // Initialize from URL parameters
  useEffect(() => {
    const urlKeywords = searchParams.get('keywords');
    const urlCity = searchParams.get('affiliation');
    const urlPage = searchParams.get('page');

    // Update state from URL parameters
    if (urlKeywords !== null) {
      setCurrentSearchQuery(urlKeywords);
    }
    if (urlCity !== null) {
      setCurrentCity(urlCity);
    }
    if (urlPage) {
      const pageNum = parseInt(urlPage, 10);
      if (!isNaN(pageNum) && pageNum > 0) {
        setCurrentPage(pageNum);
      }
    }

    // Perform initial search if parameters exist
    if (urlKeywords || urlCity) {
      const page = urlPage ? parseInt(urlPage, 10) : 1;
      searchScientists({
        query: urlKeywords || '',
        city: urlCity,
        page,
        limit: defaultLimit,
        updateUrl: false, // Don't update URL since we're initializing from URL
      });
    }
  }, []);

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
            <ScientistSearchFilters
              initialValues={{
                searchQuery: currentSearchQuery,
                selectedCity: currentCity,
              }}
              onSubmit={handleSearch}
              loading={loading}
            />
          </Stack>
        </Card>

        {/* Results Header */}
        <Group justify='space-between'>
          <Text size='lg' fw={500}>
            {loading
              ? 'Searching...'
              : scientists?.pagination.total === -1
                ? 'Scientists found (limited dataset)'
                : `${scientists?.pagination.total || 0} scientists found`}
          </Text>
          {!loading && scientists?.pagination.total !== -1 && (
            <Group gap='xs'>
              <IconUsers size={16} />
              <Text size='sm' c='dimmed'>
                {scientists?.pagination.total} results
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
        {!loading && scientists && scientists.data.length > 0 && (
          <Grid>
            {scientists.data.map((scientist, index) => (
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

        {/* Pagination Controls */}
        {!loading && scientists && scientists.data.length > 0 && (
          <PaginationControls
            pagination={scientists.pagination}
            onPageChange={handlePageChange}
            loading={loading}
            showPageSizeSelector={false}
            showResultsInfo={true}
            maxVisiblePages={5}
          />
        )}

        {/* No Results */}
        {!loading && scientists?.data.length === 0 && !error && (
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
                  setScientists(null);
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
