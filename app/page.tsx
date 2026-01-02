import Link from 'next/link';
import { redirect } from 'next/navigation';

import { BookOpen, CheckCircle2, Clock, GraduationCap } from 'lucide-react';

import { createClient } from '@/utils/supabase/server';

const CONTENTS = [
  {
    icon: BookOpen,
    title: '만들고',
    desc: '한 번 만든 것은 자산이 됩니다.',
  },
  {
    icon: Clock,
    title: '보는',
    desc: '만든 것은 언제 어디서 보는가?',
  },
  {
    icon: CheckCircle2,
    title: '즐거움',
    desc: '인생',
  },
];

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data?.user;

  // 로그인된 경우 대시보드로 리다이렉트
  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-border bg-card/50 sticky top-0 z-50 flex items-center justify-between border-b px-6 py-6 backdrop-blur-md lg:px-12">
        <div className="flex items-center gap-2">
          <div className="bg-primary rounded-lg p-2">
            <GraduationCap className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">Edu</span>
        </div>
        <div className="flex items-center gap-6">
          <Link
            href="/inquiry"
            className="bg-primary hover:bg-primary/90 rounded-full px-6 py-2.5 text-sm font-semibold shadow-lg transition-all active:scale-95"
          >
            도입문의
          </Link>
          <Link
            href="/login"
            className="bg-primary hover:bg-primary/90 rounded-full px-6 py-2.5 text-sm font-semibold shadow-lg transition-all active:scale-95"
          >
            시작하기
          </Link>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 pt-20 pb-32 text-center lg:px-12">
        <div className="border-primary/20 bg-primary/5 text-primary animate-in fade-in slide-in-from-bottom-4 mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium duration-700">
          Hello World!
        </div>

        <h1 className="mb-6 max-w-4xl text-5xl font-extrabold tracking-tight text-foreground lg:text-7xl">
          만들어 봅시다.
        </h1>

        <p className="text-muted-foreground mb-4 max-w-2xl text-lg sm:text-xl">
          무언가 만들어보는 중입니다.
        </p>

        <div className="mt-8 grid w-full max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
          {CONTENTS.map((item, i) => (
            <div
              key={i}
              className="group bg-card border-border rounded-3xl border p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="bg-primary/10 text-primary group-hover:bg-primary mb-6 flex h-12 w-12 items-center justify-center rounded-2xl transition-colors">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
