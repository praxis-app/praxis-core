import { ComponentProps, SyntheticEvent, useRef, useState } from 'react';
import { useImageSrc } from '@/hooks/use-image-src';
import { cn } from '@/lib/shared.utils';
import { Box } from '@/components/ui/box';

interface Props extends ComponentProps<'img'> {
  alt: string;
  skipAnimation?: boolean;
  isPlaceholder?: boolean;
  imageId?: string;
  src?: string;
  className?: string;
}

export const LazyLoadImage = ({
  alt,
  skipAnimation = false,
  isPlaceholder,
  imageId,
  onLoad,
  src,
  className,
  ...imgProps
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const srcFromImageId = useImageSrc(imageId, ref, !isPlaceholder);
  const [loaded, setLoaded] = useState(!!srcFromImageId);

  const handleLoad = (event: SyntheticEvent<HTMLImageElement, Event>) => {
    onLoad && onLoad(event);
    setLoaded(true);
  };

  const imageClassName = cn(
    'object-cover',
    !skipAnimation && 'transition-all duration-300',
    !skipAnimation && (loaded ? 'blur-0 opacity-100' : 'blur-sm opacity-0'),
    className,
  );

  return (
    <Box
      ref={ref}
      alt={alt}
      as={isPlaceholder ? 'div' : 'img'}
      loading={src ? 'lazy' : 'eager'}
      onLoad={handleLoad}
      src={src || srcFromImageId}
      className={imageClassName}
      {...imgProps}
    />
  );
};
