import type { Metadata } from 'next';
import { CityCountryGame } from '@/components/practice';

export const metadata: Metadata = {
  title: 'Country Finder - Practice',
};

export default function CityCountryPage() {
  return <CityCountryGame />;
}
