import { Group, TextInput, Button } from '@mantine/core';
import { IconSearch, IconFilter, IconMapPin } from '@tabler/icons-react';
import { useState } from 'react';

interface SearchFilters {
  searchQuery: string;
  selectedCity?: string | null;
}

interface ScientistSearchFiltersProps {
  onSubmit: (filters: SearchFilters) => void;
  // TODO: Implement initial values
  initialValues?: SearchFilters;
  loading?: boolean;
}

export function ScientistSearchFilters({
  onSubmit,
  loading = false,
  initialValues,
}: ScientistSearchFiltersProps) {
  const [searchQuery, setSearchQuery] = useState(
    initialValues?.searchQuery || ''
  );
  const [selectedCity, setSelectedCity] = useState<string | null>(
    initialValues?.selectedCity || null
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      searchQuery,
      selectedCity,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Group gap='md' align='flex-end'>
        <TextInput
          placeholder='Search scientists by name, specialization, or research interests...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftSection={<IconSearch size={16} />}
          size='md'
          style={{ flex: 1 }}
        />
        <Button
          type='submit'
          leftSection={<IconFilter size={16} />}
          variant='outline'
          size='md'
          loading={loading}
        >
          Search
        </Button>
      </Group>

      <Group gap='md' mt='xs'>
        <TextInput
          placeholder='Enter city (optional)...'
          value={selectedCity || ''}
          onChange={(e) => setSelectedCity(e.target.value || null)}
          leftSection={<IconMapPin size={16} />}
          size='md'
          style={{ flex: 1 }}
        />
      </Group>
    </form>
  );
}
