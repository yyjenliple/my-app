'use server';

import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';

export async function submitInquiry(formData: FormData) {
  const supabase = await createClient();

  const academy_name = formData.get('academy_name') as string;
  const full_name = formData.get('full_name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const content = formData.get('content') as string;

  const { error } = await supabase.from('inquiries').insert({
    academy_name,
    full_name,
    email,
    phone,
    content,
  });

  if (error) {
    console.error('Inquiry Error:', error);
    redirect(`/inquiry?message=${encodeURIComponent('문의 등록 중 오류가 발생했습니다.')}`);
  }

  redirect(`/inquiry?message=${encodeURIComponent('success')}`);
}
