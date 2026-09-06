"use client";

import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import type { FormEvent } from "react";

interface SearchAndFilterProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSubmit: () => void;
  onFilterClick?: () => void;
}

const FILTERS = ["Kapasitas", "Harga", "Fasilitas"];

export default function SearchAndFilter({
  query,
  onQueryChange,
  onSubmit,
  onFilterClick,
}: SearchAndFilterProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <div className="space-y-4 border-b border-slate-100 bg-white p-6 pb-5 lg:px-10">
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Cari lokasi, nama ruang, atau fasilitas..."
          aria-label="Cari tempat"
          className="w-full rounded-xl border border-slate-200 py-3 pl-12 pr-11 text-sm text-slate-700 shadow-sm outline-none transition-shadow placeholder:text-slate-400 focus:border-[#6347EB] focus:ring-2 focus:ring-[#6347EB]/20"
        />
        {query && (
          <button
            type="button"
            onClick={() => onQueryChange("")}
            aria-label="Hapus pencarian"
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      <div className="flex items-center gap-2.5 overflow-x-auto pb-1 text-xs font-medium text-slate-700 sm:text-sm">
        <button
          type="button"
          onClick={onFilterClick}
          className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-slate-200 bg-white px-4 py-2 transition-colors hover:border-slate-400 hover:bg-slate-50"
        >
          <SlidersHorizontal className="h-4 w-4 text-slate-600" />
          Filter
        </button>
        {FILTERS.map((filter) => (
          <button
            key={filter}
            type="button"
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-slate-200 bg-white px-4 py-2 transition-colors hover:border-slate-400 hover:bg-slate-50"
          >
            <span>{filter}</span>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>
        ))}
      </div>
    </div>
  );
}
