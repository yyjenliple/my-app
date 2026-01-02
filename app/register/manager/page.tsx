import Link from 'next/link';

import { GraduationCap, ShieldCheck } from 'lucide-react';

import { signup } from '@/app/signup/actions';

export default async function ManagerSignupPage(props: {
  searchParams: Promise<{ message: string }>;
}) {
  const searchParams = await props.searchParams;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="bg-card border-border w-full max-w-md space-y-8 rounded-3xl border p-10 shadow-2xl">
        <div className="text-center">
          <Link
            href="/"
            className="bg-primary/10 mx-auto flex h-14 w-14 items-center justify-center rounded-2xl shadow-inner transition-transform hover:scale-105 active:scale-95"
          >
            <GraduationCap className="text-primary h-8 w-8" />
          </Link>
          <div className="mt-8 flex items-center justify-center gap-2">
            <ShieldCheck className="text-primary h-5 w-5" />
            <span className="text-primary text-sm font-bold tracking-widest uppercase">
              Manager Registration
            </span>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground">
            학원 관리자 계정 생성
          </h2>
          <p className="text-muted-foreground mt-3 text-sm">학원의 효율적인 관리를 시작하세요</p>
        </div>

        <form className="mt-10 space-y-6">
          <input type="hidden" name="platform_role" value="manager" />
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 ml-1 block text-sm font-semibold">학원명</label>
              <input
                name="academy_name"
                type="text"
                required
                className="border-input focus:ring-primary/20 focus:border-primary block w-full rounded-xl border bg-background px-4 py-3 transition-all focus:ring-4 focus:outline-none sm:text-sm"
                placeholder="학원 이름을 입력하세요"
              />
            </div>
            <div>
              <label className="text-opacity-80 mb-1.5 ml-1 block text-sm font-semibold text-foreground">
                원장님 성함
              </label>
              <input
                name="full_name"
                type="text"
                required
                className="border-input focus:ring-primary/20 focus:border-primary block w-full rounded-xl border bg-background px-4 py-3 transition-all focus:ring-4 focus:outline-none sm:text-sm"
                placeholder="홍길동"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="text-opacity-80 mb-1.5 ml-1 block text-sm font-semibold text-foreground"
              >
                이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="border-input focus:ring-primary/20 focus:border-primary block w-full rounded-xl border bg-background px-4 py-3 transition-all focus:ring-4 focus:outline-none sm:text-sm"
                placeholder="manager@example.com"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="text-opacity-80 mb-1.5 ml-1 block text-sm font-semibold text-foreground"
              >
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="border-input focus:ring-primary/20 focus:border-primary block w-full rounded-xl border bg-background px-4 py-3 transition-all focus:ring-4 focus:outline-none sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            formAction={signup}
            className="group bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary/30 relative flex w-full justify-center rounded-xl px-4 py-3.5 text-sm font-bold shadow-lg transition-all focus:ring-4 active:scale-[0.98]"
          >
            관리자 계정 만들기
          </button>

          <p className="text-muted-foreground mt-8 text-center text-sm">
            이미 계정이 있으신가요?{' '}
            <Link href="/login" className="text-primary font-bold hover:underline">
              로그인하기
            </Link>
          </p>

          {searchParams?.message && (
            <div className="bg-destructive/10 border-destructive/20 animate-in fade-in slide-in-from-top-2 mt-6 rounded-xl border p-4">
              <p className="text-destructive text-center text-sm font-medium">
                {searchParams.message}
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
