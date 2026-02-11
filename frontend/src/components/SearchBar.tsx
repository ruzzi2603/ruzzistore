'use client';
import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange }: any) {
  return (
    <div className="search">
      <Search className="search-icon" />
      <input
        type="text"
        placeholder="Buscar jogos..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="search-input"
      />
    </div>
  );
}
