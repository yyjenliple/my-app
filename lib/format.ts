import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

/**
 * 날짜를 'yyyy. MM. dd. HH:mm:ss' 형식으로 포맷팅합니다.
 */
export function formatDate(date: string | Date) {
  return format(new Date(date), 'yyyy. MM. dd. HH:mm:ss', { locale: ko });
}

/**
 * 날짜를 'yyyy. MM. dd.' 형식으로 짧게 포맷팅합니다.
 */
export function formatDateShort(date: string | Date) {
  return format(new Date(date), 'yyyy. MM. dd.', { locale: ko });
}
