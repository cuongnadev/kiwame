export function formatDate(timestamp: Date | string | number): string {
  const date = typeof timestamp === 'string' || typeof timestamp === 'number' 
    ? new Date(timestamp) 
    : timestamp;

  if (isNaN(date.getTime())) {
    return "Thời gian không hợp lệ";
  }

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffSec < 60) {
    return "vừa xong";
  }

  if (diffMin < 60) {
    return `${diffMin} phút trước`;
  }

  if (diffHour < 24) {
    return `${diffHour} giờ trước`;
  }

  if (diffDay < 7) {
    return `${diffDay} ngày trước`;
  }

  if (diffWeek < 4) {
    return `${diffWeek} tuần trước`;
  }

  if (diffMonth < 12) {
    return `${diffMonth} tháng trước`;
  }

  return `${diffYear} năm trước`;
}
