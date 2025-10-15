import { Text, Grid, GridCol } from '@mantine/core';
import { City } from '@shared/types/scientist.types';
import { CategoryCard } from '../ui/CategoryCard';

interface PopularCitiesSectionProps {
  onCitySelect: (city: string | null) => void;
}

// Mock data for demonstration
const mockCities: City[] = [
  {
    id: '1',
    name: 'Boston',
    country: 'USA',
    region: 'Northeast',
    scientistCount: 142,
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
    name: 'Tokyo',
    country: 'Japan',
    region: 'Asia',
    scientistCount: 92,
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
    name: 'Toronto',
    country: 'Canada',
    region: 'North America',
    scientistCount: 67,
  },
  {
    id: '6',
    name: 'Singapore',
    country: 'Singapore',
    region: 'Asia',
    scientistCount: 45,
  },
  {
    id: '7',
    name: 'Sydney',
    country: 'Australia',
    region: 'Oceania',
    scientistCount: 58,
  },
  {
    id: '8',
    name: 'Zurich',
    country: 'Switzerland',
    region: 'Europe',
    scientistCount: 34,
  },
  {
    id: '9',
    name: 'Seoul',
    country: 'South Korea',
    region: 'Asia',
    scientistCount: 76,
  },
];

// City images mapping - All images are free to use from Unsplash
const cityImages: Record<string, string> = {
  'Boston':
    'https://images.unsplash.com/photo-1565127803082-69dd82351360?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2071',
  'San Francisco':
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
  'Tokyo':
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
  'Berlin':
    'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
  'Toronto':
    'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
  'Singapore':
    'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
  'Sydney':
    'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2070',
  'Zurich':
    'https://images.unsplash.com/photo-1620563092215-0fbc6b55cfc5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2071 ',
  'Seoul':
    'https://plus.unsplash.com/premium_photo-1661885493074-e18964497278?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2070',
};

export function PopularCitiesSection({
  onCitySelect,
}: PopularCitiesSectionProps) {
  return (
    <>
      <Text size='lg' fw={500} ta='center'>
        Popular Cities
      </Text>
      <Grid>
        {mockCities.map((city) => (
          <GridCol key={city.id} span={{ base: 12, sm: 6, md: 4 }}>
            <CategoryCard
              city={city}
              imageUrl={cityImages[city.name]}
              onClick={onCitySelect}
            />
          </GridCol>
        ))}
      </Grid>
    </>
  );
}
