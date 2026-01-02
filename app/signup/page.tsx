import Link from 'next/link';

import { GraduationCap } from 'lucide-react';

import { signup } from './actions';

export default async function SignupPage(props: { searchParams: Promise<{ message?: string }> }) {
  const params = await props.searchParams;
  const message = params?.message;

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
          <h2 className="mt-8 text-3xl font-extrabold tracking-tight text-pretty text-foreground">
            함께하게 되어 반가워요
          </h2>
          <p className="text-muted-foreground mt-3 text-sm">
            에듀 플랫폼의 모든 기능을 지금 시작하세요
          </p>
        </div>

        <form className="mt-10 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-opacity-80 mb-1.5 ml-1 block text-sm font-semibold text-foreground">
                이름
              </label>
              <input
                name="full_name"
                type="text"
                required
                className="border-input placeholder:text-muted-foreground focus:ring-primary/20 focus:border-primary block w-full rounded-xl border bg-background px-4 py-3 text-foreground transition-all focus:ring-4 focus:outline-none sm:text-sm"
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
                className="border-input placeholder:text-muted-foreground focus:ring-primary/20 focus:border-primary block w-full rounded-xl border bg-background px-4 py-3 text-foreground transition-all focus:ring-4 focus:outline-none sm:text-sm"
                placeholder="you@example.com"
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
                className="border-input placeholder:text-muted-foreground focus:ring-primary/20 focus:border-primary block w-full rounded-xl border bg-background px-4 py-3 text-foreground transition-all focus:ring-4 focus:outline-none sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          {message && (
            <div className="bg-destructive/10 border-destructive/20 animate-in fade-in slide-in-from-top-2 mt-6 rounded-xl border p-4">
              <p className="text-destructive text-center text-sm font-medium">{message}</p>
            </div>
          )}

          <button
            formAction={signup}
            className="group bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary/30 relative flex w-full justify-center rounded-xl px-4 py-3.5 text-sm font-bold shadow-lg transition-all focus:ring-4 active:scale-[0.98]"
          >
            가입하기
          </button>

          <p className="text-muted-foreground mt-8 text-center text-sm leading-relaxed">
            이미 계정이 있으신가요?{' '}
            <Link href="/login" className="text-primary font-bold hover:underline">
              로그인하기
            </Link>
            <br />
            <span className="mt-4 inline-block">
              학원 도입을 원하시나요?{' '}
              <Link href="/inquiry" className="text-primary font-bold hover:underline">
                원장님 전용 상담 신청
              </Link>
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
