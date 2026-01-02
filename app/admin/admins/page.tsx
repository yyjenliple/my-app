import { Suspense } from 'react';

import { Calendar, Mail, Shield, UserPlus } from 'lucide-react';

import { SortableHeader } from '@/components/admin/sortable-header';
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

export default async function AdminManagementPage(props: {
  searchParams: Promise<{ sort?: string; order?: string }>;
}) {
  const searchParams = await props.searchParams;
  const sort = searchParams.sort || 'created_at';
  const order = searchParams.order || 'desc';

  const supabase = await createClient();

  // Fetch users with admin role (using platform_role)
  const { data: admins, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('platform_role', 'admin')
    .order(sort, { ascending: order === 'asc' });

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-destructive">
        오류가 발생했습니다: {error.message}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">운영진 관리</h1>
          <p className="mt-1 text-muted-foreground">플랫폼을 관리하는 마스터 관리자 목록입니다.</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-white shadow-lg transition-all hover:bg-primary/90 active:scale-95">
          <UserPlus className="h-5 w-5" />
          관리자 초대하기
        </button>
      </header>

      {/* Admin Table */}
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <Suspense
          fallback={<div className="p-8 text-center text-muted-foreground">불러오는 중...</div>}
        >
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="px-8 py-4">
                  <SortableHeader label="관리자 정보" field="full_name" />
                </TableHead>
                <TableHead className="px-8 py-4">
                  <SortableHeader label="역할" field="platform_role" />
                </TableHead>
                <TableHead className="px-8 py-4">
                  <SortableHeader label="가입일" field="created_at" />
                </TableHead>
                <TableHead className="px-8 py-4 text-right">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins?.map((admin) => (
                <TableRow key={admin.id} className="transition-colors hover:bg-gray-50/50">
                  <TableCell className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary shadow-inner">
                        {admin.full_name?.charAt(0) || 'A'}
                      </div>
                      <div>
                        <div className="font-bold text-foreground">
                          {admin.full_name || '이름 없음'}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] tracking-tight text-muted-foreground">
                          <Mail className="h-3 w-3" /> {admin.id.substring(0, 12)}...
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-8 py-6">
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold tracking-wider text-primary uppercase">
                      <Shield className="h-3.5 w-3.5" /> {admin.platform_role}
                    </span>
                  </TableCell>
                  <TableCell className="px-8 py-6 text-muted-foreground">
                    <span className="flex items-center gap-1 text-[11px]">
                      <Calendar className="h-3 w-3" />
                      {formatDate(admin.created_at)}
                    </span>
                  </TableCell>
                  <TableCell className="px-8 py-6 text-right">
                    <button className="text-sm font-bold text-muted-foreground transition-colors hover:text-destructive">
                      제한하기
                    </button>
                  </TableCell>
                </TableRow>
              ))}
              {(!admins || admins.length === 0) && (
                <TableRow>
                  <TableCell colSpan={4} className="h-64 text-center text-muted-foreground">
                    등록된 운영진이 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Suspense>
      </div>
    </div>
  );
}
