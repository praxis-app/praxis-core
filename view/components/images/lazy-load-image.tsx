import { Box } from '@/components/ui/box';
import { useImageSrc } from '@/hooks/use-image-src';
import { cn } from '@/lib/shared.utils';
import { ComponentProps, SyntheticEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

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
  const [failed, setFailed] = useState(false);
  const { t } = useTranslation();

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

  const resolvedSrc = src || srcFromImageId;
  const as = isPlaceholder || !resolvedSrc || failed ? 'div' : 'img';

  return (
    <>
      <Box
        ref={ref}
        alt={alt}
        as={as}
        loading={resolvedSrc ? 'lazy' : undefined}
        onLoad={handleLoad}
        onError={() => setFailed(true)}
        src={resolvedSrc}
        className={imageClassName}
        {...imgProps}
      />
      {as === 'div' && !isPlaceholder && (
        <div className="text-muted-foreground text-sm">
          {t('images.errors.fileMissing')}
        </div>
      )}
    </>
  );
};
