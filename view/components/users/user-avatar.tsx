import { cn } from '@/lib/shared.utils';
import chroma from 'chroma-js';
import ColorHash from 'color-hash';
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from '../ui/avatar';

interface Props {
  name: string;
  userId?: string | null;
  className?: string;
  fallbackClassName?: string;
  imageSrc?: string;
  isOnline?: boolean;
  showOnlineStatus?: boolean;
  animateOnlineStatus?: boolean;
}

export const UserAvatar = ({
  name,
  userId,
  className,
  imageSrc,
  fallbackClassName,
  isOnline,
  showOnlineStatus,
  animateOnlineStatus,
}: Props) => {
  const getStringAvatarProps = () => {
    const colorHash = new ColorHash();
    const baseColor = colorHash.hex(userId ?? name);
    const color = chroma(baseColor).brighten(1.5).hex();
    const backgroundColor = chroma(baseColor).darken(1.35).hex();

    return {
      style: { color, backgroundColor },
    };
  };

  return (
    <Avatar className={cn(className)} title={name}>
      <AvatarImage src={imageSrc} alt={name} />

      <AvatarFallback
        className={cn('text-lg font-light', fallbackClassName)}
        {...getStringAvatarProps()}
      >
        {name[0].toUpperCase()}
      </AvatarFallback>

      {showOnlineStatus && isOnline && (
        <AvatarBadge
          position="bottomRight"
          className="border-card h-[15px] w-[15px] border-[2.5px]"
        >
          <span className="relative">
            {animateOnlineStatus && (
              <span className="absolute h-full w-full animate-ping rounded-full bg-(--online) opacity-75"></span>
            )}
            <span className="absolute h-full w-full rounded-full bg-(--online)"></span>
          </span>
        </AvatarBadge>
      )}
    </Avatar>
  );
};
