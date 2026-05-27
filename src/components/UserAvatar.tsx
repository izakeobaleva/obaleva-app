import { User } from 'lucide-react';

interface UserAvatarProps {
  url?: string | null;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function UserAvatar({ url, name, size = 'sm' }: UserAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg',
  };

  const initials = name
    ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  if (url) {
    return (
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-[#1A1528] border-2 border-[#F4D03F]/30 flex items-center justify-center`}>
        <img src={url} alt={name || 'Avatar'} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-[#F4D03F]/30 to-amber-500/30 border-2 border-[#F4D03F]/30 flex items-center justify-center`}>
      <User size={size === 'sm' ? 14 : 20} className="text-[#F4D03F]" />
    </div>
  );
}