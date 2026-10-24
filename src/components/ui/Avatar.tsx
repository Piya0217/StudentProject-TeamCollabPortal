/**
 * Avatar — circular user avatar with initials fallback.
 * AvatarStack — overlapping row of avatars with overflow count.
 */
import { cn } from '@/lib/cn'

const sizeMap = {
  xs: { outer: 'w-6 h-6', text: 'text-[10px]' },
  sm: { outer: 'w-8 h-8', text: 'text-caption' },
  md: { outer: 'w-10 h-10', text: 'text-body' },
  lg: { outer: 'w-12 h-12', text: 'text-headline' },
  xl: { outer: 'w-16 h-16', text: 'text-title-2' },
}

/** Background colors derived from initials hash — deterministic per user */
const avatarColors = [
  { bg: '#E3F2FD', text: '#1565C0' },
  { bg: '#E8F5E9', text: '#1B5E20' },
  { bg: '#F3E5F5', text: '#6A1B9A' },
  { bg: '#FFF3E0', text: '#E65100' },
  { bg: '#E0F7FA', text: '#006064' },
  { bg: '#FCE4EC', text: '#880E4F' },
  { bg: '#F1F8E9', text: '#33691E' },
]

function getAvatarColor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return avatarColors[Math.abs(hash) % avatarColors.length] ?? avatarColors[0]!
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('')
}

export interface AvatarProps {
  /** Full name — used for initials and aria-label */
  name: string
  /** Optional image URL */
  src?: string
  size?: keyof typeof sizeMap
  className?: string
}

export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  const { outer, text } = sizeMap[size]
  const color = getAvatarColor(name)
  const initials = getInitials(name)

  return (
    <span
      role="img"
      aria-label={name}
      className={cn(
        'relative inline-flex items-center justify-center shrink-0',
        'rounded-full overflow-hidden select-none',
        'ring-2 ring-surface',
        outer,
        className,
      )}
      style={!src ? { backgroundColor: color.bg, color: color.text } : undefined}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span className={cn('font-semibold leading-none', text)}>{initials}</span>
      )}
    </span>
  )
}

export interface AvatarStackProps {
  users: Array<{ name: string; src?: string }>
  max?: number
  size?: keyof typeof sizeMap
  className?: string
}

export function AvatarStack({ users, max = 4, size = 'sm', className }: AvatarStackProps) {
  const visible = users.slice(0, max)
  const overflow = users.length - max

  return (
    <div className={cn('flex items-center', className)}>
      {visible.map((user, idx) => (
        <Avatar
          key={user.name}
          name={user.name}
          src={user.src}
          size={size}
          className={cn(idx > 0 && '-ml-2')}
        />
      ))}
      {overflow > 0 && (
        <span
          className={cn(
            '-ml-2 inline-flex items-center justify-center',
            'rounded-full ring-2 ring-surface',
            'bg-fill-tertiary text-ink-secondary font-semibold',
            sizeMap[size].outer,
            sizeMap[size].text,
          )}
          aria-label={`${overflow} more team members`}
        >
          +{overflow}
        </span>
      )}
    </div>
  )
}
