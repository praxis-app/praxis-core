import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useIsDesktop } from '@/hooks/use-is-desktop';
import { cn } from '@/lib/shared.utils';
import { Image } from '@/types/image.types';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import LazyLoadImage from './lazy-load-image';

interface Props {
  image: Image;
  marginBottom?: string | number;
  width?: string | number;
  onImageLoad?(): void;
  className?: string;
}

const AttachedImage = ({
  image,
  marginBottom,
  width = '100%',
  onImageLoad,
  className,
}: Props) => {
  const queryClient = useQueryClient();
  const previouslyLoaded = queryClient.getQueryData(['image', image.id]);
  const [isLoaded, setIsLoaded] = useState(previouslyLoaded);
  const [isEnlarged, setIsEnlarged] = useState(false);

  const { t } = useTranslation();
  const isDesktop = useIsDesktop();

  const loadingHeight = isDesktop ? '400px' : '300px';
  const height = isLoaded ? 'auto' : loadingHeight;

  const imageClassName = cn(
    isLoaded ? 'cursor-pointer' : 'cursor-default',
    className,
  );

  const enlargedImageClassName = cn(
    'object-contain max-w-full max-h-[80%]',
    isDesktop ? 'rounded' : '',
  );

  const handleLoad = () => {
    onImageLoad?.();
    setIsLoaded(true);
  };

  const handleClick = () => {
    if (isLoaded) {
      setIsEnlarged(true);
    }
  };

  return (
    <>
      <Dialog open={isEnlarged} onOpenChange={setIsEnlarged}>
        <DialogContent className="flex h-full w-full flex-col justify-center border-none bg-black/90 p-0">
          {isEnlarged && (
            <LazyLoadImage
              alt={t('images.labels.attachedImage')}
              className={enlargedImageClassName}
              imageId={image.id}
            />
          )}
        </DialogContent>
      </Dialog>

      <LazyLoadImage
        imageId={image.id}
        alt={t('images.labels.attachedImage')}
        width={width}
        height={height}
        onLoad={handleLoad}
        isPlaceholder={image.isPlaceholder}
        onClick={handleClick}
        className={imageClassName}
        style={{ marginBottom }}
      />
    </>
  );
};

export default AttachedImage;
