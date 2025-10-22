import { Group, TextInput, Button } from '@mantine/core';
import { IconSearch, IconFilter, IconMapPin } from '@tabler/icons-react';

interface ScientistSearchFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
  selectedCity?: string | null;
  onCityChange?: (city: string | null) => void;
  loading?: boolean;
}

export function ScientistSearchFilters({
  searchQuery,
  onSearchChange,
  onSearch,
  selectedCity,
  onCityChange,
  loading = false,
}: ScientistSearchFiltersProps) {
  return (
    <>
      <Group gap='md' align='flex-end'>
        <TextInput
          placeholder='Search scientists by name, specialization, or research interests...'
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          leftSection={<IconSearch size={16} />}
          size='md'
          style={{ flex: 1 }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSearch();
            }
          }}
        />
        <Button
          leftSection={<IconFilter size={16} />}
          variant='outline'
          size='md'
          onClick={onSearch}
          loading={loading}
        >
          Search
        </Button>
      </Group>

      {selectedCity !== undefined && onCityChange && (
        <Group gap='md'>
          <TextInput
            placeholder='Enter city (optional)...'
            value={selectedCity || ''}
            onChange={(e) => onCityChange(e.target.value || null)}
            leftSection={<IconMapPin size={16} />}
            size='md'
            style={{ flex: 1 }}
          />
        </Group>
      )}
    </>
  );
}
