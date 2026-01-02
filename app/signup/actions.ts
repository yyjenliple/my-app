'use server';

import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = formData.get('full_name') as string;
  const platformRole = (formData.get('platform_role') as string) || 'user';

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${
        process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      }/auth/callback`,
      data: {
        full_name: fullName,
        platform_role: platformRole,
      },
    },
  });

  if (error) {
    redirect(`/signup?message=${encodeURIComponent(error.message)}`);
  }

  // Next.js 16과 최신 브라우저 환경에서는 서버 액션에서 리다이렉트할 때 x-action-redirect라는 HTTP 헤더를 사용
  // 헤더 값에 인코딩되지 않은 **한글(ASCII 범위를 벗어난 문자)**이 포함되면 브라우저나 서버 엔진에서 TypeError: Invalid character in header content 에러를 던지며 크래시가 발생
  // 따라서 encodeURIComponent를 사용하여 URL 인코딩을 적용하거나 영문 키워드를 사용하는 것이 좋음
  redirect('/login');
}
