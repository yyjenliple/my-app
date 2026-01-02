'use client';

import { useActionState, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { formatDate } from '@/lib/format';

import { updateInquiryStatus } from './actions';

interface InquiryDetailsProps {
  inquiry: any;
}

export function InquiryDetails({ inquiry }: InquiryDetailsProps) {
  const [open, setOpen] = useState(false);
  const isApproved = inquiry.status === 'approved';

  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const result = await updateInquiryStatus(formData);
      if (result.success) {
        setOpen(false);
        return { success: true, error: null };
      }
      return { error: result.error, success: false };
    },
    { error: null, success: false }
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="rounded-lg px-3 py-1.5 text-xs font-bold text-primary transition-all hover:bg-primary/10 active:scale-95">
          상세보기
        </button>
      </DialogTrigger>
      <DialogContent className="overflow-hidden rounded-3xl border-none p-0 shadow-2xl sm:max-w-[650px]">
        <form action={formAction} className="flex flex-col">
          <input type="hidden" name="id" value={inquiry.id} />

          <div className="border-b border-primary/10 bg-primary/5 px-8 py-6">
            <DialogHeader>
              <div className="mb-2 flex items-center justify-between">
                <DialogTitle className="text-xl font-extrabold tracking-tight">
                  {inquiry.academy_name}
                </DialogTitle>
                <div className="flex gap-2">
                  {isApproved && <Badge className="rounded-full px-3">승인 완료</Badge>}
                </div>
              </div>
              <DialogDescription className="font-medium text-muted-foreground">
                {formatDate(inquiry.created_at)}에 접수된 도입 문의입니다.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="max-h-[70vh] space-y-8 overflow-y-auto p-8">
            <div className="grid grid-cols-2 gap-x-12 gap-y-6 text-sm">
              <div className="space-y-1">
                <label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase opacity-60">
                  신청자
                </label>
                <div className="text-base font-semibold tracking-tight text-foreground">
                  {inquiry.full_name}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase opacity-60">
                  연락처
                </label>
                <div className="text-base font-semibold tracking-tight text-foreground">
                  {inquiry.phone || '-'}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase opacity-60">
                  이메일
                </label>
                <div className="text-sm font-semibold tracking-tight text-foreground">
                  {inquiry.email}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase opacity-60">
                  신청시각
                </label>
                <div className="mt-0.5 text-[12px] font-semibold text-muted-foreground tabular-nums">
                  {formatDate(inquiry.created_at)}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase opacity-60">
                문의 내용
              </label>
              <div className="rounded-2xl border border-border/40 bg-muted/30 p-6 text-[15px] leading-relaxed whitespace-pre-wrap text-foreground/90 shadow-inner">
                {inquiry.content || <span className="italic opacity-40">내용이 없습니다.</span>}
              </div>
            </div>

            <div className="h-px bg-linear-to-r from-transparent via-border/50 to-transparent" />

            <div className="grid grid-cols-2 items-start gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-bold tracking-widest text-primary uppercase">
                  처리 상태
                </label>
                <Select name="status" defaultValue={inquiry.status} disabled={isApproved}>
                  <SelectTrigger className="h-11 rounded-xl border-primary/20 bg-primary/5 text-sm font-bold transition-colors hover:bg-primary/10">
                    <SelectValue placeholder="상태 지정" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="pending">대기 중</SelectItem>
                    <SelectItem value="approved">승인 (학원 생성)</SelectItem>
                    <SelectItem value="rejected">거절</SelectItem>
                    <SelectItem value="on_hold">보류</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase opacity-60">
                  마지막 처리일시
                </label>
                <div className="flex h-11 items-center px-1 text-sm font-semibold text-foreground/80 tabular-nums">
                  {inquiry.processed_at ? formatDate(inquiry.processed_at) : '-'}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold tracking-widest text-primary uppercase">
                관리자 코멘트
              </label>
              <Textarea
                name="admin_comment"
                placeholder={
                  isApproved
                    ? '승인 완료된 문의의 코멘트는 수정할 수 없습니다.'
                    : '내부 참고 또는 처리 사유를 기록하세요.'
                }
                className="min-h-[120px] resize-none rounded-2xl border-primary/10 p-4 text-sm leading-relaxed transition-all focus:border-primary/40 focus:ring-0"
                defaultValue={inquiry.admin_comment || ''}
                readOnly={isApproved}
              />
              {state?.error && (
                <p className="animate-in px-1 text-[11px] font-bold text-destructive fade-in slide-in-from-top-1">
                  {state.error}
                </p>
              )}
            </div>

            {inquiry.academy_id && (
              <div className="group flex items-center justify-between rounded-2xl border border-primary/10 bg-primary/5 px-5 py-4 transition-all hover:bg-primary/10">
                <div className="flex items-center gap-2 text-xs font-bold text-primary">
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                  자동 생성된 학원 ID
                </div>
                <div className="font-mono text-[10px] font-medium text-muted-foreground/70">
                  {inquiry.academy_id}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 p-8 pt-0">
            <Button
              type="button"
              variant="ghost"
              className="h-12 flex-1 rounded-xl font-bold transition-all hover:bg-muted/50"
              onClick={() => setOpen(false)}
            >
              닫기
            </Button>
            {!isApproved && (
              <Button
                type="submit"
                className="h-12 flex-1 rounded-xl bg-primary font-extrabold text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:bg-primary/90 active:scale-95"
                disabled={isPending}
              >
                {isPending ? '처리 중...' : '변경사항 저장하기'}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
