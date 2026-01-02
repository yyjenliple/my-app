import Link from 'next/link';
import { redirect } from 'next/navigation';

import { ArrowLeft, GraduationCap, LayoutDashboard, MessageSquare, Users } from 'lucide-react';

import { createClient } from '@/utils/supabase/server';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data?.user;

  if (!user) {
    redirect('/login');
  }

  // 플랫폼 관리자 권한 확인
  const { data: profile } = await supabase
    .from('profiles')
    .select('platform_role')
    .eq('id', user.id)
    .single();

  if (profile?.platform_role !== 'admin') {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen bg-[#FDFDFD]">
      {/* Sidebar */}
      <aside className="border-border hidden w-64 flex-col border-r bg-white lg:flex">
        <div className="border-border flex h-16 items-center gap-2 border-b px-6">
          <div className="bg-primary rounded-lg p-2">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">Edu Admin</span>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          <Link
            href="/dashboard"
            className="text-muted-foreground hover:bg-muted flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            대시보드 복귀
          </Link>
          <div className="py-2">
            <div className="text-muted-foreground/50 px-4 pb-2 text-[10px] font-bold tracking-widest uppercase">
              Management
            </div>
            <Link
              href="/admin/users"
              className="hover:bg-muted flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors"
            >
              <Users className="h-4 w-4" />
              사용자 관리
            </Link>
            <Link
              href="/admin/inquiries"
              className="hover:bg-muted flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              도입 문의 관리
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        <header className="border-border sticky top-0 z-40 h-16 border-b bg-white/80 backdrop-blur-md lg:hidden">
          <div className="flex h-full items-center justify-between px-6">
            <Link href="/dashboard" className="flex items-center gap-2">
              <GraduationCap className="text-primary h-6 w-6" />
              <span className="font-bold">Admin</span>
            </Link>
            <div className="flex gap-4">
              <Link href="/admin/users">
                <Users className="h-5 w-5" />
              </Link>
              <Link href="/admin/inquiries">
                <MessageSquare className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
