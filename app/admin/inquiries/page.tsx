import { Suspense } from 'react';

import { SortableHeader } from '@/components/admin/sortable-header';
import { AdminTableFilter } from '@/components/admin/table-filter';
import { Badge } from '@/components/ui/badge';
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

import { InquiryDetails } from './inquiry-details';

const statusMap: Record<
  string,
  { label: string; variant: 'outline' | 'default' | 'destructive' | 'secondary' }
> = {
  pending: { label: '대기 중', variant: 'outline' },
  approved: { label: '승인됨', variant: 'default' },
  rejected: { label: '거절됨', variant: 'destructive' },
  on_hold: { label: '보류 중', variant: 'secondary' },
};

const INQUIRY_STATUS_OPTIONS = [
  { label: '대기 중', value: 'pending' },
  { label: '승인됨', value: 'approved' },
  { label: '거절됨', value: 'rejected' },
  { label: '보류 중', value: 'on_hold' },
];

interface PageProps {
  searchParams: Promise<{ sort?: string; order?: string; search?: string; status?: string }>;
}

export default async function AdminInquiriesPage({ searchParams }: PageProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground/90">
            도입 문의 관리
          </h1>
          <p className="mt-1 text-sm font-medium text-muted-foreground">
            접수된 문의를 필터링하고 업무를 승인하세요.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <Suspense fallback={<Skeleton className="h-24 w-full rounded-3xl" />}>
          <AdminTableFilter
            placeholder="학원명, 신청자, 이메일 검색..."
            statusOptions={INQUIRY_STATUS_OPTIONS}
          />
        </Suspense>

        <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-[0_8px_40px_rgb(0,0,0,0.04)] transition-all">
          <Suspense fallback={<InquiriesTableSkeleton />}>
            <InquiryTableContent searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

async function InquiryTableContent({
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
  let query = supabase.from('inquiries').select('*');

  // 멀티 필터 적용 (in 연산자 사용)
  if (statusArray.length > 0) {
    query = query.in('status', statusArray);
  }

  if (search) {
    query = query.or(
      `academy_name.ilike.%${search}%,full_name.ilike.%${search}%,email.ilike.%${search}%`
    );
  }

  const { data: inquiries, error } = await query.order(sort, { ascending: order === 'asc' });

  if (error) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-destructive/10 bg-destructive/5 p-8 text-destructive">
        <p className="text-lg font-bold">오류가 발생했습니다.</p>
        <p className="mt-2 text-sm opacity-80">{error.message}</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader className="bg-muted/30">
        <TableRow className="border-b-border/40 hover:bg-transparent">
          <TableHead className="px-8 py-5">
            <SortableHeader label="학원명 / 신청자" field="academy_name" />
          </TableHead>
          <TableHead className="px-8 py-5">
            <SortableHeader label="연락처 / 이메일" field="email" />
          </TableHead>
          <TableHead className="px-8 py-5">
            <SortableHeader label="상태" field="status" />
          </TableHead>
          <TableHead className="px-8 py-5">
            <SortableHeader label="신청일" field="created_at" />
          </TableHead>
          <TableHead className="px-8 py-5 text-right">관리</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {inquiries?.map((item) => (
          <TableRow
            key={item.id}
            className="group border-b-border/40 transition-all last:border-0 hover:bg-muted/20"
          >
            <TableCell className="px-8 py-6">
              <div className="text-[15px] font-bold tracking-tight text-foreground">
                {item.academy_name}
              </div>
              <div className="mt-1 text-xs font-medium text-muted-foreground">{item.full_name}</div>
            </TableCell>
            <TableCell className="px-8 py-6">
              <div className="text-[13px] font-bold text-foreground">{item.phone || '-'}</div>
              <div className="mt-0.5 text-[11px] tracking-tight text-muted-foreground">
                {item.email}
              </div>
            </TableCell>
            <TableCell className="px-8 py-6">
              <Badge
                variant={statusMap[item.status]?.variant || 'outline'}
                className="rounded-full px-3 py-1 text-[10px] font-black tracking-widest uppercase shadow-sm"
              >
                {statusMap[item.status]?.label || item.status}
              </Badge>
            </TableCell>
            <TableCell className="px-8 py-6 text-[11px] font-bold text-muted-foreground tabular-nums">
              {formatDate(item.created_at)}
            </TableCell>
            <TableCell className="px-8 py-6 text-right">
              <InquiryDetails inquiry={item} />
            </TableCell>
          </TableRow>
        ))}
        {(!inquiries || inquiries.length === 0) && (
          <TableRow>
            <TableCell colSpan={5} className="h-80 text-center font-medium text-muted-foreground">
              선택한 조건에 맞는 문의 데이터가 없습니다.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

function InquiriesTableSkeleton() {
  return (
    <div className="divide-y divide-border/40">
      <div className="h-16 w-full bg-muted/30" />
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex h-24 w-full items-center gap-8 px-8">
          <div className="flex-1 space-y-2.5">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3.5 w-24" />
          </div>
          <div className="flex-1 space-y-2.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
          <Skeleton className="h-7 w-20 rounded-full" />
          <Skeleton className="h-4 w-36" />
          <Skeleton className="ml-auto h-10 w-20 rounded-xl" />
        </div>
      ))}
    </div>
  );
}
