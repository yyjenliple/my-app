'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';

interface SortableHeaderProps {
  label: string;
  field: string;
}

export function SortableHeader({ label, field }: SortableHeaderProps) {
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort');
  const currentOrder = searchParams.get('order');

  const isCurrent = currentSort === field;
  const nextOrder = isCurrent && currentOrder === 'asc' ? 'desc' : 'asc';

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    params.set('sort', field);
    params.set('order', nextOrder);
    return params.toString();
  };

  return (
    <Link
      href={`?${createQueryString('sort', field)}`}
      className="group flex items-center gap-1 transition-colors hover:text-foreground"
    >
      {label}
      <span className="text-muted-foreground/50">
        {!isCurrent ? (
          <ChevronsUpDown className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
        ) : currentOrder === 'asc' ? (
          <ChevronUp className="h-3 w-3 text-primary" />
        ) : (
          <ChevronDown className="h-3 w-3 text-primary" />
        )}
      </span>
    </Link>
  );
}
