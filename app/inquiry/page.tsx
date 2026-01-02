import Link from 'next/link';

import { Building2, CheckCircle2, LineChart, Users } from 'lucide-react';

import { submitInquiry } from './actions';

const CONTENTS = [
  {
    icon: Building2,
    title: 'A',
    desc: 'apple',
  },
  {
    icon: Users,
    title: 'B',
    desc: 'banana',
  },
  {
    icon: LineChart,
    title: 'C',
    desc: 'cherry',
  },
];

export default async function InquiryPage(props: { searchParams: Promise<{ message?: string }> }) {
  const params = await props.searchParams;
  const message = params?.message;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex flex-1 flex-col lg:flex-row">
        {/* Left Side: Marketing Info */}
        <div className="bg-primary/5 flex-1 overflow-y-auto px-8 py-20 lg:px-20">
          <div className="mx-auto max-w-xl">
            <h1 className="mb-8 text-4xl font-extrabold tracking-tight lg:text-6xl">My App</h1>
            <p className="text-muted-foreground mb-12 text-xl leading-relaxed">만들어보자</p>

            <div className="space-y-8">
              {CONTENTS.map((feature, i) => (
                <div key={i} className="flex gap-6">
                  <div className="h-fit rounded-2xl p-3 shadow-sm">
                    <feature.icon className="text-primary h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-primary/10 mt-16 rounded-3xl border p-8 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <CheckCircle2 className="text-primary h-5 w-5" />
                <span className="font-bold">문의하기</span>
              </div>
              <p className="text-muted-foreground text-sm">
                문의를 남겨주시면 담당자가 24시간 이내에 연락 드립니다.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Inquiry Form */}
        <div className="flex flex-1 items-center justify-center lg:px-20">
          <div className="bg-card border-border w-full max-w-lg rounded-3xl border p-10 shadow-xl">
            <h2 className="mb-8 text-2xl font-bold">도입 문의 신청</h2>

            {message === 'success' ? (
              <div className="space-y-6 text-center">
                <div className="bg-primary/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
                  <CheckCircle2 className="text-primary h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">문의가 완료되었습니다!</h3>
                <p className="text-muted-foreground">
                  남겨주신 이메일과 연락처로 곧 안내해 드리겠습니다.
                </p>
                <Link
                  href="/"
                  className="bg-primary hover:bg-primary/90 inline-block w-full rounded-xl py-4 font-bold shadow-lg transition-all active:scale-95"
                >
                  홈으로 돌아가기
                </Link>
              </div>
            ) : (
              <form className="space-y-6" action={submitInquiry}>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 ml-1 block text-sm font-semibold">학원 명</label>
                    <input
                      name="academy_name"
                      type="text"
                      required
                      className="border-input focus:ring-primary/20 focus:border-primary w-full rounded-xl border bg-background px-4 py-3 transition-all outline-none focus:ring-4"
                      placeholder="에듀 아카데미"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 ml-1 block text-sm font-semibold">이름</label>
                    <input
                      name="full_name"
                      type="text"
                      required
                      className="border-input focus:ring-primary/20 focus:border-primary w-full rounded-xl border bg-background px-4 py-3 transition-all outline-none focus:ring-4"
                      placeholder="홍길동"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 ml-1 block text-sm font-semibold">연락처</label>
                    <input
                      name="phone"
                      type="tel"
                      required
                      className="border-input focus:ring-primary/20 focus:border-primary w-full rounded-xl border bg-background px-4 py-3 transition-all outline-none focus:ring-4"
                      placeholder="010-1234-5678"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 ml-1 block text-sm font-semibold">이메일</label>
                    <input
                      name="email"
                      type="email"
                      required
                      className="border-input focus:ring-primary/20 focus:border-primary w-full rounded-xl border bg-background px-4 py-3 transition-all outline-none focus:ring-4"
                      placeholder="manager@example.com"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 ml-1 block text-sm font-semibold">
                      문의 내용 (선택)
                    </label>
                    <textarea
                      name="content"
                      rows={4}
                      className="border-input focus:ring-primary/20 focus:border-primary w-full resize-none rounded-xl border bg-background px-4 py-3 transition-all outline-none focus:ring-4"
                      placeholder="학생 수, 필요한 기능 등 문의사항을 남겨주세요."
                    />
                  </div>
                </div>

                {message && message !== 'success' && (
                  <div className="bg-destructive/10 border-destructive/20 rounded-xl border p-4">
                    <p className="text-destructive text-center text-sm font-medium">{message}</p>
                  </div>
                )}

                <button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 w-full rounded-xl py-4 font-bold shadow-lg transition-all active:scale-95"
                >
                  문의하기
                </button>

                <p className="text-muted-foreground text-center text-xs">
                  신청 시 <span className="cursor-pointer underline">개인정보 수집 및 이용</span>에
                  동의하게 됩니다.
                </p>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
