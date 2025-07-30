// TODO: Convert CSS properties to className for Tailwind

import {
  ComponentProps,
  CSSProperties,
  SyntheticEvent,
  useRef,
  useState,
} from 'react';
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

const LazyLoadImage = ({
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

  const animationStyles: CSSProperties = {
    transition: 'filter 0.3s, opacity 0.3s',
    filter: loaded ? 'blur(0)' : 'blur(15px)',
    opacity: loaded ? 1 : 0,
  };

  const imageStyles: CSSProperties = {
    objectFit: 'cover',
    ...(!skipAnimation && animationStyles),
  };

  const handleLoad = (event: SyntheticEvent<HTMLImageElement, Event>) => {
    onLoad && onLoad(event);
    setLoaded(true);
  };

  return (
    <Box
      ref={ref}
      alt={alt}
      component={isPlaceholder ? 'div' : 'img'}
      loading={src ? 'lazy' : 'eager'}
      onLoad={handleLoad}
      src={src || srcFromImageId}
      className={cn(imageStyles, className)}
      {...imgProps}
    />
  );
};

export default LazyLoadImage;
