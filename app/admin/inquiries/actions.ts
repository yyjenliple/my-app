'use server';

import { revalidatePath } from 'next/cache';

import { createClient } from '@/utils/supabase/server';

export async function updateInquiryStatus(formData: FormData) {
  const supabase = await createClient();

  const id = formData.get('id') as string;
  const status = formData.get('status') as string;
  const admin_comment = formData.get('admin_comment') as string;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('인증되지 않은 사용자입니다.');
  }

  // 1. 현재 문의 상태 및 내역 조회
  const { data: currentInquiry, error: fetchError } = await supabase
    .from('inquiries')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError || !currentInquiry) {
    return { error: '문의 내역을 찾을 수 없습니다.' };
  }

  // 2. 이미 승인된 경우 수정 불가
  if (currentInquiry.status === 'approved') {
    return { error: '이미 승인된 문의는 상태를 변경할 수 없습니다.' };
  }

  let academyId = null;

  // 3. 승인 시 학원 등록 처리
  if (status === 'approved') {
    const { data: academy, error: academyError } = await supabase
      .from('academies')
      .insert({
        name: currentInquiry.academy_name,
        // manager_id는 나중에 유저가 가입할 때 연결하거나,
        // 혹은 이메일 기준으로 프로필을 찾아 연결할 수 있습니다.
      })
      .select()
      .single();

    if (academyError) {
      console.error('Academy Creation Error:', academyError);
      return { error: '학원 등록 중 오류가 발생했습니다.' };
    }
    academyId = academy.id;
  }

  // 4. 문의 상태 업데이트
  const { error } = await supabase
    .from('inquiries')
    .update({
      status,
      admin_comment,
      processed_by: user.id,
      processed_at: new Date().toISOString(),
      academy_id: academyId,
    })
    .eq('id', id);

  if (error) {
    console.error('Update Inquiry Error:', error);
    return { error: error.message };
  }

  revalidatePath('/admin/inquiries');
  return { success: true };
}
