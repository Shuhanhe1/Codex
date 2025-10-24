import React, { useMemo } from 'react';
import {
  Pagination,
  Select,
  Group,
  Text,
  Stack,
  Box,
  Flex,
} from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { PaginationMeta } from 'shared';

// Define allowed page sizes as a const assertion for better type safety
const PAGE_SIZE_OPTIONS = [5, 10, 20, 50] as const;
type PageSize = (typeof PAGE_SIZE_OPTIONS)[number];

interface PaginationControlsProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: PageSize) => void;
  loading?: boolean;
  showPageSizeSelector?: boolean;
  showResultsInfo?: boolean;
  maxVisiblePages?: number;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  pagination,
  onPageChange,
  onLimitChange,
  loading = false,
  showPageSizeSelector = true,
  showResultsInfo = true,
  maxVisiblePages = 5,
}) => {
  const { page, limit, totalPages, total } = pagination;

  // Calculate the range of items being displayed
  const itemRange = useMemo(() => {
    if (total === -1) {
      // Unknown total - show current page range
      const start = (page - 1) * limit + 1;
      const end = page * limit;
      return { start, end, unknown: true };
    }
    const start = Math.min((page - 1) * limit + 1, total);
    const end = Math.min(page * limit, total);
    return { start, end, unknown: false };
  }, [page, limit, total]);

  // Validate that the current limit is one of the allowed values
  const currentLimit = useMemo(() => {
    return PAGE_SIZE_OPTIONS.includes(limit as PageSize)
      ? (limit as PageSize)
      : PAGE_SIZE_OPTIONS[0];
  }, [limit]);

  const handlePageSizeChange = (value: string | null) => {
    if (value) {
      const newLimit = parseInt(value, 10) as PageSize;
      onLimitChange?.(newLimit);
    }
  };

  return (
    <Box p='md'>
      <Stack gap='md'>
        {/* Results information */}
        {showResultsInfo && (
          <Text size='sm' c='dimmed'>
            {itemRange.unknown ? (
              <>
                Showing page{' '}
                <Text component='span' fw={500}>
                  {page}
                </Text>{' '}
                (results from limited dataset)
              </>
            ) : (
              <>
                Showing{' '}
                <Text component='span' fw={500}>
                  {itemRange.start}
                </Text>{' '}
                to{' '}
                <Text component='span' fw={500}>
                  {itemRange.end}
                </Text>{' '}
                of{' '}
                <Text component='span' fw={500}>
                  {total}
                </Text>{' '}
                results
              </>
            )}
          </Text>
        )}

        {/* Controls */}
        <Flex
          justify='space-between'
          align='center'
          direction={{ base: 'column', sm: 'row' }}
          gap='md'
        >
          {/* Page size selector */}
          {showPageSizeSelector && (
            <Group gap='xs'>
              <Text size='sm'>Show:</Text>
              <Select
                value={currentLimit.toString()}
                onChange={handlePageSizeChange}
                data={PAGE_SIZE_OPTIONS.map((size) => ({
                  value: size.toString(),
                  label: size.toString(),
                }))}
                size='sm'
                w={80}
                disabled={loading}
                comboboxProps={{ withinPortal: false }}
              />
            </Group>
          )}

          {/* Pagination */}
          <Pagination
            total={totalPages === -1 ? page + 1 : totalPages} // Show current page + 1 when total is unknown
            value={page}
            onChange={onPageChange}
            disabled={loading}
            size='sm'
            withEdges
            siblings={Math.floor(maxVisiblePages / 2)}
            boundaries={1}
            nextIcon={IconChevronRight}
            previousIcon={IconChevronLeft}
            styles={{
              control: {
                '&[data-disabled]': {
                  opacity: 0.3,
                  cursor: 'not-allowed',
                },
              },
            }}
          />
        </Flex>
      </Stack>
    </Box>
  );
};
