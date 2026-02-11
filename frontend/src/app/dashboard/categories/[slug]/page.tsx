'use client';

import { useParams } from 'next/navigation';
// ... outros imports

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  // O slug será automaticamente 'action' se a URL for /categories/action
  // Basta usar o 'slug' na chamada da API: api.get(`/games/category/${slug}`)
}