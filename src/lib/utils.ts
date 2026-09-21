import { clsx, type ClassValue } from 'clsx';

// clsx-based class merger (no tailwind-merge needed with our explicit tokens)
export function cn(...inputs: ClassValue[]) {
  // Simple merge — if twMerge is needed, swap this out
  return clsx(inputs);
}

// Format date for display
export function formatDate(date: string | Date | null, opts?: Intl.DateTimeFormatOptions): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', opts ?? { month: 'short', day: 'numeric' });
}

// Format date with year
export function formatDateFull(date: string | Date | null): string {
  return formatDate(date, { month: 'short', day: 'numeric', year: 'numeric' });
}

// Relative time (e.g. "5 minutes ago")
export function timeAgo(date: string | Date | null): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  const diff = Date.now() - d.getTime();
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return 'just now';
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(d);
}

// Get initials from a full name
export function getInitials(name: string | null): string {
  if (!name) return '?';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(n => n[0].toUpperCase())
    .join('');
}

// Truncate text
export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + '…';
}

// Generate a consistent color from a string (for avatars)
const AVATAR_COLORS = [
  '#FF6B35', '#2D6A4F', '#1E3A5F', '#92600A',
  '#5A5A5A', '#9B1C1C', '#3D405B', '#4A7C59',
];
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

// Sleep utility for optimistic UI
export const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

// Debounce
export function debounce<T extends (...args: unknown[]) => unknown>(fn: T, delay: number) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
