"use client";

import { useState, type FormEvent } from "react";
import { Search } from "lucide-react";

export interface SearchBarProps {
  placeholder?: string;
  buttonLabel?: string;
  defaultValue?: string;
  onSearch?: (query: string) => void;
}

export default function SearchBar({
  placeholder = "Cari ruang, lokasi, atau kegiatan...",
  buttonLabel = "Cari",
  defaultValue = "",
  onSearch,
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch?.(query);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl flex items-center justify-center mx-auto bg-white border border-indigo-100 rounded-lg pl-4 pr-1.5 py-1.5 shadow-sm focus-within:border-indigo-300 transition-colors"
    >
      <Search className="w-4 h-4 text-gray-400 shrink-0" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400 px-3 py-1.5"
      />
      <button
        type="submit"
        className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md px-5 py-1.5 transition-colors shrink-0"
      >
        {buttonLabel}
      </button>
    </form>
  );
}
