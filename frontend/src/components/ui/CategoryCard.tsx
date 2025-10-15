import { Card, Stack, Title, Text } from '@mantine/core';
import { City } from '@shared/types/scientist.types';
import Image from 'next/image';

interface CategoryCardProps {
  city: City;
  imageUrl: string;
  onClick: (cityName: string) => void;
}

export const CategoryCard = ({
  city,
  imageUrl,
  onClick,
}: CategoryCardProps) => {
  return (
    <Card
      p={0}
      shadow='sm'
      radius='md'
      style={{
        cursor: 'pointer',
        transition: 'all 0.2s',
        overflow: 'hidden',
      }}
      onClick={() => onClick(city.name)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.12)';
      }}
    >
      <div style={{ position: 'relative', height: '200px' }}>
        <Image
          src={imageUrl}
          alt={city.name}
          fill
          style={{
            objectFit: 'cover',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.6))',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '16px',
          }}
        >
          <Stack gap='xs' align='center'>
            <Title order={4} size='lg' c='white' ta='center'>
              {city.name}
            </Title>
            <Text size='sm' c='white' ta='center'>
              {city.country}
            </Text>
          </Stack>
        </div>
      </div>
    </Card>
  );
};
