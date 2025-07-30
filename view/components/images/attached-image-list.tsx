import { Box } from '@/components/ui/box';
import { cn } from '@/lib/shared.utils';
import { Image } from '@/types/image.types';
import { AttachedImage } from './attached-image';

interface Props {
  images: Image[];
  imageClassName?: string;
  onImageLoad?(): void;
  topRounded?: boolean;
  fillCard?: boolean;
  className?: string;
}

export const AttachedImageList = ({
  images,
  imageClassName,
  onImageLoad,
  topRounded,
  fillCard,
  className,
}: Props) => {
  const boxClassName = cn(fillCard ? '-mx-8' : '', className);

  return (
    <Box className={boxClassName}>
      {images.map((image, index) => {
        const isLastImage = index + 1 === images.length;
        const isFirstImage = index === 0;

        const imageClasses = cn(
          !isLastImage && 'mb-3',
          topRounded && isFirstImage && 'rounded-t-lg',
          imageClassName,
        );

        return (
          <AttachedImage
            key={image.id}
            image={image}
            onImageLoad={onImageLoad}
            className={imageClasses}
          />
        );
      })}
    </Box>
  );
};
