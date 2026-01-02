'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // Supabase SDK와 createClient 설정에 의해 access_token/refresh_token은
  // 내부적으로 브라우저 쿠키에 자동 저장 및 관리되므로 직접 처리할 필요 없음
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(`/login?message=${encodeURIComponent(error.message)}`);
  }

  // 세션 쿠키가 업데이트된 후, 캐시된 이전 페이지(비로그인 상태)를 새로고침하여 최신 유저 정보를 반영하고 홈으로 이동
  // 로그인 성공 후 "로그인된 세션 쿠키" 발생
  // Next.js는 성능을 위해 이전에 보여줬던 페이지(비로그인 상태의 홈 화면 등)를 메모리에 캐싱해두는 성질이 있음
  // 로그인을 했는데도 화면 상단에 여전히 "로그인" 버튼이 떠 있거나, 이전의 비로그인 상태 화면이 보일 수 있기 때문에, 해당 코드를 통해 전체 레이아웃('/')의 캐시를 새로고침해라 명령
  revalidatePath('/dashboard', 'layout');
  redirect('/dashboard');
}
