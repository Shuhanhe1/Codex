import { Text, Grid, GridCol } from '@mantine/core';
import { CategoryCard } from '../ui/CategoryCard';

interface ResearchField {
  id: string;
  name: string;
  description: string;
  scientistCount: number;
}

interface ResearchFieldsSectionProps {
  onFieldSelect: (field: string | null) => void;
}

const mockResearchFields: ResearchField[] = [
  {
    id: '1',
    name: 'Cancer Research',
    description: 'Cutting-Edge Cancer Research',
    scientistCount: 156,
  },
  {
    id: '2',
    name: 'Genetics',
    description: 'Advances in Genetics',
    scientistCount: 134,
  },
  {
    id: '3',
    name: 'Neuroscience',
    description: 'Frontiers of Neuroscience',
    scientistCount: 98,
  },
  {
    id: '4',
    name: 'Immunology',
    description: 'Breakthroughs in Immunology',
    scientistCount: 87,
  },
  {
    id: '5',
    name: 'Stem Cells',
    description: 'Stem Cell and Regenerative Biology',
    scientistCount: 76,
  },
  {
    id: '6',
    name: 'Microbial Sciences',
    description: 'Microbial Sciences and Discoveries',
    scientistCount: 92,
  },
  {
    id: '7',
    name: 'Virology',
    description: 'Virology and Infectious Disease Research',
    scientistCount: 68,
  },
  {
    id: '8',
    name: 'Bioinformatics',
    description: 'Bioinformatics and Computational Biology',
    scientistCount: 145,
  },
  {
    id: '9',
    name: 'Pharmacology',
    description: 'Pharmacological Innovation',
    scientistCount: 78,
  },
];

// Research field images mapping - All images are free to use from Unsplash
const researchFieldImages: Record<string, string> = {
  'Cancer Research':
    'https://images.unsplash.com/photo-1581594294883-5109c202942f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1480',
  'Genetics':
    'https://images.unsplash.com/photo-1643780668909-580822430155?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2232',
  'Neuroscience':
    'https://plus.unsplash.com/premium_photo-1678834890201-47674c716347?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1480',
  'Immunology':
    'https://images.unsplash.com/photo-1707079917509-af3177041e14?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1526',
  'Stem Cells':
    'https://plus.unsplash.com/premium_photo-1673589625808-294b22d67848?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2232',
  'Microbial Sciences':
    'https://images.unsplash.com/photo-1706204077595-9e3baaebc093?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1704',
  'Virology':
    'https://plus.unsplash.com/premium_photo-1661499733927-9964702158ca?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2070',
  'Bioinformatics':
    'https://images.unsplash.com/photo-1643780668909-580822430155?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2232',
  'Pharmacology':
    'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2069',
};

export function ResearchFieldsSection({
  onFieldSelect,
}: ResearchFieldsSectionProps) {
  return (
    <>
      <Text size='lg' fw={500} ta='center'>
        Research Fields
      </Text>
      <Grid>
        {mockResearchFields.map((field) => (
          <GridCol key={field.id} span={{ base: 12, sm: 6, md: 4 }}>
            <CategoryCard
              city={{
                id: field.id,
                name: field.name,
                country: field.description,
                region: 'Research',
                scientistCount: field.scientistCount,
              }}
              imageUrl={researchFieldImages[field.name]}
              onClick={onFieldSelect}
            />
          </GridCol>
        ))}
      </Grid>
    </>
  );
}
