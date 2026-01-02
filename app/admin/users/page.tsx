import { Suspense } from 'react';

import { SortableHeader } from '@/components/admin/sortable-header';
import { AdminTableFilter } from '@/components/admin/table-filter';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate } from '@/lib/format';
import { createClient } from '@/utils/supabase/server';

const ROLE_OPTIONS = [
  { label: '관리자', value: 'admin' },
  { label: '매니저', value: 'manager' },
  { label: '일반 유저', value: 'user' },
];

interface PageProps {
  searchParams: Promise<{ sort?: string; order?: string; search?: string; status?: string }>;
}

export default async function AdminUsersPage({ searchParams }: PageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground/90">사용자 관리</h1>
        <p className="text-sm font-medium text-muted-foreground">
          플랫폼 전체 가입자 및 권한을 관리합니다.
        </p>
      </div>

      <div className="space-y-4">
        <Suspense fallback={<Skeleton className="h-12 w-full rounded-2xl" />}>
          <AdminTableFilter
            placeholder="이름, ID 검색..."
            statusOptions={ROLE_OPTIONS}
            statusLabel="권한 필터"
            showSearch={true}
            showStatus={true}
          />
        </Suspense>

        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <Suspense fallback={<UsersTableSkeleton />}>
            <UsersTableContent searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

async function UsersTableContent({
  searchParams: searchParamsPromise,
}: {
  searchParams: PageProps['searchParams'];
}) {
  const searchParams = await searchParamsPromise;
  const sort = searchParams.sort || 'created_at';
  const order = searchParams.order || 'desc';
  const search = searchParams.search || '';
  const statusRaw = searchParams.status || '';
  const statusArray = statusRaw ? statusRaw.split(',') : [];

  const supabase = await createClient();
  let query = supabase.from('profiles').select('*');

  if (statusArray.length > 0) {
    query = query.in('platform_role', statusArray);
  }

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,id.cast.text.ilike.%${search}%`);
  }

  const { data: users, error } = await query.order(sort, { ascending: order === 'asc' });

  if (error) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-destructive/10 bg-destructive/5 p-8 text-destructive">
        <p className="text-center text-lg font-bold whitespace-pre-wrap">
          데이터를 불러오는 중 오류가 발생했습니다.
        </p>
        <p className="mt-1 text-xs opacity-75">{error.message}</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader className="bg-muted/30">
        <TableRow className="hover:bg-transparent">
          <TableHead className="px-6 py-4">
            <SortableHeader label="사용자 정보" field="full_name" />
          </TableHead>
          <TableHead className="px-6 py-4">
            <SortableHeader label="권한" field="platform_role" />
          </TableHead>
          <TableHead className="px-6 py-4">
            <SortableHeader label="가입일" field="created_at" />
          </TableHead>
          <TableHead className="px-6 py-4 pr-8 text-right">관리</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users?.map((user) => (
          <TableRow key={user.id} className="group transition-all hover:bg-muted/20">
            <TableCell className="px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-xs font-bold text-secondary-foreground uppercase shadow-inner">
                  {user.full_name?.charAt(0) || 'U'}
                </div>
                <div>
                  <div className="font-bold tracking-tight text-foreground">
                    {user.full_name || '이름 없음'}
                  </div>
                  <div className="mt-0.5 text-[10px] tracking-wider text-muted-foreground tabular-nums">
                    {user.id}
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell className="px-6 py-5">
              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-extrabold tracking-widest uppercase shadow-sm ${
                  user.platform_role === 'admin'
                    ? 'bg-primary/20 text-primary'
                    : user.platform_role === 'manager'
                      ? 'bg-amber-100/50 text-amber-700'
                      : 'bg-gray-100/80 text-gray-600'
                }`}
              >
                {user.platform_role}
              </span>
            </TableCell>
            <TableCell className="px-6 py-5 text-[11px] font-semibold text-muted-foreground tabular-nums">
              {formatDate(user.created_at)}
            </TableCell>
            <TableCell className="px-6 py-5 pr-8 text-right">
              <button className="rounded-lg px-3 py-1.5 text-xs font-bold text-primary transition-all hover:bg-primary/10 active:scale-95">
                상세보기
              </button>
            </TableCell>
          </TableRow>
        ))}
        {(!users || users.length === 0) && (
          <TableRow>
            <TableCell colSpan={4} className="h-64 text-center text-muted-foreground">
              조회된 사용자가 없습니다.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

function UsersTableSkeleton() {
  return (
    <div className="divide-y divide-border/40">
      <div className="h-14 w-full bg-muted/30" />
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex h-20 w-full items-center gap-6 px-6">
          <div className="flex flex-1 items-center gap-3">
            <div className="h-9 w-9 animate-pulse rounded-xl bg-muted" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="ml-auto h-8 w-16 rounded-lg" />
        </div>
      ))}
    </div>
  );
}
