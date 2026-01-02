import Link from 'next/link';
import { redirect } from 'next/navigation';

import { BookOpen, Clock, GraduationCap, Plus } from 'lucide-react';

import { createClient } from '@/utils/supabase/server';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data?.user;

  if (!user) {
    redirect('/login');
  }

  // 플랫폼 역할 확인
  const { data: profile } = await supabase
    .from('profiles')
    .select('platform_role')
    .eq('id', user.id)
    .single();

  const role = profile?.platform_role;

  return (
    <div className="flex min-h-screen flex-col bg-[#FDFDFD]">
      <header className="border-border bg-card/50 sticky top-0 z-50 flex items-center justify-between border-b px-6 py-4 backdrop-blur-md lg:px-12">
        <div className="flex items-center gap-2">
          <div className="bg-primary rounded-lg p-2">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">Edu</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="mr-2 flex flex-col items-end">
            <span className="text-primary text-xs font-bold uppercase">{role}</span>
            <span className="text-muted-foreground text-[10px]">{user.email}</span>
          </div>
          <form action="/auth/signout" method="post">
            <button className="bg-secondary hover:bg-muted rounded-lg px-4 py-2 text-sm font-medium transition-colors">
              로그아웃
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-12 lg:px-12">
        <div className="mb-12">
          <h1 className="text-3xl font-extrabold tracking-tight">반갑습니다! 👋</h1>
          <p className="text-muted-foreground mt-2">
            {role === 'admin' ? '플랫폼 관리자 모드입니다.' : '오늘도 화이팅.'}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {role === 'admin' ? (
            <>
              <Link
                href="/admin/users"
                className="group bg-primary rounded-3xl p-8 shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
                  <Plus className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-white">사용자 관리</h3>
                <p className="text-primary-foreground/80 text-sm leading-relaxed">
                  플랫폼의 모든 사용자를 조회하고 관리합니다.
                </p>
              </Link>

              <Link
                href="/admin/inquiries"
                className="group border-border rounded-3xl border bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="bg-primary/10 text-primary group-hover:bg-primary mb-6 flex h-12 w-12 items-center justify-center rounded-2xl transition-colors">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold">도입 문의 관리</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  접수된 학원 도입 문의를 확인하고 처리합니다.
                </p>
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/teacher/assignments/create"
                className="group bg-primary rounded-3xl p-8 shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
                  <Plus className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-white">생성</h3>
                <p className="text-primary-foreground/80 text-sm leading-relaxed">
                  블로그 에디터 활용 스타일의 툴 사용
                </p>
              </Link>

              <div className="border-border rounded-3xl border bg-white p-8 shadow-sm transition-all hover:shadow-md">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold">목록</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">목록 확인</p>
              </div>

              <div className="border-border rounded-3xl border bg-white p-8 shadow-sm transition-all hover:shadow-md">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold">최근 활동</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">최근 활동 확인</p>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
