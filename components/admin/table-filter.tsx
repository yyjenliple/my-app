'use client';

import { useState, useTransition } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { Check, Loader2, Search, X } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface AdminTableFilterProps {
  placeholder?: string;
  statusOptions?: { label: string; value: string; color?: string }[];
  showSearch?: boolean; // 검색창 표시 여부
  showStatus?: boolean; // 상태 필터 표시 여부
  statusLabel?: string; // 상태 필터 라벨 (예: "역할", "상태")
}

export function AdminTableFilter({
  placeholder = '검색...',
  statusOptions,
  showSearch = true,
  showStatus = true,
  statusLabel = '상태 필터',
}: AdminTableFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(searchParams.get('search') || '');

  // 현재 선택된 상태들을 가져옴 (쉼표로 구분된 문자열 -> 배열)
  const currentStatusRaw = searchParams.get('status');
  const selectedStatuses = currentStatusRaw ? currentStatusRaw.split(',') : [];

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    updateFilters({ search: value });
  };

  const toggleStatus = (value: string) => {
    let newStatuses: string[];

    if (value === 'all') {
      newStatuses = [];
    } else {
      if (selectedStatuses.includes(value)) {
        newStatuses = selectedStatuses.filter((s) => s !== value);
      } else {
        newStatuses = [...selectedStatuses, value];
      }
    }

    updateFilters({ status: newStatuses.length > 0 ? newStatuses.join(',') : null });
  };

  const hasActiveFilters = (showSearch && search) || (showStatus && selectedStatuses.length > 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {showSearch ? (
          <div className="relative max-w-sm flex-1">
            {isPending ? (
              <Loader2 className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 animate-spin text-primary" />
            ) : (
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            )}
            <Input
              placeholder={placeholder}
              className="h-11 rounded-2xl border-border/60 bg-muted/20 pl-10 focus-visible:ring-primary/20"
              value={search}
              onChange={handleSearchChange}
            />
          </div>
        ) : (
          <div className="flex-1" />
        )}

        {hasActiveFilters && (
          <button
            onClick={() => {
              setSearch('');
              router.push('?');
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground transition-all hover:text-destructive active:scale-95"
          >
            <X className="h-3.5 w-3.5" />
            필터 및 검색 초기화
          </button>
        )}
      </div>

      {showStatus && statusOptions && (
        <div className="flex flex-wrap items-center gap-2">
          <div className="mr-2 text-[10px] font-extrabold tracking-widest text-muted-foreground uppercase opacity-50">
            {statusLabel}
          </div>
          <button
            onClick={() => toggleStatus('all')}
            className={cn(
              'rounded-full border px-4 py-1.5 text-xs font-bold transition-all',
              selectedStatuses.length === 0
                ? 'border-foreground bg-foreground text-background shadow-md'
                : 'border-border bg-background text-muted-foreground hover:border-foreground/20 hover:text-foreground'
            )}
          >
            전체
          </button>
          {statusOptions.map((opt) => {
            const isSelected = selectedStatuses.includes(opt.value);
            return (
              <button
                key={opt.value}
                onClick={() => toggleStatus(opt.value)}
                className={cn(
                  'relative flex items-center gap-1.5 overflow-hidden rounded-full border px-4 py-1.5 text-xs font-bold transition-all',
                  isSelected
                    ? 'border-primary/30 bg-primary/10 pr-3 text-primary shadow-sm'
                    : 'border-border bg-background text-muted-foreground hover:border-primary/20 hover:text-primary/70'
                )}
              >
                {isSelected && <Check className="h-3 w-3 animate-in duration-300 zoom-in-50" />}
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
